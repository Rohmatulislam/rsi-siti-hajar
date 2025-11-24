import { NextRequest } from 'next/server';
import { testKhanzaConnection } from '@/lib/khanza/khanza-service';

export async function GET(request: NextRequest) {
  try {
    console.log('Starting SIMRS Khanza connection test...');
    
    const connectionTest = await testKhanzaConnection();
    
    console.log('Connection test result:', connectionTest);
    
    if (!connectionTest.success) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: connectionTest.message || 'Unknown error'
        }),
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'SIMRS Khanza connection test passed',
        connection: connectionTest,
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error in SIMRS Khanza connection test API:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}