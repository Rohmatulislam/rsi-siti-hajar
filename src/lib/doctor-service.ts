'use server';

import { createSupabaseServerClient } from '@/lib/supabase-server';
import { auth } from '@clerk/nextjs/server';
import { Doctor } from '@/lib/admin-types';

// Helper untuk dapatkan supabase admin client
async function getAdminClient() {
  const supabase = await createSupabaseServerClient(true); // pakai service role
  if (!supabase) throw new Error("Supabase client (service role) tidak dapat dibuat");
  return supabase;
}

// ✅ Fungsi untuk verifikasi admin
async function verifyAdmin(userId: string) {
  const supabase = await getAdminClient();
  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('❌ Gagal cek role admin:', error);
    throw new Error('Gagal memeriksa role pengguna');
  }

  if (!data || data.role !== 'admin') {
    throw new Error('Access denied: hanya admin yang diizinkan');
  }

  return true;
}

// ✅ Ambil semua dokter (untuk admin)
export async function getAllDoctors() {
  const { userId } = await auth();
  if (!userId) throw new Error('User not authenticated');

  await verifyAdmin(userId);

  const supabase = await getAdminClient();
  const { data, error } = await supabase
    .from('doctors')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching doctors:', error);
    // Tangani error khusus dengan pesan yang lebih informatif
    throw new Error(`Error fetching doctors: ${error.message}`);
  }

  return data || [];
}

// ✅ Ambil semua dokter (publik - untuk appointment)
// ✅ Fungsi untuk mendapatkan semua dokter dengan jadwal dasar untuk appointment
export async function getAllDoctorsWithSchedules() {
  const supabase = await getAdminClient();

  // Dapatkan semua dokter terlebih dahulu
  const { data: doctors, error: doctorsError } = await supabase
    .from('doctors')
    .select('*')
    .order('name', { ascending: true });

  if (doctorsError) {
    console.error('Error fetching doctors:', doctorsError);
    throw new Error(`Error fetching doctors: ${doctorsError.message}`);
  }

  // Dapatkan jadwal untuk semua dokter dalam satu query batch
  const doctorIds = doctors.map(doctor => doctor.id);

  const { data: schedules, error: schedulesError } = await supabase
    .from('schedules')
    .select('*')
    .in('doctor_id', doctorIds)
    .order('date');

  if (schedulesError) {
    console.error('Error fetching schedules:', schedulesError);
    throw new Error(`Error fetching schedules: ${schedulesError.message}`);
  }

  // Gabungkan data dokter dengan jadwal mereka
  const doctorsWithSchedules = doctors.map(doctor => {
    const doctorSchedules = schedules.filter(schedule => schedule.doctor_id === doctor.id);
    return {
      ...doctor,
      schedules: doctorSchedules
    };
  });

  return doctorsWithSchedules;
}

export async function getAllDoctorsForAppointment() {
  const supabase = await getAdminClient();
  const { data, error } = await supabase
    .from('doctors')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching doctors for appointment:', error);
    // Tangani error khusus dengan pesan yang lebih informatif
    throw new Error(`Error fetching doctors for appointment: ${error.message}`);
  }

  return data || [];
}

// ✅ Hapus dokter
export async function deleteDoctor(doctorId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('User not authenticated');

  await verifyAdmin(userId);

  const supabase = await getAdminClient();
  const { error } = await supabase.from('doctors').delete().eq('id', doctorId);

  if (error) {
    console.error('Error deleting doctor:', error);
    // Tangani error khusus untuk dokter yang tidak ditemukan
    if (error.code === 'PGRST116') {
      throw new Error(`Doctor with ID ${doctorId} not found`);
    }
    throw new Error(`Error deleting doctor: ${error.message}`);
  }

  return true;
}

// Fungsi untuk menghasilkan slug dari nama
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .normalize('NFD') // Normalisasi karakter Unicode
    .replace(/[\u0300-\u036f]/g, '') // Hapus aksen
    .replace(/[^\w\s-]/g, '') // Hapus karakter khusus
    .replace(/[\s_-]+/g, '-') // Ganti spasi dengan tanda hubung
    .replace(/^-+|-+$/g, ''); // Hapus tanda hubung di awal/akhir
}

