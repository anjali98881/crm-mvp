
-- Add user_id column to leads table
ALTER TABLE leads ADD COLUMN IF NOT EXISTS user_id UUID;

-- Update existing leads to set user_id (optional cleanup for existing data)
-- You might want to update this based on your actual data migration strategy
-- This is just a placeholder that assigns all existing leads to the first user in userdetails
UPDATE leads
SET user_id = (SELECT id FROM userdetails LIMIT 1)
WHERE user_id IS NULL;

-- Make user_id NOT NULL after migration
ALTER TABLE leads ALTER COLUMN user_id SET NOT NULL;

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create policy for selecting own leads
CREATE POLICY "Users can view their own leads" 
ON leads FOR SELECT 
USING (user_id::text = (SELECT id FROM userdetails WHERE email = current_setting('request.jwt.claims')::json->>'email' LIMIT 1)::text);

-- Create policy for inserting own leads
CREATE POLICY "Users can insert their own leads" 
ON leads FOR INSERT 
WITH CHECK (user_id::text = (SELECT id FROM userdetails WHERE email = current_setting('request.jwt.claims')::json->>'email' LIMIT 1)::text);

-- Create policy for updating own leads
CREATE POLICY "Users can update their own leads" 
ON leads FOR UPDATE 
USING (user_id::text = (SELECT id FROM userdetails WHERE email = current_setting('request.jwt.claims')::json->>'email' LIMIT 1)::text);

-- Create policy for deleting own leads
CREATE POLICY "Users can delete their own leads" 
ON leads FOR DELETE 
USING (user_id::text = (SELECT id FROM userdetails WHERE email = current_setting('request.jwt.claims')::json->>'email' LIMIT 1)::text);
