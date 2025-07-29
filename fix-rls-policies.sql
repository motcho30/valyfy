-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own project prompts" ON prompts;
DROP POLICY IF EXISTS "Users can insert prompts for their own projects" ON prompts;
DROP POLICY IF EXISTS "Users can update prompts for their own projects" ON prompts;
DROP POLICY IF EXISTS "Users can delete prompts for their own projects" ON prompts;

-- Create simpler policies that work with the current setup
CREATE POLICY "Enable read access for all users" ON prompts
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON prompts
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON prompts
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON prompts
    FOR DELETE USING (auth.role() = 'authenticated');

-- Alternative: If you want to keep project-based isolation, use this instead:
-- CREATE POLICY "Enable read access for project owners" ON prompts
--     FOR SELECT USING (
--         project_id IN (
--             SELECT id FROM projects WHERE user_id = auth.uid()
--         )
--     );
-- 
-- CREATE POLICY "Enable insert for project owners" ON prompts
--     FOR INSERT WITH CHECK (
--         project_id IN (
--             SELECT id FROM projects WHERE user_id = auth.uid()
--         )
--     );
-- 
-- CREATE POLICY "Enable update for project owners" ON prompts
--     FOR UPDATE USING (
--         project_id IN (
--             SELECT id FROM projects WHERE user_id = auth.uid()
--         )
--     );
-- 
-- CREATE POLICY "Enable delete for project owners" ON prompts
--     FOR DELETE USING (
--         project_id IN (
--             SELECT id FROM projects WHERE user_id = auth.uid()
--         )
--     ); 