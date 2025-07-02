import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Loader, Copy, ExternalLink } from 'lucide-react';

const DatabaseSetup = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [setupComplete, setSetupComplete] = useState(false);
  const [error, setError] = useState(null);

  const setupSQL = `-- Create custom types
DO $$ BEGIN
    CREATE TYPE project_type AS ENUM ('Web App', 'Mobile App', 'SaaS', 'Dashboard', 'E-commerce', 'API', 'Other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name text,
  username text UNIQUE,
  avatar_url text,
  bio text,
  website text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  type project_type DEFAULT 'Web App',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  is_archived boolean DEFAULT false
);

-- Create project_files table
CREATE TABLE IF NOT EXISTS public.project_files (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  file_name text NOT NULL,
  file_type text NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_project_files_project_id ON public.project_files(project_id);
CREATE INDEX IF NOT EXISTS idx_project_files_type ON public.project_files(file_type);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY IF NOT EXISTS "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY IF NOT EXISTS "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY IF NOT EXISTS "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policies for projects
CREATE POLICY IF NOT EXISTS "Users can view their own projects" ON public.projects
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Users can insert their own projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Users can update their own projects" ON public.projects
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Users can delete their own projects" ON public.projects
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for project_files
CREATE POLICY IF NOT EXISTS "Users can view files from their own projects" ON public.project_files
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_files.project_id AND projects.user_id = auth.uid())
  );
CREATE POLICY IF NOT EXISTS "Users can insert files to their own projects" ON public.project_files
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_files.project_id AND projects.user_id = auth.uid())
  );
CREATE POLICY IF NOT EXISTS "Users can update files from their own projects" ON public.project_files
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_files.project_id AND projects.user_id = auth.uid())
  );
CREATE POLICY IF NOT EXISTS "Users can delete files from their own projects" ON public.project_files
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_files.project_id AND projects.user_id = auth.uid())
  );

-- Create function for profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'username', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create update triggers
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_project_files_updated_at ON public.project_files;
CREATE TRIGGER update_project_files_updated_at
  BEFORE UPDATE ON public.project_files
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(setupSQL);
      setStep(2);
    } catch (err) {
      setError('Failed to copy to clipboard. Please select and copy manually.');
    }
  };

  const handleComplete = () => {
    setSetupComplete(true);
    setTimeout(() => {
      onComplete && onComplete();
    }, 2000);
  };

  const openSupabase = () => {
    window.open('https://kjwwfmmciwsamjjfcwio.supabase.co/project/default/sql', '_blank');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl"
      >
        <div className="text-center mb-8">
          <h1 className="font-jersey text-3xl md:text-4xl text-black mb-4">
            🚀 Database Setup Required
          </h1>
          <p className="text-black/60 text-lg">
            Let's set up your Supabase database tables to enable full functionality
          </p>
        </div>

        {!setupComplete ? (
          <div className="bg-white/60 backdrop-blur-xl border border-black/10 rounded-2xl p-8 shadow-lg">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-vibe-cyan rounded-full flex items-center justify-center text-black font-semibold">
                    1
                  </div>
                  <h2 className="text-xl font-semibold text-black">Copy Database Schema</h2>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 max-h-64 overflow-y-auto">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                    {setupSQL.substring(0, 500)}...
                  </pre>
                  <p className="text-sm text-gray-500 mt-2">
                    Complete SQL schema ({setupSQL.length} characters)
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={copyToClipboard}
                  className="w-full bg-vibe-cyan text-black py-4 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                >
                  <Copy className="w-5 h-5" />
                  <span>Copy SQL to Clipboard</span>
                </motion.button>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <span className="text-red-600">{error}</span>
                  </div>
                )}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div className="w-8 h-8 bg-vibe-cyan rounded-full flex items-center justify-center text-black font-semibold">
                    2
                  </div>
                  <h2 className="text-xl font-semibold text-black">Run in Supabase SQL Editor</h2>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="font-semibold text-blue-900 mb-3">Next Steps:</h3>
                  <ol className="list-decimal list-inside space-y-2 text-blue-800">
                    <li>Click the button below to open Supabase SQL Editor</li>
                    <li>Paste the copied SQL schema into the editor</li>
                    <li>Click "Run" to execute the schema</li>
                    <li>Return here and click "Setup Complete"</li>
                  </ol>
                </div>

                <div className="flex space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={openSupabase}
                    className="flex-1 bg-slate-800 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                  >
                    <ExternalLink className="w-5 h-5" />
                    <span>Open Supabase SQL Editor</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleComplete}
                    className="flex-1 bg-vibe-cyan text-black py-4 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>Setup Complete</span>
                  </motion.button>
                </div>

                <div className="text-center">
                  <button
                    onClick={copyToClipboard}
                    className="text-black/60 hover:text-black transition-colors text-sm"
                  >
                    Need to copy the SQL again?
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center bg-green-50 border border-green-200 rounded-2xl p-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-10 h-10 text-white" />
            </motion.div>

            <h2 className="text-2xl font-semibold text-green-900 mb-4">
              🎉 Database Setup Complete!
            </h2>
            <p className="text-green-700 mb-6">
              Your Supabase backend is now fully configured and ready to use.
            </p>

            <div className="flex justify-center">
              <Loader className="w-6 h-6 animate-spin text-green-600" />
              <span className="ml-2 text-green-600">Redirecting to app...</span>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default DatabaseSetup;