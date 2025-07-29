-- Temporarily disable RLS to test basic functionality
ALTER TABLE prompts DISABLE ROW LEVEL SECURITY;

-- Test insert to verify it works
INSERT INTO prompts (project_id, name, content, category, usage_count) 
VALUES (
    '00000000-0000-0000-0000-000000000000',
    'Test Prompt',
    'This is a test prompt content',
    'Test',
    0
);

-- Check if insert worked
SELECT * FROM prompts WHERE name = 'Test Prompt';

-- Clean up test data
DELETE FROM prompts WHERE name = 'Test Prompt';

-- Re-enable RLS with simple policies
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;

-- Create simple policies that work
CREATE POLICY "Allow all operations for authenticated users" ON prompts
    FOR ALL USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated'); 