// Fungsi untuk memastikan slug unik
async function ensureUniqueSlug(supabase: any, baseSlug: string, doctorId?: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  // Normalisasi slug untuk menghindari karakter khusus
  slug = slug
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '');

  while (true) {
    // Cek apakah slug ini sudah digunakan
    const query = supabase
      .from('doctors')
      .select('id')
      .eq('slug', slug)
      .limit(1);

    // Jika ada doctorId, abaikan dokter ini dalam pengecekan
    if (doctorId) {
      query.neq('id', doctorId);
    }

    const { data, error } = await query;

    // Jika tidak ada error dan tidak ada dokter dengan slug ini
    if (!error && (!data || data.length === 0)) {
      return slug;
    }

    // Jika slug sudah digunakan, tambahkan angka
    slug = `${baseSlug}-${counter}`;
    counter++;

    // Batasi jumlah percobaan untuk mencegah loop tak terbatas
    if (counter > 100) {
      throw new Error('Tidak dapat menghasilkan slug unik setelah 100 percobaan');
    }
  }
}

// ✅ Tambah dokter
export async function createDoctor(doctorData: Partial<Doctor>) {
  const { userId } = await auth();
  if (!userId) throw new Error('User not authenticated');

  await verifyAdmin(userId);

  const supabase = await getAdminClient();

  // Jika user_id tidak disediakan atau kosong, tidak masalah karena admin yang menambahkan
  // Jika user_id disediakan, kita tetap lanjutkan prosesnya
  const doctorWithSlug = {
    ...doctorData
  };

  if (!doctorWithSlug.slug && doctorWithSlug.name) {
    const baseSlug = generateSlug(doctorWithSlug.name);
    doctorWithSlug.slug = await ensureUniqueSlug(supabase, baseSlug);
  }

  const { data, error } = await supabase
    .from('doctors')
    .insert([doctorWithSlug])
    .select()
    .single();

  if (error) {
    console.error('Error creating doctor:', error);
    // Tangani error duplikasi user_id atau slug
    if (error.code === '23505') {
      // Periksa apakah error terkait dengan constraint user_id
      if (error.message.includes('doctors_user_id_key')) {
        // Jika admin ingin menambahkan dokter baru dengan user_id yang sudah digunakan,
        // kita tetap izinkan karena admin memiliki full control
        // Tapi kita tambahkan penomoran atau suffix ke user_id agar tetap unik
        const modifiedDoctorData = {
          ...doctorData,
          user_id: `${doctorData.user_id}_${Date.now()}`
        };

        // Coba lagi dengan user_id yang dimodifikasi
        const { data: newData, error: newError } = await supabase
          .from('doctors')
          .insert([modifiedDoctorData])
          .select()
          .single();

        if (newError) {
          console.error('Error creating doctor with modified user_id:', newError);
          throw new Error(`Error creating doctor: ${newError.message}`);
        }

        return newData;
      }

      // Jika error terkait dengan slug, coba generate slug baru
      const baseSlug = doctorWithSlug.slug || generateSlug(doctorWithSlug.name || 'dokter-tidak-dikenal');
      const newSlug = await ensureUniqueSlug(supabase, baseSlug);

      // Coba insert kembali dengan slug baru
      const { data: newData, error: newError } = await supabase
        .from('doctors')
        .insert([{ ...doctorWithSlug, slug: newSlug }])
        .select()
        .single();

      if (newError) {
        console.error('Error creating doctor with new slug:', newError);
        throw new Error(`Error creating doctor: ${newError.message}`);
      }

      return newData;
    }
    throw new Error(`Error creating doctor: ${error.message}`);
  }

  return data;
}

