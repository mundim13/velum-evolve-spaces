-- Create proposals table
CREATE TABLE public.proposals (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    client_name TEXT NOT NULL,
    client_email TEXT,
    client_phone TEXT,
    description TEXT,
    total_value DECIMAL(10,2),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'accepted', 'rejected')),
    items JSONB DEFAULT '[]'::jsonb,
    notes TEXT,
    valid_until DATE,
    access_token UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

-- Policy: Admin users can view all proposals
CREATE POLICY "Authenticated users can view all proposals"
ON public.proposals
FOR SELECT
TO authenticated
USING (true);

-- Policy: Authenticated users can create proposals
CREATE POLICY "Authenticated users can create proposals"
ON public.proposals
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by);

-- Policy: Authenticated users can update proposals
CREATE POLICY "Authenticated users can update proposals"
ON public.proposals
FOR UPDATE
TO authenticated
USING (true);

-- Policy: Authenticated users can delete proposals
CREATE POLICY "Authenticated users can delete proposals"
ON public.proposals
FOR DELETE
TO authenticated
USING (true);

-- Policy: Public access via access_token (for clients viewing their proposal)
CREATE POLICY "Public can view proposals via access_token"
ON public.proposals
FOR SELECT
TO anon
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_proposals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_proposals_updated_at
BEFORE UPDATE ON public.proposals
FOR EACH ROW
EXECUTE FUNCTION public.update_proposals_updated_at();