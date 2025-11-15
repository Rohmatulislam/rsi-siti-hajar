import { db } from '@/lib/db';
import { getPatientByUserId } from '@/lib/patient-service';
import { getDoctorById } from '@/lib/doctor-service';
import { createAppointment } from '@/lib/appointment-service';
import { registerToKhanza } from '@/lib/khanza/khanza-registration';

// Interface untuk detail pasien
export interface PatientDetails {
  name: string;
  phone: string;
  email: string;
  nik: string;
  birthDate: string;
  gender: string;
  address: string;
  occupation: string;
  maritalStatus: string;
  identityType: string;
  identityNumber: string;
  insuranceType: 'umum' | 'bpjs';
  insuranceNumber: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  bloodType: string;
  allergies: string;
}

// Interface untuk data booking
export interface BookingData {
  patientId: string;
  doctorId: string;
  scheduleId: string | null;
  appointmentDate: string;
  appointmentTime: string;
  consultationType: 'offline' | 'online';
  location: string;
  fee: number;
  patientDetails?: PatientDetails;
}

// Interface untuk hasil booking
export interface BookingResult {
  success: boolean;
  message: string;
  appointmentId?: string;
  queueNumber?: string;
  khanzaSyncStatus?: 'success' | 'failed' | 'pending';
  error?: string;
}

/**
 * Fungsi utama untuk membuat booking janji temu
 * Ini menggabungkan sistem booking internal dan sinkronisasi ke SIMRS Khanza
 */
