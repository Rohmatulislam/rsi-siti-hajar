-- Add missing RLS policies for doctors and schedules tables

-- RLS Policies for doctors table
CREATE POLICY "Service role can manage all doctors" ON public.doctors
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin can manage all doctors" ON public.doctors
  FOR ALL TO authenticated
  USING (
    (SELECT role FROM public.users WHERE user_id = auth.jwt() ->> 'sub') = 'admin'
  )
  WITH CHECK (
    (SELECT role FROM public.users WHERE user_id = auth.jwt() ->> 'sub') = 'admin'
  );

-- RLS Policies for schedules table
CREATE POLICY "Service role can manage all schedules" ON public.schedules
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin can manage all schedules" ON public.schedules
  FOR ALL TO authenticated
  USING (
    (SELECT role FROM public.users WHERE user_id = auth.jwt() ->> 'sub') = 'admin'
  )
  WITH CHECK (
    (SELECT role FROM public.users WHERE user_id = auth.jwt() ->> 'sub') = 'admin'
  );