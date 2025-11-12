import { NextRequest } from 'next/server';
import { createBooking } from '@/lib/booking-service';

export async function POST(request: NextRequest) {
  try {
    const bookingData = await request.json();
    
    if (!bookingData.bookingData || !bookingData.userId) {
      return new Response(
        JSON.stringify({ 
          error: 'Booking data and user ID are required' 
        }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Panggil fungsi createBooking tanpa mengimpor fungsi yang bermasalah
    // Gunakan pendekatan di mana data pasien diakses secara terpisah jika perlu
    const result = await createBooking(bookingData.bookingData, bookingData.userId);
    
    return new Response(
      JSON.stringify(result),
      { 
        status: result.success ? 200 : 400, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error in create booking API:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error',
        success: false 
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}