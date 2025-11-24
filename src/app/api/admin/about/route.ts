import { NextRequest } from 'next/server';
import { getAboutContent, updateAboutContent } from '@/app/admin/about/services/about-service';

export async function GET(request: NextRequest) {
  try {
    const aboutContent = await getAboutContent();
    
    return new Response(JSON.stringify(aboutContent), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching about content:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch about content', details: (error as Error).message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    
    if (!data.id) {
      return new Response(
        JSON.stringify({ error: 'About content ID is required' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
    
    const updatedContent = await updateAboutContent(data.id, data);
    
    return new Response(JSON.stringify(updatedContent), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error updating about content:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update about content', details: (error as Error).message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}