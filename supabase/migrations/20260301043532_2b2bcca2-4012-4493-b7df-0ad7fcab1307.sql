
-- Drop and recreate policies as PERMISSIVE
DROP POLICY IF EXISTS "Users can create complaints" ON public.complaints;
CREATE POLICY "Users can create complaints"
ON public.complaints FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can view their own complaints" ON public.complaints;
CREATE POLICY "Users can view their own complaints"
ON public.complaints FOR SELECT
TO authenticated
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can view complaints in their category" ON public.complaints;
CREATE POLICY "Admins can view complaints in their category"
ON public.complaints FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'super_admin'::app_role) OR
  (has_role(auth.uid(), 'roads_admin'::app_role) AND category = 'roads'::complaint_category) OR
  (has_role(auth.uid(), 'waste_admin'::app_role) AND category = 'waste'::complaint_category) OR
  (has_role(auth.uid(), 'electricity_admin'::app_role) AND category = 'electricity'::complaint_category)
);

DROP POLICY IF EXISTS "Admins can update complaints in their category" ON public.complaints;
CREATE POLICY "Admins can update complaints in their category"
ON public.complaints FOR UPDATE
TO authenticated
USING (
  has_role(auth.uid(), 'super_admin'::app_role) OR
  (has_role(auth.uid(), 'roads_admin'::app_role) AND category = 'roads'::complaint_category) OR
  (has_role(auth.uid(), 'waste_admin'::app_role) AND category = 'waste'::complaint_category) OR
  (has_role(auth.uid(), 'electricity_admin'::app_role) AND category = 'electricity'::complaint_category)
);