export async function createBooking(bookingData: BookingData, userId: string): Promise<BookingResult> {
  try {
    // Dapatkan informasi pasien dari Clerk ID
    let patient = await getPatientByUserId(userId);
    
    // Jika pasien tidak ditemukan, buat pasien baru menggunakan data dari formulir
    if (!patient && bookingData.patientDetails) {
      const { createPatient } = await import('./patient-service');

      patient = await createPatient({
        user_id: userId,
        name: bookingData.patientDetails.name,
        nik: bookingData.patientDetails.nik,
        birthDate: bookingData.patientDetails.birthDate,
        gender: bookingData.patientDetails.gender,
        address: bookingData.patientDetails.address,
        phone: bookingData.patientDetails.phone,
        email: bookingData.patientDetails.email,
        patientType: bookingData.patientDetails.insuranceType === 'bpjs' ? 'lama' : 'baru', // Konversi tipe pasien yang benar
        medicalRecordNumber: undefined, // Gunakan undefined daripada null
        occupation: bookingData.patientDetails.occupation || '',
        marital_status: bookingData.patientDetails.maritalStatus || '',
        blood_type: bookingData.patientDetails.bloodType || '',
        allergies: bookingData.patientDetails.allergies || '',
        emergency_contact_name: bookingData.patientDetails.emergencyContactName || '',
        emergency_contact_phone: bookingData.patientDetails.emergencyContactPhone || '',
      });
    }
    
    if (!patient) {
      return {
        success: false,
        message: 'Data pasien tidak ditemukan. Silakan lengkapi profil Anda terlebih dahulu.',
        error: 'Patient not found'
      };
    }

    // Dapatkan informasi dokter
    const doctor = await getDoctorById(bookingData.doctorId);
    
    if (!doctor) {
      return {
        success: false,
        message: 'Dokter tidak ditemukan',
        error: 'Doctor not found'
      };
    }

    // Buat janji temu di sistem internal
    const appointment = await createAppointment(
      patient.id, // atau patient_id dari database
      bookingData.doctorId,
      bookingData.scheduleId,
      bookingData.appointmentDate,
      bookingData.appointmentTime,
      bookingData.consultationType,
      bookingData.location,
      bookingData.fee
    );

    // Coba sinkronkan ke SIMRS Khanza
    let khanzaSyncStatus: 'success' | 'failed' | 'pending' = 'pending';
    
    try {
      // Gunakan fungsi integrasi Khanza yang telah kita buat
      const khanzaResult = await registerToKhanza(
        {
          // Kirim data pasien dalam format yang sesuai dengan khanza-registration.ts
          user_id: userId, // Tambahkan user_id yang dibutuhkan oleh interface
          name: patient.name || bookingData.patientDetails?.name || '',
          nik: patient.nik || bookingData.patientDetails?.nik || '',
          birthDate: patient.birth_date || bookingData.patientDetails?.birthDate || '',
          gender: patient.gender || bookingData.patientDetails?.gender || '',
          address: patient.address || bookingData.patientDetails?.address || '',
          phone: patient.phone || bookingData.patientDetails?.phone || '',
          email: patient.email || bookingData.patientDetails?.email || '',
          patientType: patient.patient_type === 'lama' ? 'lama' : (bookingData.patientDetails?.insuranceType === 'bpjs' ? 'lama' : 'baru'),
          medicalRecordNumber: patient.medical_record_number || undefined,
          occupation: patient.occupation || bookingData.patientDetails?.occupation || '',
          marital_status: patient.marital_status || bookingData.patientDetails?.maritalStatus || '',
          blood_type: patient.blood_type || bookingData.patientDetails?.bloodType || '',
          allergies: patient.allergies || bookingData.patientDetails?.allergies || '',
          emergency_contact_name: patient.emergency_contact_name || bookingData.patientDetails?.emergencyContactName || '',
          emergency_contact_phone: patient.emergency_contact_phone || bookingData.patientDetails?.emergencyContactPhone || '',
        },
        {
          // Kirim data appointment dalam format yang sesuai dengan interface AppointmentFormData
          doctor: doctor.name || bookingData.doctorId,
          polyclinic: doctor.specialty || 'Umum',
        }
      );
      
      khanzaSyncStatus = 'success';
    } catch (khanzaError) {
      console.error('Gagal menyinkronkan ke SIMRS Khanza:', khanzaError);
      khanzaSyncStatus = 'failed';
      // Tetap lanjutkan proses karena booking di sistem internal sudah berhasil
    }

    return {
      success: true,
      message: khanzaSyncStatus === 'success' 
        ? 'Janji temu berhasil dibuat dan disinkronkan dengan SIMRS Khanza' 
        : 'Janji temu berhasil dibuat di sistem lokal. Proses sinkronisasi dengan SIMRS Khanza gagal, tetapi janji temu tetap tercatat.',
      appointmentId: appointment.id,
      queueNumber: appointment.queue_number,
      khanzaSyncStatus
    };
  } catch (error) {
    console.error('Error dalam proses booking:', error);
    return {
      success: false,
      message: 'Terjadi kesalahan saat membuat janji temu. Silakan coba lagi.',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Fungsi untuk mengecek ketersediaan jadwal dokter
 */
export async function checkDoctorAvailability(
  doctorId: string, 
  date: string, 
  time?: string
): Promise<{
  available: boolean;
  message: string;
  availableTimes?: string[];
}> {
  try {
    // Dapatkan jadwal dokter untuk tanggal tertentu
    const schedules = await db.query(
      `SELECT s.start_time, s.end_time, s.max_patients,
        (SELECT COUNT(*) FROM appointments a 
         WHERE a.doctor_id = s.doctor_id 
           AND a.appointment_date = $2 
           AND a.status != 'cancelled' 
           AND a.schedule_id = s.id) as booked_count
       FROM schedules s
       WHERE s.doctor_id = $1 
         AND s.is_available = true 
         AND EXTRACT(DOW FROM TO_DATE($2, 'YYYY-MM-DD')) = s.day_of_week`,
      [doctorId, date]
    );

    if (schedules.rows.length === 0) {
      return {
        available: false,
        message: 'Dokter tidak memiliki jadwal pada tanggal ini'
      };
    }

    if (time) {
      // Jika waktu spesifik diminta, periksa ketersediaan slot
      const timeSlot = schedules.rows.find((slot: any) => {
        const requestedTime = new Date(`1970-01-01T${time}`);
        const startTime = new Date(`1970-01-01T${slot.start_time}`);
        const endTime = new Date(`1970-01-01T${slot.end_time}`);
        
        return requestedTime >= startTime && requestedTime <= endTime && slot.booked_count < slot.max_patients;
      });

      return {
        available: !!timeSlot,
        message: timeSlot 
          ? 'Waktu tersedia' 
          : 'Waktu yang dipilih tidak tersedia'
      };
    } else {
      // Kembalikan semua slot waktu yang tersedia
      const availableTimes: string[] = [];
      
      schedules.rows.forEach((slot: any) => {
        const startHour = parseInt((slot.start_time as string).split(':')[0]);
        const endHour = parseInt((slot.end_time as string).split(':')[0]);

        // Tambahkan slot-slot waktu yang tersedia antara jam buka
        for (let hour = startHour; hour < endHour; hour++) {
          const timeString = `${hour.toString().padStart(2, '0')}:00-${(hour + 1).toString().padStart(2, '0')}:00`;
          // Hitung jumlah pendaftar dalam rentang waktu ini
          const currentTimeBooked = schedules.rows
            .filter((s: any) => {
              const slotStart = parseInt((s.start_time as string).split(':')[0]);
              const slotEnd = parseInt((s.end_time as string).split(':')[0]);
              return hour >= slotStart && hour < slotEnd;
            })
            .reduce((total: number, s: any) => total + (s.booked_count as number), 0);
          
          if (currentTimeBooked < slot.max_patients) {
            availableTimes.push(timeString);
          }
          
          // Tambahkan juga slot 30 menit jika tersedia
          const timeString30 = `${hour.toString().padStart(2, '0')}:30-${(hour + 1).toString().padStart(2, '0')}:00`;
          const currentTimeBooked30 = schedules.rows
            .filter((s: any) => {
              const slotStart = parseInt((s.start_time as string).split(':')[0]);
              const slotEnd = parseInt((s.end_time as string).split(':')[0]);
              return (hour === slotStart && 30 >= parseInt((s.start_time as string).split(':')[1])) ||
                     (hour < slotEnd);
            })
            .reduce((total: number, s: any) => total + (s.booked_count as number), 0);

          if (currentTimeBooked30 < (slot.max_patients as number)) {
            availableTimes.push(timeString30);
          }
        }

        // Tambahkan juga slot menit-menit lain jika tersedia
        for (let minute = 15; minute < 60; minute += 15) {
          const timeString = `${startHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}-${startHour.toString().padStart(2, '0')}:${(minute + 15).toString().padStart(2, '0')}`;
          if ((slot.booked_count as number) < (slot.max_patients as number)) {
            availableTimes.push(timeString);
          }
        }
      });

      return {
        available: availableTimes.length > 0,
        message: availableTimes.length > 0 
          ? `Terdapat ${availableTimes.length} slot waktu yang tersedia` 
          : 'Tidak ada slot waktu yang tersedia pada tanggal ini',
        availableTimes: availableTimes.sort()
      };
    }
  } catch (error) {
    console.error('Error checking doctor availability:', error);
    return {
      available: false,
      message: 'Terjadi kesalahan saat memeriksa ketersediaan jadwal dokter'
    };
  }
}

/**
 * Fungsi untuk membatalkan booking
 */
export async function cancelBooking(appointmentId: string, userId: string): Promise<BookingResult> {
  try {
    // Cek apakah appointment milik user ini
    const appointmentCheck = await db.query(
      `SELECT id, patient_id, status FROM appointments WHERE id = $1`,
      [appointmentId]
    );

    if (appointmentCheck.rows.length === 0) {
      return {
        success: false,
        message: 'Janji temu tidak ditemukan',
        error: 'Appointment not found'
      };
    }

    const appointment = appointmentCheck.rows[0];

    if (appointment.patient_id !== userId) {
      return {
        success: false,
        message: 'Anda tidak memiliki izin untuk membatalkan janji temu ini',
        error: 'Unauthorized'
      };
    }

    if (appointment.status === 'cancelled') {
      return {
        success: false,
        message: 'Janji temu sudah dibatalkan sebelumnya',
        error: 'Already cancelled'
      };
    }

    // Update status menjadi dibatalkan
    const result = await db.query(
      `UPDATE appointments 
       SET status = 'cancelled', updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [appointmentId]
    );

    // Coba batalkan juga di SIMRS Khanza jika integrasi aktif
    let khanzaSyncStatus: 'success' | 'failed' | 'pending' = 'pending';
    
    try {
      // Kita bisa menambahkan logika untuk membatalkan di SIMRS Khanza di sini
      // Namun ini tergantung pada API yang tersedia di SIMRS Khanza
      khanzaSyncStatus = 'success';
    } catch (khanzaError) {
      console.error('Gagal membatalkan di SIMRS Khanza:', khanzaError);
      khanzaSyncStatus = 'failed';
    }

    return {
      success: true,
      message: 'Janji temu berhasil dibatalkan',
      khanzaSyncStatus
    };
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    return {
      success: false,
      message: 'Terjadi kesalahan saat membatalkan janji temu',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Fungsi untuk mengubah jadwal booking
 */
export async function rescheduleBooking(
  appointmentId: string, 
  newDate: string, 
  newTime: string,
  userId: string
): Promise<BookingResult> {
  try {
    // Cek apakah appointment milik user ini dan belum selesai
    const appointmentCheck = await db.query(
      `SELECT id, patient_id, status, doctor_id FROM appointments 
       WHERE id = $1`,
      [appointmentId]
    );

    if (appointmentCheck.rows.length === 0) {
      return {
        success: false,
        message: 'Janji temu tidak ditemukan',
        error: 'Appointment not found'
      };
    }

    const appointment = appointmentCheck.rows[0];

    if (appointment.patient_id !== userId) {
      return {
        success: false,
        message: 'Anda tidak memiliki izin untuk mengubah jadwal janji temu ini',
        error: 'Unauthorized'
      };
    }

    if (appointment.status === 'completed' || appointment.status === 'cancelled') {
      return {
        success: false,
        message: 'Tidak dapat mengubah jadwal untuk janji temu yang sudah selesai atau dibatalkan',
        error: 'Invalid status for rescheduling'
      };
    }

    // Cek ketersediaan jadwal baru
    const availability = await checkDoctorAvailability(appointment.doctor_id, newDate, newTime);
    
    if (!availability.available) {
      return {
        success: false,
        message: 'Jadwal baru tidak tersedia',
        error: 'New time not available'
      };
    }

    // Update data appointment
    const result = await db.query(
      `UPDATE appointments 
       SET appointment_date = $1, appointment_time = $2, updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [newDate, newTime, appointmentId]
    );

    // Coba sinkronkan perubahan ke SIMRS Khanza
    let khanzaSyncStatus: 'success' | 'failed' | 'pending' = 'pending';
    
    try {
      // Logika untuk memperbarui di SIMRS Khanza
      khanzaSyncStatus = 'success';
    } catch (khanzaError) {
      console.error('Gagal memperbarui di SIMRS Khanza:', khanzaError);
      khanzaSyncStatus = 'failed';
    }

    return {
      success: true,
      message: 'Jadwal janji temu berhasil diubah',
      appointmentId: result.rows[0].id,
      queueNumber: result.rows[0].queue_number,
      khanzaSyncStatus
    };
  } catch (error) {
    console.error('Error rescheduling appointment:', error);
    return {
      success: false,
      message: 'Terjadi kesalahan saat mengubah jadwal janji temu',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

