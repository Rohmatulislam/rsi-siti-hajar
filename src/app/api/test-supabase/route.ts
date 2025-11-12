import { NextRequest } from 'next/server';
import { testSupabaseConnection, getDatabaseInfo } from '@/lib/supabase-test';

export async function GET(req: NextRequest) {
  try {
    console.log('Starting Supabase connection test...');
    
    // Test koneksi dasar
    const connectionTest = await testSupabaseConnection();
    
    console.log('Connection test result:', connectionTest);
    
    if (!connectionTest.success) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Failed to connect to Supabase',
          error: connectionTest.error || 'Unknown error'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Dapatkan informasi database
    const dbInfo = await getDatabaseInfo();
    
    console.log('Database info result:', dbInfo);
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Successfully connected to Supabase',
        connection: connectionTest,
        database: dbInfo
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('API Error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? error : undefined
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}