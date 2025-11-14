import { NextRequest } from 'next/server';
import { getJournalDataFromKhanza } from '../../../../lib/khanza/khanza-integration-final';
import { KhanzaJournal } from '../../../../lib/khanza/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate') ?? undefined;
    const endDate = searchParams.get('endDate') ?? undefined;

    // Ambil data jurnal keuangan dari SIMRS Khanza
    const journalData = await getJournalDataFromKhanza(startDate, endDate);

    return new Response(JSON.stringify(journalData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in journal data API:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to retrieve journal data' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}