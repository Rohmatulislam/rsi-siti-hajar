import { NextRequest } from 'next/server';
import { getFounders, createFounder } from '@/app/admin/about/services/about-service';

export async function GET(request: NextRequest) {
  try {
    const founders = await getFounders();

    return new Response(JSON.stringify(founders), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching founders:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch founders', details: (error as Error).message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const newFounder = await createFounder(data);

    return new Response(JSON.stringify(newFounder), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error creating founder:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create founder', details: (error as Error).message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}