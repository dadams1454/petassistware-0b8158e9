
-- Create puppy_health_certificates table
CREATE TABLE IF NOT EXISTS public.puppy_health_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  puppy_id UUID NOT NULL REFERENCES public.puppies(id) ON DELETE CASCADE,
  certificate_type TEXT NOT NULL,
  issue_date DATE NOT NULL,
  expiry_date DATE,
  issuer TEXT NOT NULL,
  file_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create puppy_medications table
CREATE TABLE IF NOT EXISTS public.puppy_medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  puppy_id UUID NOT NULL REFERENCES public.puppies(id) ON DELETE CASCADE,
  medication_name TEXT NOT NULL,
  dosage NUMERIC NOT NULL,
  dosage_unit TEXT NOT NULL,
  frequency TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  administration_route TEXT NOT NULL,
  notes TEXT,
  last_administered TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create puppy_medication_administrations table
CREATE TABLE IF NOT EXISTS public.puppy_medication_administrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medication_id UUID NOT NULL REFERENCES public.puppy_medications(id) ON DELETE CASCADE,
  administered_at TIMESTAMPTZ NOT NULL,
  administered_by TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create storage bucket for health certificates
INSERT INTO storage.buckets (id, name, public)
VALUES ('health_certificates', 'health_certificates', true);

-- Set up RLS policies
ALTER TABLE public.puppy_health_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.puppy_medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.puppy_medication_administrations ENABLE ROW LEVEL SECURITY;

-- Allow read access to all puppy health certificates
CREATE POLICY "Anyone can view puppy health certificates"
ON public.puppy_health_certificates
FOR SELECT USING (true);

-- Allow insert for puppy health certificates
CREATE POLICY "Anyone can insert puppy health certificates"
ON public.puppy_health_certificates
FOR INSERT WITH CHECK (true);

-- Allow update for puppy health certificates
CREATE POLICY "Anyone can update puppy health certificates"
ON public.puppy_health_certificates
FOR UPDATE USING (true);

-- Allow delete for puppy health certificates
CREATE POLICY "Anyone can delete puppy health certificates"
ON public.puppy_health_certificates
FOR DELETE USING (true);

-- Allow read access to all puppy medications
CREATE POLICY "Anyone can view puppy medications"
ON public.puppy_medications
FOR SELECT USING (true);

-- Allow insert for puppy medications
CREATE POLICY "Anyone can insert puppy medications"
ON public.puppy_medications
FOR INSERT WITH CHECK (true);

-- Allow update for puppy medications
CREATE POLICY "Anyone can update puppy medications"
ON public.puppy_medications
FOR UPDATE USING (true);

-- Allow delete for puppy medications
CREATE POLICY "Anyone can delete puppy medications"
ON public.puppy_medications
FOR DELETE USING (true);

-- Allow read access to all puppy medication administrations
CREATE POLICY "Anyone can view puppy medication administrations"
ON public.puppy_medication_administrations
FOR SELECT USING (true);

-- Allow insert for puppy medication administrations
CREATE POLICY "Anyone can insert puppy medication administrations"
ON public.puppy_medication_administrations
FOR INSERT WITH CHECK (true);

-- Allow update for puppy medication administrations
CREATE POLICY "Anyone can update puppy medication administrations"
ON public.puppy_medication_administrations
FOR UPDATE USING (true);

-- Allow delete for puppy medication administrations
CREATE POLICY "Anyone can delete puppy medication administrations"
ON public.puppy_medication_administrations
FOR DELETE USING (true);

-- Allow file uploads to health_certificates bucket
CREATE POLICY "Anyone can upload health certificate files"
ON storage.objects
FOR INSERT 
WITH CHECK (bucket_id = 'health_certificates');

-- Allow select from health_certificates bucket
CREATE POLICY "Anyone can view health certificate files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'health_certificates');

-- Allow delete from health_certificates bucket
CREATE POLICY "Anyone can delete health certificate files"
ON storage.objects
FOR DELETE
USING (bucket_id = 'health_certificates');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_puppy_health_certificates_puppy_id ON public.puppy_health_certificates(puppy_id);
CREATE INDEX IF NOT EXISTS idx_puppy_medications_puppy_id ON public.puppy_medications(puppy_id);
CREATE INDEX IF NOT EXISTS idx_puppy_medication_administrations_medication_id ON public.puppy_medication_administrations(medication_id);
