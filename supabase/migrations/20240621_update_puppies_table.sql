
-- Add new columns to the puppies table
ALTER TABLE puppies 
ADD COLUMN IF NOT EXISTS birth_weight TEXT,
ADD COLUMN IF NOT EXISTS current_weight TEXT,
ADD COLUMN IF NOT EXISTS color TEXT,
ADD COLUMN IF NOT EXISTS markings TEXT,
ADD COLUMN IF NOT EXISTS notes TEXT;
