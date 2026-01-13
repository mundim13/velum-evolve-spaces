-- Drop overly permissive policies
DROP POLICY IF EXISTS "Authenticated users can update proposals" ON public.proposals;
DROP POLICY IF EXISTS "Authenticated users can delete proposals" ON public.proposals;

-- Create more restrictive policies
CREATE POLICY "Users can update their own proposals"
ON public.proposals
FOR UPDATE
TO authenticated
USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own proposals"
ON public.proposals
FOR DELETE
TO authenticated
USING (auth.uid() = created_by);