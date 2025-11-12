'use server';

import { createSupabaseServerClient } from '@/lib/supabase-server';
import { auth } from '@clerk/nextjs/server';
import { Service } from '@/lib/admin-types';

// ==================== TEST CONNECTION FUNCTION ====================

export async function testSupabaseConnection() {
  try {
    const supabase = await createSupabaseServerClient();
    
    console.log('🔌 Testing Supabase connection...');
    
    // Test query sederhana
    const { data, error, count } = await supabase
      .from('services')
      .select('id, title', { count: 'exact' })
      .limit(1);

    if (error) {
      console.error('❌ Supabase connection error:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Supabase connection successful!');
    console.log('📊 Total services in database:', count);
    console.log('📝 Sample data:', data);
    
    return { success: true, count, sample: data };
  } catch (error) {
    console.error('💥 Unexpected error testing Supabase:', error);
    return { success: false, error: String(error) };
  }
}



// ==================== MAIN SERVICE FUNCTIONS ====================

// Fungsi untuk mendapatkan semua layanan
export async function getAllServices() {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('User not authenticated');
  }

  // Periksa apakah pengguna adalah admin
  try {
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (userError || !userData || userData.role !== 'admin') {
      throw new Error('Access denied: Admin only');
    }
  } catch (error) {
    console.error('Error checking admin status:', error);
    throw new Error('Access denied: Admin only');
  }

  // Jika pengguna adalah admin, ambil semua layanan
  try {
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    // METHOD 1: Coba query langsung
    console.log('🔄 Admin: Fetching all services from database');
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('title', { ascending: true });

    if (!error) {
      console.log(`✅ Admin: Successfully fetched ${data?.length || 0} services`);
      return data || [];
    }

    console.error('❌ Admin: Error fetching services:', error);
    throw new Error(`Error fetching services: ${error.message}`);
    
  } catch (error) {
    console.error('Error in getAllServices:', error);
    throw error;
  }
}

// FUNGSI UTAMA YANG DIPERBAIKI: untuk mendapatkan layanan berdasarkan kategori
export async function getServicesByCategory(category: string) {
  console.log(`🎯 getServicesByCategory called for: "${category}"`);
  
  try {
    const supabase = await createSupabaseServerClient(true); // Gunakan service role seperti endpoint dokter
    
    // METHOD 1: Coba query paling sederhana dulu
    console.log('🔄 Method 1: Simple query with minimal columns');
    const { data: simpleData, error: simpleError } = await supabase
      .from('services')
      .select('id, title, category')
      .eq('category', category)
      .is('deleted_at', null)
      .limit(10);

    if (!simpleError && simpleData && simpleData.length > 0) {
      console.log(`✅ Method 1 SUCCESS: Found ${simpleData.length} services`);
      
      // METHOD 2: Jika simple berhasil, ambil data lengkap
      console.log('🔄 Method 2: Fetching complete data for found services');
      const serviceIds = simpleData.map(s => s.id);
      
      const { data: completeData, error: completeError } = await supabase
        .from('services')
        .select('*')
        .in('id', serviceIds)
        .order('created_at', { ascending: false });

      if (!completeError && completeData) {
        console.log(`✅ Method 2 SUCCESS: Got complete data for ${completeData.length} services`);
        
        // Validasi dan format data
        const validatedData = completeData.map(service => ({
          id: service.id,
          category: service.category,
          title: service.title,
          description: service.description,
          image_url: service.image_url,
          contact_info: service.contact_info,
          location: service.location,
          operating_hours: service.operating_hours,
          features: Array.isArray(service.features) ? service.features : [],
          reviews: Array.isArray(service.reviews) ? service.reviews : [],
          created_at: service.created_at,
          updated_at: service.updated_at
        }));
        
        return validatedData;
      } else {
        console.error('❌ Method 2 failed:', completeError);
      }
    } else {
      console.error('❌ Method 1 failed:', simpleError);
      console.log('📊 No services found in database for category:', category);
    }

    // METHOD 3: Coba melalui view services_basic
    console.log('🔄 Method 3: Trying services_basic view');
    const { data: viewData, error: viewError } = await supabase
      .from('services_basic')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (!viewError && viewData && viewData.length > 0) {
      console.log(`✅ Method 3 SUCCESS: Found ${viewData.length} services via view`);
      return viewData;
    } else {
      console.error('❌ Method 3 failed:', viewError);
    }

    // Jika semua metode database gagal, kembalikan array kosong
    console.log('❌ All database methods failed, returning empty array');
    return [];
    
  } catch (error) {
    console.error('💥 Unexpected error in getServicesByCategory:', error);
    // Jangan kembalikan data hardcoded, langsung lempar error atau kembalikan array kosong
    return [];
  }
}

