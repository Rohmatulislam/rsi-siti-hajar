import { NextRequest } from 'next/server';
import { deleteFounder, getFounderById, updateFounder } from '@/app/admin/about/services/about-service';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Founder ID is required' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const founder = await getFounderById(id);

    return new Response(JSON.stringify(founder), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching founder:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch founder', details: (error as Error).message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Founder ID is required' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    await deleteFounder(id);

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error deleting founder:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to delete founder', details: (error as Error).message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id: routeId } = await params; // Await params

    if (!routeId) {
      return new Response(
        JSON.stringify({ error: 'Founder ID is required' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const data = await request.json();

    // Jangan sertakan ID dalam data update karena ID adalah primary key
    const { id, ...updateData } = data;

    const updatedFounder = await updateFounder(routeId, updateData);

    return new Response(JSON.stringify(updatedFounder), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error updating founder:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update founder', details: (error as Error).message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}