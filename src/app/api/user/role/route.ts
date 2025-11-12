import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    // Get the current user from Clerk
    const { userId } = await auth();
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User not authenticated' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get Supabase client with service role for server-side operations
    const supabase = await createSupabaseServerClient(true);

    // Fetch user role from our database
    const { data: userData, error } = await supabase
      .from('users')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching user role:', error);
      return new Response(
        JSON.stringify({ error: 'Error fetching user role' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!userData) {
      return new Response(
        JSON.stringify({ error: 'User not found in database' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Return the user role
    return new Response(
      JSON.stringify({ role: userData.role }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in API route:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}