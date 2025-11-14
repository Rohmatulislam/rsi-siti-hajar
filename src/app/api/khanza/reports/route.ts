// src/app/api/khanza/reports/route.ts
import { NextRequest } from 'next/server';
import { getReportsFromKhanza } from '@/lib/khanza/khanza-integration-final';
import { KhanzaReport } from '@/lib/khanza/types';

export async function GET(request: NextRequest) {
  try {
    // Ambil data laporan dari SIMRS Khanza
    const reportData = await getReportsFromKhanza();
    
    // Transformasi data ke format yang sesuai untuk frontend
    const formattedData = reportData.map(item => ({
      id: item.id,
      title: item.nama,
      description: item.keterangan,
      date: item.tanggal,
      time: item.jam,
      status: item.status,
      total: item.total,
      details: item.detail
    }));

    return new Response(JSON.stringify(formattedData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching report data:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch report data', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}