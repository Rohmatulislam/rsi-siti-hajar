import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent, UserJSON } from '@clerk/nextjs/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function POST(req: Request) {
  console.log('Received webhook event');
  
  // You can find this in the Clerk Dashboard under Webhooks section
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  
  if (!WEBHOOK_SECRET) {
    console.error('CLERK_WEBHOOK_SECRET is missing');
    return new Response('Error: CLERK_WEBHOOK_SECRET is missing', {
      status: 500,
    });
  }
  console.log("🔍 SUPABASE_SERVICE_ROLE_KEY prefix:", process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 10));

  // Get the headers
  const headerPayload = headers();
  const svixId = (await headerPayload).get('svix-id');
  const svixTimestamp = (await headerPayload).get('svix-timestamp');
  const svixSignature = (await headerPayload).get('svix-signature');

  // If there are no headers, error out
  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response('Error: Missing svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);
  
  // Create a new Svix instance with your secret
  const wh = new Webhook(WEBHOOK_SECRET);
  
  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error: Invalid signature', {
      status: 400,
    });
  }
  
  // Get the type
  const { type } = evt;
  console.log(`Processing event: ${type} with ID: ${'id' in evt ? evt.id : 'unknown'}`);
  
  // Handle different event types
  switch (type) {
    case 'user.created':
      console.log('Processing user.created event');
      // When a user is created in Clerk, create a corresponding record in Supabase
      const userCreated = evt.data as UserJSON;
      await handleUserCreated(userCreated);
      break;
    case 'user.updated':
      console.log('Processing user.updated event');
      // When a user is updated in Clerk, update the corresponding record in Supabase
      const userUpdated = evt.data as UserJSON;
      await handleUserUpdated(userUpdated);
      break;
    case 'user.deleted':
      console.log('Processing user.deleted event');
      // When a user is deleted in Clerk, soft delete or remove from Supabase
      const userDeleted = evt.data as { id: string };
      await handleUserDeleted(userDeleted.id);
      break;
    default:
      console.log(`Unhandled event type: ${type}`);
      break;
  }

  console.log(`Completed processing event: ${type}`);
  return new Response('', { status: 200 });
}

async function handleUserCreated(user: UserJSON) {
  try {
    console.log('Handling user created event for:', user.id);
    
    const supabase = await createSupabaseServerClient(true); // gunakan service role key
    
    // Cek apakah pengguna sudah ada
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('user_id')
      .eq('user_id', user.id)
      .single();

    // Jika pengguna belum ada, buat entri baru
    if (!existingUser) {
      const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || 
                     user.email_addresses[0]?.email_address || 
                     user.username || '';
      
      const { error: insertError } = await supabase
        .from('users')
        .insert([{
          user_id: user.id,
          full_name: fullName,
          email: user.email_addresses[0]?.email_address || '',
          phone: user.phone_numbers[0]?.phone_number || null,
          role: 'patient', // default role
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }]);

      if (insertError) {
        console.error('Error inserting user into Supabase:', insertError);
      } else {
        console.log('✅ User created in Supabase:', user.id);
      }
    } else {
      console.log('User already exists in Supabase:', user.id);
    }
  } catch (err) {
    console.error('Error in handleUserCreated:', err);
  }
}

async function handleUserUpdated(user: UserJSON) {
  try {
    console.log('Handling user updated event for:', user.id);
    
    const supabase = await createSupabaseServerClient(true); // gunakan service role key
    
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || 
                   user.email_addresses[0]?.email_address || 
                   user.username || '';
    
    const { error } = await supabase
      .from('users')
      .update({
        full_name: fullName,
        email: user.email_addresses[0]?.email_address || '',
        phone: user.phone_numbers[0]?.phone_number || null,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating user in Supabase:', error);
    } else {
      console.log('User updated in Supabase:', user.id);
    }
  } catch (err) {
    console.error('Error in handleUserUpdated:', err);
  }
}

async function handleUserDeleted(userId: string) {
  try {
    console.log('Handling user deleted event for:', userId);
    
    const supabase = await createSupabaseServerClient(true); // gunakan service role key
    
    // Soft delete by updating a deleted_at field
    const { error } = await supabase
      .from('users')
      .update({ 
        deleted_at: new Date().toISOString() 
      })
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting user from Supabase:', error);
    } else {
      console.log('User deleted from Supabase:', userId);
    }
  } catch (err) {
    console.error('Error in handleUserDeleted:', err);
  }
}