-- Update the projects table to include additional fields for the project creation flow
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS project_type text,
ADD COLUMN IF NOT EXISTS features jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS design_data jsonb,
ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;

-- Update the project_files table to include additional fields
ALTER TABLE public.project_files 
ADD COLUMN IF NOT EXISTS file_content text,
ADD COLUMN IF NOT EXISTS file_size bigint DEFAULT 0,
ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;

-- Rename the content column to file_content if it exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'project_files' 
               AND column_name = 'content' 
               AND table_schema = 'public') THEN
        -- Copy data from content to file_content
        UPDATE public.project_files SET file_content = content WHERE file_content IS NULL;
        
        -- Drop the old content column
        ALTER TABLE public.project_files DROP COLUMN content;
    END IF;
END $$;

-- Update the type column in projects to use the project_type field
UPDATE public.projects SET project_type = type::text WHERE project_type IS NULL;

-- Add some useful indexes
CREATE INDEX IF NOT EXISTS idx_projects_project_type ON public.projects(project_type);
CREATE INDEX IF NOT EXISTS idx_projects_features ON public.projects USING gin(features);
CREATE INDEX IF NOT EXISTS idx_project_files_file_size ON public.project_files(file_size);
CREATE INDEX IF NOT EXISTS idx_project_files_metadata ON public.project_files USING gin(metadata);

-- Add helpful comments
COMMENT ON COLUMN public.projects.features IS 'Array of selected features for the project';
COMMENT ON COLUMN public.projects.design_data IS 'Selected design theme and configuration';
COMMENT ON COLUMN public.projects.metadata IS 'Additional project metadata like app_idea, creation_flow, etc.';
COMMENT ON COLUMN public.project_files.file_content IS 'The actual content of the generated file';
COMMENT ON COLUMN public.project_files.file_size IS 'Size of the file content in bytes';
COMMENT ON COLUMN public.project_files.metadata IS 'File metadata like icon, original_id, etc.';