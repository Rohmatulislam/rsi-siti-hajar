import { NextResponse } from 'next/server';
import { testSupabaseConnection } from '@/lib/service-service';

export async function GET() {
  try {
    const result = await testSupabaseConnection();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}