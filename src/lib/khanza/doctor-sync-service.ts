import { createSupabaseServerClient } from '@/lib/supabase-server';
import { getActiveDoctorsFromKhanza } from './khanza-integration-final';
import { Doctor } from '@/lib/admin-types';

// Fungsi untuk menyinkronkan dokter dari SIMRS Khanza ke database lokal
export async function syncDoctorsFromKhanza() {
  try {
    // Ambil dokter aktif dari SIMRS Khanza
    const khanzaDoctors = await getActiveDoctorsFromKhanza();
    
    // Transformasi data dokter dari SIMRS ke format lokal
    const localDoctors = khanzaDoctors.map((khanzaDoctor: any) => ({
      id: null, // ID akan dibuat oleh Supabase
      user_id: khanzaDoctor.kd_dokter, // Gunakan kode dokter sebagai user_id
      name: khanzaDoctor.nm_dokter,
      specialty: khanzaDoctor.nm_poli || 'Umum', // Gunakan nama poli sebagai spesialisasi
      image_url: null, // Tidak ada foto dari SIMRS
      description: `Dokter spesialis di ${khanzaDoctor.nm_poli || 'bagian umum'}`,
      experience_years: null,
      education: null,
      certifications: [],
      consultation_fee: null,
      slug: khanzaDoctor.nm_dokter.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/^-+|-+$/g, ''),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    // Dapatkan client Supabase
    const supabase = await createSupabaseServerClient(true); // service role client
    
    if (!supabase) {
      throw new Error("Tidak dapat membuat koneksi Supabase");
    }

    // Sinkronisasi dokter ke database lokal
    for (const doctor of localDoctors) {
      // Cek apakah dokter sudah ada di database lokal berdasarkan user_id
      const { data: existingDoctor, error: fetchError } = await supabase
        .from('doctors')
        .select('id, name')
        .eq('user_id', doctor.user_id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        // Jika error selain "not found", lempar error
        console.error(`Error fetching doctor with user_id ${doctor.user_id}:`, fetchError);
        continue;
      }

      if (existingDoctor) {
        // Jika dokter sudah ada, update data
        const { error: updateError } = await supabase
          .from('doctors')
          .update({
            name: doctor.name,
            specialty: doctor.specialty,
            description: doctor.description,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingDoctor.id);

        if (updateError) {
          console.error(`Error updating doctor ${existingDoctor.id}:`, updateError);
          continue;
        }

        console.log(`Updated doctor: ${doctor.name}`);
      } else {
        // Jika dokter belum ada, masukkan sebagai dokter baru
        const { data: newDoctor, error: insertError } = await supabase
          .from('doctors')
          .insert([{
            user_id: doctor.user_id,
            name: doctor.name,
            specialty: doctor.specialty,
            image_url: doctor.image_url,
            description: doctor.description,
            experience_years: doctor.experience_years,
            education: doctor.education,
            certifications: doctor.certifications,
            consultation_fee: doctor.consultation_fee,
            slug: doctor.slug
          }])
          .select()
          .single();

        if (insertError) {
          console.error(`Error inserting doctor ${doctor.name}:`, insertError);
          continue;
        }

        console.log(`Added new doctor: ${doctor.name}`);
      }
    }

    return {
      success: true,
      message: `Berhasil menyinkronkan ${localDoctors.length} dokter dari SIMRS Khanza`,
      count: localDoctors.length
    };

  } catch (error) {
    console.error('Error syncing doctors from Khanza:', error);
    throw new Error(`Error syncing doctors from SIMRS Khanza: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Fungsi untuk mengambil jadwal dokter langsung dari SIMRS Khanza
export async function getDoctorSchedulesFromKhanzaDirect(doctorCode?: string, date?: string) {
  try {
    const khanzaSchedules = await getDoctorSchedulesFromKhanza(doctorCode, date);
    
    // Transformasi ke format yang sesuai dengan aplikasi Anda
    const formattedSchedules = khanzaSchedules.map((schedule: any) => ({
      id: `${schedule.kd_dokter}_${schedule.hari_kerja || schedule.tanggal}_${
        schedule.jam_mulai || schedule.jam_buka
      }`.replace(/[^a-zA-Z0-9_]/g, '_'),
      doctor_id: schedule.kd_dokter,
      date: schedule.tanggal || date || new Date().toISOString().split('T')[0],
      start_time: schedule.jam_mulai || schedule.jam_buka,
      end_time: schedule.jam_selesai || schedule.jam_tutup,
      available: schedule.kuota > (schedule.jumlah || 0),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      max_patients: schedule.kuota || 0,
      current_patients: schedule.jumlah || 0,
    }));

    return formattedSchedules;
  } catch (error) {
    console.error('Error getting doctor schedules from Khanza:', error);
    throw new Error(`Error getting doctor schedules: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Fungsi untuk mengambil dokter dengan jadwal dari SIMRS
export async function getDoctorsWithSchedulesFromKhanza() {
  try {
    // Ambil dokter dari SIMRS
    const doctors = await getActiveDoctorsFromKhanza();
    
    // Ambil jadwal untuk setiap dokter
    const doctorsWithSchedules = await Promise.all(doctors.map(async (doctor: any) => {
      try {
        const schedules = await getDoctorSchedulesFromKhanzaDirect(doctor.kd_dokter);
        return {
          ...doctor,
          schedules: schedules,
        };
      } catch (error) {
        console.error(`Error getting schedules for doctor ${doctor.kd_dokter}:`, error);
        return {
          ...doctor,
          schedules: [],
        };
      }
    }));

    return doctorsWithSchedules;
  } catch (error) {
    console.error('Error getting doctors with schedules from Khanza:', error);
    throw new Error(`Error getting doctors with schedules: ${error instanceof Error ? error.message : String(error)}`);
  }
}