// ✅ Update dokter
export async function updateDoctor(doctorId: string, doctorData: Partial<Doctor>) {
  const { userId } = await auth();
  if (!userId) throw new Error('User not authenticated');

  await verifyAdmin(userId);

  const supabase = await getAdminClient();

  // Dapatkan data dokter saat ini untuk perbandingan
  const { data: currentDoctor, error: fetchError } = await supabase
    .from('doctors')
    .select('name, slug, user_id')
    .eq('id', doctorId)
    .single();

  if (fetchError) {
    console.error('Error fetching current doctor data:', fetchError);
    throw new Error(`Error fetching current doctor data: ${fetchError.message}`);
  }

  // Dapatkan semua field kecuali name, slug, dan user_id
  const { name, slug, user_id, ...otherData } = doctorData;

  // Bangun updateData tanpa user_id terlebih dahulu
  let updateData: Partial<Doctor> = { ...otherData };

  // Jika user_id diberikan dan berbeda dari yang sekarang
  if (user_id !== undefined && user_id !== currentDoctor.user_id) {
    // Sebagai admin, kita bisa melepaskan user_id dari dokter lain (jika ada) dan memberikannya ke dokter ini
    // Cek apakah user_id ini sedang digunakan oleh dokter lain
    const { data: currentDoctorWithUserId, error: checkError } = await supabase
      .from('doctors')
      .select('id')
      .eq('user_id', user_id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 adalah error "not found"
      console.error('Error checking existing user_id:', checkError);
      throw new Error(`Error checking user_id: ${checkError.message}`);
    }

    // Jika user_id sedang digunakan oleh dokter lain, lepaskan dari dokter tersebut
    if (currentDoctorWithUserId && currentDoctorWithUserId.id !== doctorId) {
      // Sebagai admin, kita bisa melepaskan user_id dari dokter lama
      const { error: releaseError } = await supabase
        .from('doctors')
        .update({ user_id: null })
        .eq('id', currentDoctorWithUserId.id);

      if (releaseError) {
        console.error('Error releasing user_id from other doctor:', releaseError);
        throw new Error(`Error releasing user_id from other doctor: ${releaseError.message}`);
      }
    }

    // Tambahkan user_id yang baru ke updateData
    updateData.user_id = user_id;
  }
  // Jika user_id tidak diberikan atau sama dengan yang sekarang, tidak perlu diupdate

  // Tangani perubahan nama jika ada
  if (name !== undefined) {
    const nameChanged = currentDoctor.name && name.toLowerCase() !== currentDoctor.name.toLowerCase();

    if (nameChanged) {
      updateData.name = name;

      // Jika slug tidak disediakan, buat yang baru
      if (slug === undefined) {
        const baseSlug = generateSlug(name);
        updateData.slug = await ensureUniqueSlug(supabase, baseSlug, doctorId);
      } else {
        // Jika slug disediakan, gunakan yang disediakan
        updateData.slug = slug;
      }
    } else {
      // Jika nama tidak berubah, hanya gunakan slug jika disediakan
      if (slug !== undefined) {
        updateData.slug = slug;
      }
    }
  } else {
    // Jika nama tidak diupdate, gunakan slug jika disediakan
    if (slug !== undefined) {
      updateData.slug = slug;
    }
  }

  // Lakukan update dokter
  const { data, error } = await supabase
    .from('doctors')
    .update({
      ...updateData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', doctorId)
    .select()
    .single();

  if (error) {
    console.error('Error updating doctor:', error);
    // Tangani error duplikasi dengan lebih spesifik
    if (error.code === '23505') {
      if (error.message.includes('slug')) {
        throw new Error('Doctor with this slug already exists. Please try a different name.');
      } else if (error.message.includes('user_id')) {
        throw new Error('This user is already assigned as a doctor. Please select a different user.');
      } else {
        throw new Error('Duplicate value error: ' + error.message);
      }
    }
    throw new Error(`Error updating doctor: ${error.message}`);
  }

  return data;
}

// ✅ Detail dokter berdasarkan ID (publik)
export async function getDoctorById(doctorId: string) {
  // Validasi bahwa doctorId adalah UUID yang valid
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(doctorId)) {
    console.error('Invalid UUID format for doctor ID:', doctorId);
    throw new Error(`Invalid UUID format for doctor ID: ${doctorId}`);
  }

  const supabase = await getAdminClient();
  const { data, error } = await supabase
    .from('doctors')
    .select('*')
    .eq('id', doctorId)
    .single();

  if (error) {
    console.error('Error fetching doctor by ID:', error);
    // Jika dokter tidak ditemukan, lempar error yang sesuai
    if (error.code === 'PGRST116') {
      throw new Error(`Doctor with ID ${doctorId} not found`);
    }
    throw new Error(`Error fetching doctor by ID: ${error.message}`);
  }

  return data;
}

// ✅ Detail dokter berdasarkan slug
export async function getDoctorBySlug(slug: string) {
  const supabase = await getAdminClient();
  const { data, error } = await supabase
    .from('doctors')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching doctor by slug:', error);
    // Jika dokter tidak ditemukan berdasarkan slug, lempar error yang sesuai
    if (error.code === 'PGRST116') {
      throw new Error(`Doctor with slug ${slug} not found`);
    }
    throw new Error(`Error fetching doctor by slug: ${error.message}`);
  }

  return data;
}

