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
ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS prd_source text;

-- Create table for tracking prompt copy activities
CREATE TABLE IF NOT EXISTS public.prompt_copy_activities (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  design_card_id text NOT NULL,
  design_card_name text NOT NULL,
  prompt_content text NOT NULL,
  user_authenticated boolean DEFAULT false,
  has_payment_access boolean DEFAULT false,
  copy_source text DEFAULT 'design_inspiration',
  user_agent text,
  ip_address text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

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

-- Update existing PRD documents with source information based on metadata
UPDATE public.project_files 
SET prd_source = CASE 
    WHEN metadata->>'creation_source' = 'project_creation_flow' THEN 'project_creation_flow'
    WHEN metadata->>'creation_source' = 'individual_generation' THEN 'project_detail_app'
    WHEN metadata->>'generated_individually' = 'true' THEN 'project_detail_app'
    ELSE 'unknown'
END
WHERE file_type = 'PRD Document' AND prd_source IS NULL;

-- Add some useful indexes
CREATE INDEX IF NOT EXISTS idx_projects_project_type ON public.projects(project_type);
CREATE INDEX IF NOT EXISTS idx_projects_features ON public.projects USING gin(features);
CREATE INDEX IF NOT EXISTS idx_project_files_file_size ON public.project_files(file_size);
CREATE INDEX IF NOT EXISTS idx_project_files_metadata ON public.project_files USING gin(metadata);
CREATE INDEX IF NOT EXISTS idx_project_files_prd_source ON public.project_files(prd_source);

-- Add indexes for prompt copy activities
CREATE INDEX IF NOT EXISTS idx_prompt_copy_activities_user_id ON public.prompt_copy_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_prompt_copy_activities_design_card_id ON public.prompt_copy_activities(design_card_id);
CREATE INDEX IF NOT EXISTS idx_prompt_copy_activities_created_at ON public.prompt_copy_activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_prompt_copy_activities_copy_source ON public.prompt_copy_activities(copy_source);

-- Enable Row Level Security (RLS) for prompt copy activities
ALTER TABLE public.prompt_copy_activities ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for prompt copy activities
CREATE POLICY IF NOT EXISTS "Users can view their own prompt copy activities" ON public.prompt_copy_activities
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY IF NOT EXISTS "Anyone can insert prompt copy activities" ON public.prompt_copy_activities
  FOR INSERT WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Users can update their own prompt copy activities" ON public.prompt_copy_activities
  FOR UPDATE USING (auth.uid() = user_id);

-- Add helpful comments
COMMENT ON COLUMN public.projects.features IS 'Array of selected features for the project';
COMMENT ON COLUMN public.projects.design_data IS 'Selected design theme and configuration';
COMMENT ON COLUMN public.projects.metadata IS 'Additional project metadata like app_idea, creation_flow, etc.';
COMMENT ON COLUMN public.project_files.file_content IS 'The actual content of the generated file';
COMMENT ON COLUMN public.project_files.file_size IS 'Size of the file content in bytes';
COMMENT ON COLUMN public.project_files.metadata IS 'File metadata like icon, original_id, etc.';
COMMENT ON COLUMN public.project_files.prd_source IS 'Source of PRD generation: landing_page, project_creation_flow, project_detail_app';
COMMENT ON TABLE public.prompt_copy_activities IS 'Tracks when users copy design prompts from DesignInspiration';
COMMENT ON COLUMN public.prompt_copy_activities.design_card_id IS 'ID of the design card that was copied';
COMMENT ON COLUMN public.prompt_copy_activities.design_card_name IS 'Name/title of the design card';
COMMENT ON COLUMN public.prompt_copy_activities.prompt_content IS 'The actual prompt text that was copied';
COMMENT ON COLUMN public.prompt_copy_activities.user_authenticated IS 'Whether the user was authenticated when copying';
COMMENT ON COLUMN public.prompt_copy_activities.has_payment_access IS 'Whether the user had payment access when copying';
COMMENT ON COLUMN public.prompt_copy_activities.copy_source IS 'Source of the copy: design_inspiration, auth_modal, etc.';
COMMENT ON COLUMN public.prompt_copy_activities.metadata IS 'Additional data like user agent, referrer, etc.';