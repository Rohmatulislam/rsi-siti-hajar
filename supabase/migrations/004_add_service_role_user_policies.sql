-- Add missing service role policies for users table

-- Policy to allow service role to select users
CREATE POLICY "Service role can select users" ON public.users
  FOR SELECT TO service_role
  USING (true);

-- Policy to allow service role to update users
CREATE POLICY "Service role can update users" ON public.users
  FOR UPDATE TO service_role
  USING (true)
  WITH CHECK (true);