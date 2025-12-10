-- Fix the SECURITY DEFINER view issue by using SECURITY INVOKER
DROP VIEW IF EXISTS public.user_reports;

-- Recreate view with SECURITY INVOKER (safer)
CREATE VIEW public.user_reports 
WITH (security_invoker = true)
AS
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