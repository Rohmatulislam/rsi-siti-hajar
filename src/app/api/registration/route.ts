import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { createPatient, createAppointment, getPatientByNIK } from '@/lib/patient-service';
import { generateQueueNumber } from '@/lib/queue-generator';
import { registerToKhanza } from '@/lib/khanza-integration';

export async function POST(request: NextRequest) {
  try {
    const {
      nik,
      name,
      gender,
      birthDate,
      address,
      phone,
      patientType,
      polyclinic,
      doctor
    } = await request.json();

    // Validasi data masukan
    if (!nik || !name || !gender || !birthDate || !address || !phone || !polyclinic || !doctor) {
      return NextResponse.json({ 
        message: 'Missing required fields' 
      }, { status: 400 });
    }

    // Validasi NIK (harus 16 karakter)
    if (nik.length !== 16 || isNaN(Number(nik))) {
      return NextResponse.json({ 
        message: 'NIK harus berupa 16 digit angka' 
      }, { status: 400 });
    }

    // Periksa apakah pasien sudah terdaftar sebelumnya
    let patient = await getPatientByNIK(nik);

    if (patient) {
      // Jika pasien sudah ada dan pasien lama, perbarui info
      if (patientType === 'lama') {
        // Jika pasien lama, gunakan nomor rekam medis yang lama
        // Tapi kita juga perbarui informasi lainnya jika perlu
      } else {
        return NextResponse.json({ 
          message: 'Pasien dengan NIK ini sudah terdaftar' 
        }, { status: 409 });
      }
    } else {
      // Jika pasien belum terdaftar, buat data pasien baru
      patient = await createPatient({
        nik,
        name,
        gender,
        birthDate,
        address,
        phone,
        medicalRecordNumber: undefined, // Akan diisi dari SIMRS Khanza
        patientType
      });
    }

    let khanzaResult: any = null;
    let queueNumber = generateQueueNumber(polyclinic); // Gunakan queue lokal sebagai fallback

    try {
      // Kirim data ke SIMRS Khanza
      khanzaResult = await registerToKhanza(
        {
          nik,
          name,
          gender,
          birthDate,
          address,
          phone,
          patientType
        },
        {
          polyclinic,
          doctor
        }
      );
      
      // Jika integrasi ke SIMRS Khanza berhasil, gunakan nomor antrian dari SIMRS
      queueNumber = khanzaResult.queueNumber;
      
      console.log('Registrasi ke SIMRS Khanza berhasil:', khanzaResult);
    } catch (khanzaError) {
      // Jika registrasi ke SIMRS Khanza gagal, tetap lanjutkan dengan sistem lokal
      console.error('Registrasi ke SIMRS Khanza gagal, melanjutkan dengan sistem lokal:', khanzaError);
      
      // Dalam mode SIMRS Khanza Desktop yang tidak selalu aktif, 
      // kita tetap ingin registrasi berhasil di sistem lokal kita
    }
    
    // Buat janji temu di sistem lokal kita
    const appointment = await createAppointment(patient.id, {
      polyclinic,
      doctor
    }, queueNumber);

    // Kembalikan data konfirmasi
    return NextResponse.json({
      success: true,
      patient: {
        ...patient,
        medical_record_number: khanzaResult?.localMedicalRecordNumber || null
      },
      appointment,
      queueNumber,
      visitDate: new Date().toISOString().split('T')[0],
      message: khanzaResult 
        ? 'Pendaftaran berhasil dan telah disinkronkan dengan SIMRS Khanza' 
        : 'Pendaftaran berhasil di sistem lokal. SIMRS Khanza sedang tidak dapat dihubungi.',
      khanzaSyncStatus: khanzaResult ? 'success' : 'failed',
      syncMethod: process.env.KHANZA_DB_HOST ? 'database' : process.env.KHANZA_BASE_URL ? 'bridging' : 'none'
    });
  } catch (error: any) {
    console.error('Error in registration API:', error);
    return NextResponse.json({ 
      message: 'Registrasi gagal. Silakan coba lagi.',
      error: error.message 
    }, { status: 500 });
  }
}