// FUNGSI UNTUK MENDAPATKAN LAYANAN UNGGULAN
export async function getFeaturedServices() {
  console.log('🎯 getFeaturedServices called');
  
  // Panggil getServicesByCategory dengan parameter 'unggulan'
  const data = await getServicesByCategory('unggulan');
  console.log(`✅ getFeaturedServices returning ${data.length} services`);
  return data;
}

// Fungsi untuk mendapatkan semua layanan (publik)
export async function getHealthServices() {
  try {
    const supabase = await createSupabaseServerClient(true); // Gunakan service role seperti endpoint dokter
    
    console.log('🔄 getHealthServices: Fetching all public services');
    
    const { data, error } = await supabase
      .from('services_basic')
      .select('*')
      .order('title', { ascending: true });

    if (!error) {
      console.log(`✅ getHealthServices: Found ${data?.length || 0} services`);
      return data || [];
    }

    console.error('❌ getHealthServices: Error fetching services:', error);
    return [];
    
  } catch (error: any) {
    console.error('Error in getHealthServices:', error);
    return [];
  }
}

// Fungsi untuk menghapus layanan
export async function deleteService(serviceId: string) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('User not authenticated');
  }

  // Periksa apakah pengguna adalah admin
  try {
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (userError || !userData || userData.role !== 'admin') {
      throw new Error('Access denied: Admin only');
    }
  } catch (error) {
    console.error('Error checking admin status:', error);
    throw new Error('Access denied: Admin only');
  }

  // Jika pengguna adalah admin, hapus layanan
  try {
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', serviceId);

    if (error) {
      console.error('Error deleting service:', error);
      throw new Error(`Error deleting service: ${error.message}`);
    }

    return true;
  } catch (error) {
    console.error('Error in deleteService:', error);
    throw error;
  }
}

