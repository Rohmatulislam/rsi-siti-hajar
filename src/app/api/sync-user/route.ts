import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { syncUserToDatabase } from '@/lib/user-sync';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Sinkronkan pengguna ke database
    console.log('API: Syncing user to database:', userId);
    const syncedUser = await syncUserToDatabase(userId);
    
    if (!syncedUser) {
      return new Response(
        JSON.stringify({ error: 'Failed to sync user' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        message: 'User synced successfully', 
        user: syncedUser 
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in sync API:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}