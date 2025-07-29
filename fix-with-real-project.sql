-- First, let's see what projects exist in the database
SELECT id, name FROM projects LIMIT 5;

-- Temporarily disable RLS to test basic functionality
ALTER TABLE prompts DISABLE ROW LEVEL SECURITY;

-- Test insert using a real project ID (replace with actual project ID from above query)
-- We'll use the first project ID we find
INSERT INTO prompts (project_id, name, content, category, usage_count) 
SELECT 
    p.id,
    'Test Prompt',
    'This is a test prompt content',
    'Test',
    0
FROM projects p 
LIMIT 1;

-- Check if insert worked
SELECT * FROM prompts WHERE name = 'Test Prompt';

-- Clean up test data
DELETE FROM prompts WHERE name = 'Test Prompt';

-- Re-enable RLS with simple policies
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies first
DROP POLICY IF EXISTS "Users can view their own project prompts" ON prompts;
DROP POLICY IF EXISTS "Users can insert prompts for their own projects" ON prompts;
DROP POLICY IF EXISTS "Users can update prompts for their own projects" ON prompts;
DROP POLICY IF EXISTS "Users can delete prompts for their own projects" ON prompts;
DROP POLICY IF EXISTS "Enable read access for all users" ON prompts;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON prompts;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON prompts;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON prompts;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON prompts;

-- Create simple policies that work
CREATE POLICY "Allow all operations for authenticated users" ON prompts
    FOR ALL USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated'); 