// Fungsi untuk membuat layanan baru
export async function createService(serviceData: {
  category?: string | null;
  title: string;
  description?: string | null;
  image_url?: string | null;
  contact_info?: string | null;
  location?: string | null;
  operating_hours?: string | null;
  features?: string[] | null;
  reviews?: string[] | null;
}) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('User not authenticated');
  }

  // Periksa apakah pengguna adalah admin
  try {
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (userError || !userData || userData.role !== 'admin') {
      throw new Error('Access denied: Admin only');
    }
  } catch (error) {
    console.error('Error checking admin status:', error);
    throw new Error('Access denied: Admin only');
  }

  // Jika pengguna adalah admin, buat layanan baru
  try {
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    // Pastikan features dan reviews adalah array yang valid sebelum disimpan
    const validatedFeatures = Array.isArray(serviceData.features) ? serviceData.features : (serviceData.features ? [serviceData.features] : []);
    const validatedReviews = Array.isArray(serviceData.reviews) ? serviceData.reviews : (serviceData.reviews ? [serviceData.reviews] : []);
    
    const { data, error } = await supabase
      .from('services')
      .insert([{
        category: serviceData.category,
        title: serviceData.title,
        description: serviceData.description,
        image_url: serviceData.image_url,
        contact_info: serviceData.contact_info,
        location: serviceData.location,
        operating_hours: serviceData.operating_hours,
        features: validatedFeatures,
        reviews: validatedReviews,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select('*')
      .single();

    if (error) {
      console.error('Error creating service:', error);
      throw new Error(`Error creating service: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error in createService:', error);
    throw error;
  }
}

// Fungsi untuk memperbarui layanan
export async function updateService(serviceId: string, serviceData: {
  category?: string | null;
  title?: string;
  description?: string | null;
  image_url?: string | null;
  contact_info?: string | null;
  location?: string | null;
  operating_hours?: string | null;
  features?: string[] | null;
  reviews?: string[] | null;
}) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('User not authenticated');
  }

  // Periksa apakah pengguna adalah admin
  try {
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (userError || !userData || userData.role !== 'admin') {
      throw new Error('Access denied: Admin only');
    }
  } catch (error) {
    console.error('Error checking admin status:', error);
    throw new Error('Access denied: Admin only');
  }

  // Jika pengguna adalah admin, perbarui layanan
  try {
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    const updateData: any = {
      updated_at: new Date().toISOString()
    };
    
    if (serviceData.category !== undefined) updateData.category = serviceData.category;
    if (serviceData.title !== undefined) updateData.title = serviceData.title;
    if (serviceData.description !== undefined) updateData.description = serviceData.description;
    if (serviceData.image_url !== undefined) updateData.image_url = serviceData.image_url;
    if (serviceData.contact_info !== undefined) updateData.contact_info = serviceData.contact_info;
    if (serviceData.location !== undefined) updateData.location = serviceData.location;
    if (serviceData.operating_hours !== undefined) updateData.operating_hours = serviceData.operating_hours;
    
    // Validasi features dan reviews sebelum menyimpan
    if (serviceData.features !== undefined) {
      updateData.features = Array.isArray(serviceData.features) ? serviceData.features : (serviceData.features ? [serviceData.features] : []);
    }
    if (serviceData.reviews !== undefined) {
      updateData.reviews = Array.isArray(serviceData.reviews) ? serviceData.reviews : (serviceData.reviews ? [serviceData.reviews] : []);
    }
    
    const { data, error } = await supabase
      .from('services')
      .update(updateData)
      .eq('id', serviceId)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating service:', error);
      throw new Error(`Error updating service: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error in updateService:', error);
    throw error;
  }
}

// Fungsi untuk mendapatkan detail layanan (publik)
export async function getServiceById(serviceId: string) {
  try {
    const supabase = await createSupabaseServerClient(true); // Gunakan service role seperti endpoint dokter
    
    // Validasi bahwa serviceId adalah UUID yang valid
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(serviceId)) {
      throw new Error(`Invalid UUID format: ${serviceId}`);
    }
    
    // METHOD 1: Coba melalui view dulu
    const { data, error } = await supabase
      .from('services_basic')
      .select('*')
      .eq('id', serviceId)
      .single();

    if (!error && data) {
      return data;
    }

    // Jika semua metode database gagal, lempar error
    console.log('❌ All database methods failed to fetch service');
    if (error) {
      throw error;
    } else {
      throw new Error('Service not found');
    }
  } catch (error: any) {
    console.error('Error in getServiceById:', error);
    throw new Error(`Error fetching service: ${error.message || error}`);
  }
}

// Fungsi untuk mendapatkan layanan berdasarkan slug (publik)
export async function getServiceBySlug(slug: string) {
  try {
    const supabase = await createSupabaseServerClient(true); // Gunakan service role seperti endpoint dokter
    
    const { data, error } = await supabase
      .from('services_basic')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error(`Error fetching service by slug ${slug}:`, error);
      throw new Error(`Error fetching service by slug ${slug}: ${error.message}`);
    }

    return data;
  } catch (error: any) {
    console.error(`Error in getServiceBySlug (${slug}):`, error);
    throw new Error(`Error fetching service by slug ${slug}: ${error.message || error}`);
  }
}

// Fungsi untuk mendapatkan dokter terkait dengan layanan
export async function getDoctorsByServiceId(serviceId: string) {
  try {
    const supabase = await createSupabaseServerClient(true); // Gunakan service role
    
    // Validasi bahwa serviceId adalah UUID yang valid
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(serviceId)) {
      throw new Error(`Invalid UUID format: ${serviceId}`);
    }
    
    // Ambil dokter terkait dengan layanan
    const { data, error } = await supabase
      .from('service_doctors')
      .select(`
        doctors!inner (
          id,
          user_id,
          name,
          specialty,
          image_url,
          description,
          experience_years,
          education,
          certifications,
          consultation_fee,
          slug,
          created_at,
          updated_at
        )
      `)
      .eq('service_id', serviceId);

    if (error) {
      console.error(`Error fetching doctors for service ${serviceId}:`, error);
      throw new Error(`Error fetching doctors for service: ${error.message}`);
    }

    // Kembalikan data dokter, tambahkan field hospital
    return data.map(item => {
      const doctorData = item.doctors;
      return {
        hospital: "RS Islam Siti Hajar Mataram", // Tambahkan field hospital secara manual
        id: doctorData.id,
        user_id: doctorData.user_id,
        name: doctorData.name,
        specialty: doctorData.specialty,
        image_url: doctorData.image_url,
        description: doctorData.description,
        experience_years: doctorData.experience_years,
        education: doctorData.education,
        certifications: doctorData.certifications,
        consultation_fee: doctorData.consultation_fee,
        slug: doctorData.slug,
        created_at: doctorData.created_at,
        updated_at: doctorData.updated_at
      };
    });
  } catch (error: any) {
    console.error(`Error in getDoctorsByServiceId (${serviceId}):`, error);
    throw new Error(`Error fetching doctors for service: ${error.message || error}`);
  }
}

// Fungsi untuk menambahkan dokter ke layanan
export async function addDoctorToService(serviceId: string, doctorId: string) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('User not authenticated');
  }

  // Periksa apakah pengguna adalah admin
  try {
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (userError || !userData || userData.role !== 'admin') {
      throw new Error('Access denied: Admin only');
    }
  } catch (error) {
    console.error('Error checking admin status:', error);
    throw new Error('Access denied: Admin only');
  }

  try {
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    // Validasi UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(serviceId) || !uuidRegex.test(doctorId)) {
      throw new Error(`Invalid UUID format: serviceId=${serviceId}, doctorId=${doctorId}`);
    }
    
    // Cek apakah layanan dan dokter ada
    const { error: serviceCheckError } = await supabase
      .from('services')
      .select('id')
      .eq('id', serviceId)
      .single();
      
    if (serviceCheckError) {
      throw new Error(`Service with ID ${serviceId} not found`);
    }
    
    const { error: doctorCheckError } = await supabase
      .from('doctors')
      .select('id')
      .eq('id', doctorId)
      .single();
      
    if (doctorCheckError) {
      throw new Error(`Doctor with ID ${doctorId} not found`);
    }

    // Tambahkan relasi layanan-dokter
    const { data, error } = await supabase
      .from('service_doctors')
      .insert([{ service_id: serviceId, doctor_id: doctorId }])
      .select()
      .single();

    if (error) {
      // Jika error karena duplikat, kembalikan pesan khusus
      if (error.code === '23505') { // duplicate key value violates unique constraint
        throw new Error(`Doctor with ID ${doctorId} is already associated with service ${serviceId}`);
      }
      throw new Error(`Error adding doctor to service: ${error.message}`);
    }

    return data;
  } catch (error: any) {
    console.error(`Error in addDoctorToService (serviceId: ${serviceId}, doctorId: ${doctorId}):`, error);
    throw new Error(`Error adding doctor to service: ${error.message || error}`);
  }
}

// Fungsi untuk menghapus dokter dari layanan
export async function removeDoctorFromService(serviceId: string, doctorId: string) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('User not authenticated');
  }

  // Periksa apakah pengguna adalah admin
  try {
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (userError || !userData || userData.role !== 'admin') {
      throw new Error('Access denied: Admin only');
    }
  } catch (error) {
    console.error('Error checking admin status:', error);
    throw new Error('Access denied: Admin only');
  }

  try {
    const supabase = await createSupabaseServerClient(true); // dengan service role
    
    // Validasi UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(serviceId) || !uuidRegex.test(doctorId)) {
      throw new Error(`Invalid UUID format: serviceId=${serviceId}, doctorId=${doctorId}`);
    }

    // Hapus relasi layanan-dokter
    const { error } = await supabase
      .from('service_doctors')
      .delete()
      .eq('service_id', serviceId)
      .eq('doctor_id', doctorId);

    if (error) {
      throw new Error(`Error removing doctor from service: ${error.message}`);
    }

    return { success: true };
  } catch (error: any) {
    console.error(`Error in removeDoctorFromService (serviceId: ${serviceId}, doctorId: ${doctorId}):`, error);
    throw new Error(`Error removing doctor from service: ${error.message || error}`);
  }
}