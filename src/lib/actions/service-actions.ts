'use server';

import { createService, updateService, deleteService, getFeaturedServices } from '@/lib/service-service';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

// Server action untuk membuat layanan baru
export async function createFeaturedService(formData: FormData) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error('Unauthorized');
    }

    // Di sini seharusnya ada verifikasi role admin
    // Untuk saat ini kita asumsikan pengguna sudah diverifikasi sebagai admin

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = 'unggulan'; // Kategori tetap untuk layanan unggulan
    const image_url = formData.get('image_url') as string || null;
    const contact_info = formData.get('contact_info') as string || null;
    const location = formData.get('location') as string || null;
    const operating_hours = formData.get('operating_hours') as string || null;
    
    // Mendapatkan fitur dari formData (array)
    const features: string[] = [];
    const featuresCount = parseInt(formData.get('features_count') as string) || 0;
    for (let i = 0; i < featuresCount; i++) {
      const feature = formData.get(`feature_${i}`) as string;
      if (feature) features.push(feature);
    }

    const serviceData = {
      title,
      description,
      category,
      image_url,
      contact_info,
      location,
      operating_hours,
      features: features.length > 0 ? features : null,
    };

    const newService = await createService(serviceData);
    
    // Revalidate halaman yang menggunakan data layanan
    revalidatePath('/services/featured');
    revalidatePath('/admin/services');
    
    return { success: true, data: newService };
  } catch (error) {
    console.error('Error creating featured service:', error);
    return { success: false, error: (error as Error).message };
  }
}

// Server action untuk memperbarui layanan
export async function updateFeaturedService(serviceId: string, formData: FormData) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error('Unauthorized');
    }

    // Di sini seharusnya ada verifikasi role admin
    // Untuk saat ini kita asumsikan pengguna sudah diverifikasi sebagai admin

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const image_url = formData.get('image_url') as string || null;
    const contact_info = formData.get('contact_info') as string || null;
    const location = formData.get('location') as string || null;
    const operating_hours = formData.get('operating_hours') as string || null;
    
    // Mendapatkan fitur dari formData (array)
    const features: string[] = [];
    const featuresCount = parseInt(formData.get('features_count') as string) || 0;
    for (let i = 0; i < featuresCount; i++) {
      const feature = formData.get(`feature_${i}`) as string;
      if (feature) features.push(feature);
    }

    const serviceData = {
      title: title || undefined,
      description: description || undefined,
      image_url: image_url || undefined,
      contact_info: contact_info || undefined,
      location: location || undefined,
      operating_hours: operating_hours || undefined,
      features: features.length > 0 ? features : undefined,
    };

    const updatedService = await updateService(serviceId, serviceData);
    
    // Revalidate halaman yang menggunakan data layanan
    revalidatePath('/services/featured');
    revalidatePath('/admin/services');
    revalidatePath(`/services/featured/${serviceId}`);
    
    return { success: true, data: updatedService };
  } catch (error) {
    console.error('Error updating featured service:', error);
    return { success: false, error: (error as Error).message };
  }
}

// Server action untuk menghapus layanan
export async function deleteFeaturedService(serviceId: string) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error('Unauthorized');
    }

    // Di sini seharusnya ada verifikasi role admin
    // Untuk saat ini kita asumsikan pengguna sudah diverifikasi sebagai admin

    await deleteService(serviceId);
    
    // Revalidate halaman yang menggunakan data layanan
    revalidatePath('/services/featured');
    revalidatePath('/admin/services');
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting featured service:', error);
    return { success: false, error: (error as Error).message };
  }
}

// Server action untuk mendapatkan semua layanan unggulan
export async function getAllFeaturedServices() {
  try {
    const services = await getFeaturedServices();
    return { success: true, data: services };
  } catch (error) {
    console.error('Error fetching featured services:', error);
    return { success: false, error: (error as Error).message };
  }
}