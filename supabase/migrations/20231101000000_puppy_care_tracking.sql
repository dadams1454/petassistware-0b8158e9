
-- Create puppy care logs table for all types of care entries
CREATE TABLE IF NOT EXISTS public.puppy_care_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  puppy_id UUID NOT NULL REFERENCES public.puppies(id) ON DELETE CASCADE,
  care_type TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  details JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create table for puppy developmental milestones
CREATE TABLE IF NOT EXISTS public.puppy_developmental_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  puppy_id UUID NOT NULL REFERENCES public.puppies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  milestone_type TEXT NOT NULL,
  expected_age_days INTEGER NOT NULL,
  description TEXT,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  completion_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  actual_age_days INTEGER,
  milestone_category TEXT NOT NULL DEFAULT 'developmental',
  photo_url TEXT
);

-- Add is_test_data column to puppies table
ALTER TABLE public.puppies ADD COLUMN IF NOT EXISTS is_test_data BOOLEAN DEFAULT false;

-- Index for faster querying
CREATE INDEX IF NOT EXISTS idx_puppy_care_logs_puppy_id ON public.puppy_care_logs(puppy_id);
CREATE INDEX IF NOT EXISTS idx_puppy_care_logs_timestamp ON public.puppy_care_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_puppy_dev_milestones_puppy_id ON public.puppy_developmental_milestones(puppy_id);
CREATE INDEX IF NOT EXISTS idx_puppies_is_test_data ON public.puppies(is_test_data);

-- Enable Row Level Security
ALTER TABLE public.puppy_care_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.puppy_developmental_milestones ENABLE ROW LEVEL SECURITY;

-- Create policies for puppy care logs
CREATE POLICY "Users can view all puppy care logs" 
ON public.puppy_care_logs FOR SELECT USING (true);

CREATE POLICY "Users can insert puppy care logs" 
ON public.puppy_care_logs FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update puppy care logs" 
ON public.puppy_care_logs FOR UPDATE USING (true);

CREATE POLICY "Users can delete puppy care logs" 
ON public.puppy_care_logs FOR DELETE USING (true);

-- Create policies for puppy developmental milestones
CREATE POLICY "Users can view all puppy developmental milestones" 
ON public.puppy_developmental_milestones FOR SELECT USING (true);

CREATE POLICY "Users can insert puppy developmental milestones" 
ON public.puppy_developmental_milestones FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update puppy developmental milestones" 
ON public.puppy_developmental_milestones FOR UPDATE USING (true);

CREATE POLICY "Users can delete puppy developmental milestones" 
ON public.puppy_developmental_milestones FOR DELETE USING (true);
