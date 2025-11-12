import { NextResponse } from 'next/server';
import { getFeaturedServices, getServicesByCategory, getServiceById } from '@/lib/service-service';
import { getRecentArticles } from '@/lib/article-service';
import { auth } from '@clerk/nextjs/server';

// GET /api/services - Mendapatkan semua layanan
// GET /api/services?category=unggulan - Mendapatkan layanan unggulan atau artikel terbaru
// GET /api/services?id=... - Mendapatkan layanan berdasarkan ID

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const id = searchParams.get('id');

    console.log(`🔍 API Request - category: ${category}, id: ${id}`);

    // Jika ada parameter ID, kembalikan layanan berdasarkan ID
    if (id) {
      try {
        console.log(`🎯 Fetching service by ID: ${id}`);
        const service = await getServiceById(id);
        
        if (!service) {
          console.warn(`❌ Service not found for ID: ${id}`);
          return NextResponse.json(
            { error: 'Service not found' },
            { status: 404 }
          );
        }
        
        console.log(`✅ Successfully fetched service: ${service.title}`);
        return NextResponse.json(service);
      } catch (error) {
        console.error('❌ Error fetching service by ID:', error);
        return NextResponse.json(
          { error: 'Failed to fetch service by ID' },
          { status: 500 }
        );
      }
    }

    // Jika ada parameter category, kembalikan data berdasarkan kategori
    if (category) {
      try {
        // Decode URL parameter untuk menangani karakter khusus
        const decodedCategory = decodeURIComponent(category);
        console.log(`🎯 API: Fetching services for category: "${decodedCategory}"`);
        
        const services = await getServicesByCategory(decodedCategory);
        
        console.log(`📊 API: Raw response from getServicesByCategory:`, {
          isArray: Array.isArray(services),
          length: services?.length || 0,
          sample: services?.[0]
        });
        
        // Validasi dan pastikan hasilnya adalah array
        if (!Array.isArray(services)) {
          console.warn(`🚨 API: Services response is not an array for category: ${decodedCategory}`);
          console.warn(`🚨 API: Response type: ${typeof services}, value:`, services);
          return NextResponse.json(
            { error: 'Invalid services data format' },
            { status: 500 }
          );
        }
        
        console.log(`✅ API: Found ${services.length} services for category: ${decodedCategory}`);
        
        // Pastikan setiap item dalam array memiliki struktur yang benar
        const validServices = services.filter(service => {
          const isValid = service && 
            typeof service === 'object' && 
            service.id && 
            service.title;
          
          if (!isValid) {
            console.warn('🚨 API: Invalid service object found:', service);
          }
          
          return isValid;
        });
        
        console.log(`✅ API: Returning ${validServices.length} valid services`);
        return NextResponse.json(validServices);
      } catch (error) {
        console.error('💥 API: Error in category handler:', error);
        // Kembalikan error 500 untuk semua error tak terduga
        return NextResponse.json(
          { error: 'Failed to fetch services' },
          { status: 500 }
        );
      }
    }

    // Jika tidak ada parameter, kembalikan layanan unggulan
    try {
      console.log('🎯 API: No parameters, fetching featured services');
      const services = await getFeaturedServices();
      
      console.log(`📊 API: Raw response from getFeaturedServices:`, {
        isArray: Array.isArray(services),
        length: services?.length || 0,
        sample: services?.[0]
      });
      
      // Pastikan hasilnya adalah array
      const result = Array.isArray(services) ? services : [];
      
      console.log(`✅ API: Returning ${result.length} featured services`);
      return NextResponse.json(result);
    } catch (error) {
      console.error('💥 API: Error in featured services handler:', error);
      
      // Log error details untuk debugging
      if (error instanceof Error) {
        console.error('💥 API: Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch featured services' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('💥 API: Unhandled error in GET /api/services:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/services - Membuat layanan baru (hanya untuk admin)
export async function POST(request: Request) {
  try {
    // Periksa otentikasi admin
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Di sini seharusnya ada verifikasi role admin
    // Karena ini adalah endpoint API, kita tidak bisa langsung memverifikasi role
    // Verifikasi role akan dilakukan di frontend saat membuat layanan

    const serviceData = await request.json();
    
    // Untuk saat ini, kita hanya akan mengembalikan error karena endpoint ini
    // seharusnya hanya digunakan melalui server actions
    return NextResponse.json(
      { error: 'Use server actions instead' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error in POST /api/services:', error);
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    );
  }
}