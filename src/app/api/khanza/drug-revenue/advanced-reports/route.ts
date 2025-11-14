import { NextRequest } from 'next/server';
import { getDrugRevenueFromKhanza } from '../../../../../lib/khanza/khanza-integration-final';
import { AdvancedDrugRevenueReport } from '../../../../../lib/khanza/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate') ?? undefined;
    const endDate = searchParams.get('endDate') ?? undefined;

    // Ambil data pendapatan obat dari Khanza
    const drugRevenueData = await getDrugRevenueFromKhanza(startDate, endDate);

    // Proses data untuk laporan lanjutan
    const report: AdvancedDrugRevenueReport = {
      topSellingDrugs: [],
      revenueByUnit: [],
      dailyRevenueTrend: [],
      monthlyRevenueSummary: [],
    };

    // Kelompokkan data berdasarkan obat terlaris
    const drugSalesMap: Record<string, any> = {};
    for (const item of drugRevenueData) {
      const key = `${item.drug_name}_${item.transaction_source}`;
      if (!drugSalesMap[key]) {
        drugSalesMap[key] = {
          drug_name: item.drug_name,
          total_quantity: 0,
          total_revenue: 0,
          total_profit: 0,
          profit_margin: 0,
          transaction_source: item.transaction_source,
        };
      }
      
      drugSalesMap[key].total_quantity += item.quantity_sold;
      drugSalesMap[key].total_revenue += item.total_revenue;
      drugSalesMap[key].total_profit += item.profit;
    }

    // Hitung margin untuk setiap obat
    for (const key in drugSalesMap) {
      const item = drugSalesMap[key];
      item.profit_margin = item.total_revenue > 0 ? (item.total_profit / item.total_revenue) * 100 : 0;
    }

    // Konversi ke array dan urutkan berdasarkan total pendapatan
    report.topSellingDrugs = Object.values(drugSalesMap)
      .sort((a, b) => b.total_revenue - a.total_revenue)
      .slice(0, 10); // Ambil 10 obat terlaris

    // Kelompokkan data berdasarkan unit (menggunakan transaction_source sebagai pengganti)
    const unitRevenueMap: Record<string, any> = {};
    for (const item of drugRevenueData) {
      const key = item.transaction_source;
      if (!unitRevenueMap[key]) {
        unitRevenueMap[key] = {
          unit: key,
          total_revenue: 0,
          total_profit: 0,
          profit_margin: 0,
          transaction_source: item.transaction_source,
        };
      }
      
      unitRevenueMap[key].total_revenue += item.total_revenue;
      unitRevenueMap[key].total_profit += item.profit;
    }

    // Hitung margin untuk setiap unit
    for (const key in unitRevenueMap) {
      const item = unitRevenueMap[key];
      item.profit_margin = item.total_revenue > 0 ? (item.total_profit / item.total_revenue) * 100 : 0;
    }

    report.revenueByUnit = Object.values(unitRevenueMap);

    // Kelompokkan data berdasarkan tren harian
    const dailyRevenueMap: Record<string, any> = {};
    for (const item of drugRevenueData) {
      const date = new Date(item.date).toISOString().split('T')[0];
      const key = `${date}_${item.transaction_source}`;
      
      if (!dailyRevenueMap[key]) {
        dailyRevenueMap[key] = {
          date,
          total_revenue: 0,
          total_profit: 0,
          transaction_source: item.transaction_source,
        };
      }
      
      dailyRevenueMap[key].total_revenue += item.total_revenue;
      dailyRevenueMap[key].total_profit += item.profit;
    }

    report.dailyRevenueTrend = Object.values(dailyRevenueMap)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Kelompokkan data berdasarkan ringkasan bulanan
    const monthlyRevenueMap: Record<string, any> = {};
    for (const item of drugRevenueData) {
      const date = new Date(item.date);
      const month = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      const key = `${month}_${item.transaction_source}`;
      
      if (!monthlyRevenueMap[key]) {
        monthlyRevenueMap[key] = {
          month,
          total_revenue: 0,
          total_profit: 0,
          profit_margin: 0,
          transaction_source: item.transaction_source,
        };
      }
      
      monthlyRevenueMap[key].total_revenue += item.total_revenue;
      monthlyRevenueMap[key].total_profit += item.profit;
    }

    // Hitung margin untuk setiap bulan
    for (const key in monthlyRevenueMap) {
      const item = monthlyRevenueMap[key];
      item.profit_margin = item.total_revenue > 0 ? (item.total_profit / item.total_revenue) * 100 : 0;
    }

    report.monthlyRevenueSummary = Object.values(monthlyRevenueMap)
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

    return new Response(JSON.stringify(report), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in advanced drug revenue reports API:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to retrieve advanced drug revenue reports' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}