// src/app/api/khanza/route.ts
import { NextRequest } from 'next/server';
import { 
  getReportsFromKhanza,
  getFinancialDataFromKhanza,
  getVisitDataFromKhanza,
  getLabVisitsFromKhanza,
  getRadiologyVisitsFromKhanza,
  getJournalDataFromKhanza,
  getInventoryDataFromKhanza,
  getDrugRevenueFromKhanza,
  getDoctorSchedulesFromKhanza
} from '@/lib/khanza/khanza-integration-final';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dataType = searchParams.get('type');

    let data;

    switch (dataType) {
      case 'reports':
        data = await getReportsFromKhanza();
        break;
      case 'financial':
        data = await getFinancialDataFromKhanza();
        break;
      case 'visits':
        data = await getVisitDataFromKhanza();
        break;
      case 'lab-visits':
        data = await getLabVisitsFromKhanza();
        break;
      case 'radiology-visits':
        data = await getRadiologyVisitsFromKhanza();
        break;
      case 'journals':
        data = await getJournalDataFromKhanza();
        break;
      case 'inventory':
        data = await getInventoryDataFromKhanza();
        break;
      case 'drug-revenue':
        data = await getDrugRevenueFromKhanza();
        break;
      case 'schedules':
        data = await getDoctorSchedulesFromKhanza();
        break;
      case 'all':
        // Kembalikan semua data
        data = {
          reports: await getReportsFromKhanza(),
          financial: await getFinancialDataFromKhanza(),
          visits: await getVisitDataFromKhanza(),
          labVisits: await getLabVisitsFromKhanza(),
          radiologyVisits: await getRadiologyVisitsFromKhanza(),
          journals: await getJournalDataFromKhanza(),
          inventory: await getInventoryDataFromKhanza(),
          drugRevenue: await getDrugRevenueFromKhanza(),
          schedules: await getDoctorSchedulesFromKhanza()
        };
        break;
      default:
        return new Response(
          JSON.stringify({ 
            error: 'Invalid data type specified. Use ?type=parameter with valid type.' 
          }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching Khanza data:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch data', 
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