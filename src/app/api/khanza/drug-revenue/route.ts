import { NextRequest } from 'next/server';
import { getDrugRevenueFromKhanza } from '../../../../lib/khanza/khanza-integration-final';
import type { KhanzaDrugRevenue } from '../../../../lib/khanza/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate') ?? undefined;
    const endDate = searchParams.get('endDate') ?? undefined;

    // Ambil data pendapatan obat dari SIMRS Khanza
    const drugRevenueData = await getDrugRevenueFromKhanza(startDate, endDate);

    // Transformasi data ke format yang sesuai untuk frontend
    const formattedData = drugRevenueData.map(item => ({
      id: item.id,
      drug_name: item.drug_name,
      quantity_sold: item.quantity_sold,
      unit_price: item.unit_price,
      total_revenue: item.total_revenue,
      cost_price: item.cost_price,
      total_cost: item.total_cost,
      profit: item.profit,
      profit_margin: item.profit_margin,
      transaction_source: item.transaction_source,
      patient_id: item.patient_id,
      prescription_id: item.prescription_id,
      date: item.date,
      created_at: item.created_at
    }));

    return new Response(JSON.stringify(formattedData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching drug revenue data:', error);

    return new Response(
      JSON.stringify({
        error: 'Failed to fetch drug revenue data',
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