// src/app/api/khanza/inventory/route.ts
import { NextRequest } from 'next/server';
import { getInventoryDataFromKhanza } from '@/lib/khanza/khanza-integration-final';

export async function GET(request: NextRequest) {
  try {
    // Ambil data inventaris dari SIMRS Khanza
    const inventoryData = await getInventoryDataFromKhanza();
    
    // Transformasi data ke format yang sesuai untuk frontend
    const formattedData = inventoryData.map(item => ({
      item_code: item.kode_brng,
      item_name: item.nama_brng,
      category: item.kategori,
      location: item.letak_barang,
      quantity: item.stok,
      min_stock_level: item.stokminimal,
      unit_price: item.harga,
      total_value: item.total_harga,
      expired_date: item.expired_date,
      status: item.status,
      supplier: item.produsen
    }));

    return new Response(JSON.stringify(formattedData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching inventory data:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch inventory data', 
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