# Prompt Copy Tracking Database Update

## What's New
Added **Silent Prompt Copy Activity Tracking** for DesignInspiration component:
- **No UI changes** - completely transparent to users
- **Silent tracking** when users copy design prompts  
- **User authentication status** at time of copy
- **Payment access status** tracking
- **Design card information** and metadata

## Database Changes Required

### Run This SQL in Supabase Dashboard

Go to **SQL Editor** in your Supabase dashboard and run:

```sql
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

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_prompt_copy_activities_user_id ON public.prompt_copy_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_prompt_copy_activities_design_card_id ON public.prompt_copy_activities(design_card_id);
CREATE INDEX IF NOT EXISTS idx_prompt_copy_activities_created_at ON public.prompt_copy_activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_prompt_copy_activities_copy_source ON public.prompt_copy_activities(copy_source);

-- Enable Row Level Security (RLS) for prompt copy activities
ALTER TABLE public.prompt_copy_activities ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for prompt copy activities
CREATE POLICY "Users can view their own prompt copy activities" ON public.prompt_copy_activities
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anyone can insert prompt copy activities" ON public.prompt_copy_activities
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own prompt copy activities" ON public.prompt_copy_activities
  FOR UPDATE USING (auth.uid() = user_id);

-- Add helpful comments
COMMENT ON TABLE public.prompt_copy_activities IS 'Tracks when users copy design prompts from DesignInspiration';
COMMENT ON COLUMN public.prompt_copy_activities.design_card_id IS 'ID of the design card that was copied';
COMMENT ON COLUMN public.prompt_copy_activities.design_card_name IS 'Name/title of the design card';
COMMENT ON COLUMN public.prompt_copy_activities.prompt_content IS 'The actual prompt text that was copied';
COMMENT ON COLUMN public.prompt_copy_activities.user_authenticated IS 'Whether the user was authenticated when copying';
COMMENT ON COLUMN public.prompt_copy_activities.has_payment_access IS 'Whether the user had payment access when copying';
COMMENT ON COLUMN public.prompt_copy_activities.copy_source IS 'Source of the copy: design_inspiration, auth_modal, etc.';
COMMENT ON COLUMN public.prompt_copy_activities.user_agent IS 'Browser user agent string';
COMMENT ON COLUMN public.prompt_copy_activities.metadata IS 'Additional data like browser language, screen resolution, etc.';
```

### Verify the Installation

After running the SQL, verify everything worked:

```sql
-- Check prompt copy activities table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'prompt_copy_activities'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check if indexes were created
SELECT indexname, tablename 
FROM pg_indexes 
WHERE tablename = 'prompt_copy_activities'
AND schemaname = 'public'
ORDER BY indexname;

-- Check RLS policies
SELECT policyname, tablename, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'prompt_copy_activities';

-- Test table is ready (should return 0 rows but no error)
SELECT COUNT(*) FROM public.prompt_copy_activities;
```

## How Prompt Copy Tracking Works

### 📋 **What Gets Tracked (Completely Silent)**

**Data Captured:**
- ✅ **User ID** (if authenticated, null if guest)
- ✅ **Design card details** (ID, name, prompt content)
- ✅ **Authentication status** at time of copy
- ✅ **Payment access status** when copying
- ✅ **Copy source** (design_modal, auth_modal, etc.)
- ✅ **Browser metadata** (user agent, language, screen size)
- ✅ **Timestamp** of copy activity

**Copy Sources Tracked:**
- `design_modal` - Main copy button in design modal
- `auth_modal` - Copy after authentication flow  
- `design_inspiration` - General design inspiration copies

**User Experience:**
- ✅ **No UI changes** - users see absolutely no difference
- ✅ **No interruptions** - tracking happens silently in background
- ✅ **No error messages** - if tracking fails, copy still works
- ✅ **Privacy respecting** - only tracks necessary data

## Analytics Functions Available

### User-Specific Analytics:
```javascript
// Get user's prompt copy analytics
const { data: userStats } = await projectService.getPromptCopyAnalytics(userId);

// Returns:
{
  total_copies: 15,
  unique_designs: 8, 
  authenticated_copies: 12,
  paid_access_copies: 10,
  recent_copies: [...],
  popular_designs: { "Discord Design": 3, "Notion UI": 2, ... }
}
```

### Global Statistics (Admin):
```javascript  
// Get global prompt copy statistics
const { data: globalStats } = await projectService.getGlobalPromptCopyStats();

// Returns:
{
  total_copies: 1250,
  unique_users: 89,
  authenticated_copies: 800,
  paid_access_copies: 600,
  most_copied_designs: { "Discord Design": 120, ... },
  copies_by_date: { "2024-01-15": 45, ... }
}
```

### Analytics Dashboard Component:
```javascript
import PromptCopyAnalytics from './components/PromptCopyAnalytics';

// Use in your admin/dashboard area
<PromptCopyAnalytics />
```

## Business Insights You Can Track

### 🎨 **Design Prompt Engagement:**
- **Most popular design prompts** across all users
- **Authentication conversion** - do people sign up after copying?
- **Payment conversion** - which prompts lead to paid subscriptions?
- **User engagement patterns** - which designs are gateway content?

### 👥 **User Behavior Patterns:**
- **Copy frequency** per user and globally  
- **Design preferences** by user type (guest vs auth vs paid)
- **Retention insights** - do prompt copiers become regular users?
- **Peak usage times** and popular designs by day/week

### 📈 **Conversion Funnel:**
- **Guest → Authenticated** conversion via prompt copying
- **Authenticated → Paid** conversion tracking
- **Design engagement** leading to project creation
- **Most effective designs** for user acquisition

## Table Schema Details

**Table:** `public.prompt_copy_activities`

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `user_id` | uuid | Links to auth.users (nullable for guests) |
| `design_card_id` | text | Which design was copied |
| `design_card_name` | text | Name of the design |
| `prompt_content` | text | The actual prompt copied |
| `user_authenticated` | boolean | Auth status at time of copy |
| `has_payment_access` | boolean | Payment access status |
| `copy_source` | text | Where the copy originated |
| `user_agent` | text | Browser user agent |
| `ip_address` | text | User IP (currently unused) |
| `metadata` | jsonb | Browser info, screen size, etc. |
| `created_at` | timestamp | When the copy happened |
| `updated_at` | timestamp | Last updated |

## Testing the Implementation

1. **Copy Some Prompts**: Go to DesignInspiration and copy a few design prompts
2. **Check Console Logs**: Look for "📊 Tracking prompt copy activity for:" messages
3. **Verify Database**: Run `SELECT * FROM public.prompt_copy_activities LIMIT 5;`
4. **Test Analytics**: Use the `PromptCopyAnalytics` component to view the data

**The tracking is now completely invisible to users while providing rich engagement data!** 🎉✨ 