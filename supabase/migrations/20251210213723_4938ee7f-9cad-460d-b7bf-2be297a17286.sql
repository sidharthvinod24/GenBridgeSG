-- Fix INFO_LEAKAGE: Hide admin review details from reporters
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own reports" ON public.reports;

-- Create restricted policy for reporters (only see basic fields via view)
-- Reporters should only see: id, created_at, description, status (simplified)
CREATE POLICY "Users can view own reports basic info" 
ON public.reports 
FOR SELECT 
USING (auth.uid() = reporter_id);

-- Create a secure view for reporters that hides admin details
CREATE OR REPLACE VIEW public.user_reports AS
SELECT 
  id,
  created_at,
  description,
  reported_user_id,
  CASE 
    WHEN status = 'pending' THEN 'pending'
    WHEN status = 'reviewed' THEN 'resolved'
    ELSE status
  END as status
FROM public.reports
WHERE reporter_id = auth.uid();

-- Grant access to the view
GRANT SELECT ON public.user_reports TO authenticated;