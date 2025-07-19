# PRD Source Tracking Database Update

## What's New
Added comprehensive tracking for PRD generation sources to distinguish between:
- **Landing Page** - PRDs generated directly from landing page
- **Project Creation Flow** - PRDs generated during project creation  
- **Project Detail App** - PRDs generated within existing projects

## Database Changes Required

### 1. Run This SQL in Supabase Dashboard

Go to **SQL Editor** in your Supabase dashboard and run:

```sql
-- Add prd_source column to track PRD generation source
ALTER TABLE public.project_files 
ADD COLUMN IF NOT EXISTS prd_source text;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_project_files_prd_source ON public.project_files(prd_source);

-- Update existing PRD documents with source information based on metadata
UPDATE public.project_files 
SET prd_source = CASE 
    WHEN metadata->>'creation_source' = 'project_creation_flow' THEN 'project_creation_flow'
    WHEN metadata->>'creation_source' = 'individual_generation' THEN 'project_detail_app' 
    WHEN metadata->>'generated_individually' = 'true' THEN 'project_detail_app'
    ELSE 'unknown'
END
WHERE file_type = 'PRD Document' AND prd_source IS NULL;

-- Add helpful comment
COMMENT ON COLUMN public.project_files.prd_source IS 'Source of PRD generation: landing_page, project_creation_flow, project_detail_app';
```

### 2. Verify the Update

After running the SQL, verify it worked:

```sql
-- Check the new column exists
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'project_files' AND column_name = 'prd_source';

-- Check existing PRDs got updated with source info  
SELECT prd_source, COUNT(*) as count
FROM project_files 
WHERE file_type = 'PRD Document'
GROUP BY prd_source;
```

## How It Works Now

### 📄 **Landing Page PRDs**
When users generate PRDs from the landing page (PRDStarter component):
- ✅ Creates a project automatically 
- ✅ Saves PRD with `prd_source = 'landing_page'`
- ✅ Shows "Save to Project" button for authenticated users

### 🛠️ **Project Creation PRDs** 
When users go through the full project creation flow:
- ✅ Saves PRD with `prd_source = 'project_creation_flow'` 
- ✅ Links to the created project

### 🎯 **Individual PRDs**
When users generate PRDs within existing projects (ProjectDetail):
- ✅ Saves PRD with `prd_source = 'project_detail_app'`
- ✅ Associates with the specific project

## New Analytics Available

### Query Functions Added:
```javascript
// Get PRDs by specific source
const { data: landingPagePRDs } = await projectService.getPRDsBySource(userId, 'landing_page');

// Get all PRDs for a user
const { data: allPRDs } = await projectService.getPRDsBySource(userId);

// Get analytics breakdown
const { data: analytics } = await projectService.getPRDSourceAnalytics(userId);
// Returns: { landing_page: 5, project_creation_flow: 12, project_detail_app: 3, total: 20 }
```

### Analytics Dashboard Component:
- Use `<PRDAnalytics />` component to see visual breakdown
- Shows charts, percentages, and recent PRDs by source
- Perfect for understanding user behavior

## Testing the Implementation

1. **Test Landing Page**: Generate PRD from landing page while authenticated
2. **Test Project Creation**: Create new project with PRD generation  
3. **Test Individual Generation**: Generate PRD within existing project
4. **Check Analytics**: Use PRDAnalytics component or query functions

All PRDs will now be properly tracked with their generation source! 🎉 