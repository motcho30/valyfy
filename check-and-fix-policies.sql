-- First, let's see what policies currently exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'prompts';

-- Drop ALL existing policies for the prompts table
DROP POLICY IF EXISTS "Users can view their own project prompts" ON prompts;
DROP POLICY IF EXISTS "Users can insert prompts for their own projects" ON prompts;
DROP POLICY IF EXISTS "Users can update prompts for their own projects" ON prompts;
DROP POLICY IF EXISTS "Users can delete prompts for their own projects" ON prompts;
DROP POLICY IF EXISTS "Enable read access for all users" ON prompts;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON prompts;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON prompts;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON prompts;

-- Create new policies
CREATE POLICY "Enable read access for all users" ON prompts
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON prompts
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON prompts
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON prompts
    FOR DELETE USING (auth.role() = 'authenticated');

-- Verify the new policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'prompts'; 