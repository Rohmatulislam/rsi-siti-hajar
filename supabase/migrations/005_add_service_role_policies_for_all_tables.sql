-- Add service role policies for all tables

-- Service role policies for all tables
CREATE POLICY "Service role can manage all appointments" ON public.appointments
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can manage all articles" ON public.articles
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can manage all services" ON public.services
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can manage all chat_sessions" ON public.chat_sessions
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can manage all FAQs" ON public.faqs
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can manage all job listings" ON public.job_listings
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);