// ✅ Perbarui slug untuk semua dokter (digunakan untuk memperbarui slug ketika nama berubah)
export async function updateAllDoctorSlugs() {
  const { userId } = await auth();
  if (!userId) throw new Error('User not authenticated');

  await verifyAdmin(userId);

  const supabase = await getAdminClient();

  try {
    // Dapatkan semua dokter
    const { data: allDoctors, error: fetchError } = await supabase
      .from('doctors')
      .select('id, name, slug');

    if (fetchError) {
      console.error('Error fetching all doctors:', fetchError);
      throw new Error(`Error fetching all doctors: ${fetchError.message}`);
    }

    // Perbarui slug untuk setiap dokter
    let updatedCount = 0;
    const updatePromises = allDoctors.map(async (doctor) => {
      if (doctor.name) {
        const baseSlug = generateSlug(doctor.name);
        // Hanya perbarui jika slug berbeda atau tidak ada
        if (!doctor.slug || doctor.slug !== baseSlug) {
          try {
            const newSlug = await ensureUniqueSlug(supabase, baseSlug, doctor.id);
            const { error: updateError } = await supabase
              .from('doctors')
              .update({ slug: newSlug })
              .eq('id', doctor.id);

            if (updateError) {
              console.error(`Error updating slug for doctor ${doctor.id}:`, updateError);
              // Jangan lempar error, lanjutkan dengan dokter berikutnya
            } else {
              console.log(`Updated slug for doctor ${doctor.id}: ${newSlug}`);
              updatedCount++;
            }
          } catch (error) {
            console.error(`Error ensuring unique slug for doctor ${doctor.id}:`, error);
            // Lanjutkan dengan dokter berikutnya
          }
        }
      }
    });

    await Promise.all(updatePromises);
    console.log(`Successfully updated slugs for ${updatedCount} doctors`);
    return { success: true, updatedCount };
  } catch (error) {
    console.error('Error updating all slugs:', error);
    throw error;
  }
}

// ✅ Jadwal dokter
export async function getDoctorSchedules(doctorId: string, useKhanza: boolean = false) {
  // Jika diminta untuk menggunakan data dari SIMRS Khanza
  if (useKhanza) {
    try {
      // Ambil jadwal dari SIMRS Khanza melalui API
      // Kita perlu mengambil kode dokter dari database lokal terlebih dahulu
      const doctor = await getDoctorById(doctorId);
      const doctorCode = doctor.user_id || doctorId; // Gunakan user_id sebagai kode dokter jika tersedia

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/schedules/khanza?doctorCode=${doctorCode}&date=${new Date().toISOString().split('T')[0]}`);

      if (!response.ok) {
        throw new Error('Gagal mengambil jadwal dari SIMRS Khanza');
      }

      const khanzaSchedules = await response.json();

      // Konversi format jadwal SIMRS Khanza ke format aplikasi kita
      return khanzaSchedules
        .filter((schedule: any) =>
          // Filter jadwal untuk dokter tertentu berdasarkan kode dokter
          schedule.doctor_id === doctorCode
        )
        .map((schedule: any) => ({
          id: schedule.id,
          doctor_id: doctorId,
          date: schedule.date,
          start_time: schedule.start_time,
          end_time: schedule.end_time,
          available: schedule.available,
          created_at: schedule.created_at,
          updated_at: schedule.updated_at,
          max_patients: schedule.max_patients || schedule.kuota || 0,
          current_patients: schedule.current_patients || schedule.jumlah || 0,
        }));
    } catch (error) {
      console.error('Gagal mengambil jadwal dari SIMRS Khanza, menggunakan data lokal:', error);
      // Jika gagal, kembali ke pengambilan data lokal
    }
  }

  // Ambil data dari database lokal sebagai fallback
  const supabase = await getAdminClient();

  const { data, error } = await supabase
    .from('schedules')
    .select('*')
    .eq('doctor_id', doctorId)
    .order('date'); // Urutkan berdasarkan tanggal, bukan hari dalam seminggu

  if (error) {
    console.error('Error fetching doctor schedules:', error);
    // Tangani error khusus dengan pesan yang lebih informatif
    throw new Error(`Error fetching doctor schedules: ${error.message}`);
  }

  return data || [];
};