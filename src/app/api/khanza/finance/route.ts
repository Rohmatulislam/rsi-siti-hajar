// src/app/api/khanza/finance/route.ts
import { NextRequest } from 'next/server';
import { getFinancialDataFromKhanza } from '@/lib/khanza/khanza-integration-final';
import { KhanzaFinancialData } from '@/lib/khanza/types';

export async function GET(request: NextRequest) {
  try {
    // Ambil data keuangan dari SIMRS Khanza
    const financialData = await getFinancialDataFromKhanza();
    
    // Transformasi data ke format yang sesuai untuk frontend
    const formattedData = financialData.map(item => ({
      transaction_date: item.tanggal,
      transaction_time: item.jam,
      transaction_type: item.transaksi,
      description: item.keterangan,
      category: item.kategori,
      type: item.jenis,
      amount: item.jumlah,
      id: item.id,
      receipt_number: item.no_nota,
      staff: item.petugas
    }));

    return new Response(JSON.stringify(formattedData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching financial data:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch financial data', 
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