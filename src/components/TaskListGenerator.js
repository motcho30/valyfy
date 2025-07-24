import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { generateTaskList } from '../services/taskListService';
import { Copy, Check, Download, CheckSquare, AlertCircle, RefreshCw } from 'lucide-react';

const TaskListGenerator = ({ project }) => {
  const [taskList, setTaskList] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Auto-generate task list on component mount
  useEffect(() => {
    const loadOrGenerateTaskList = async () => {
      // Try to load existing task list from localStorage
      if (project?.id) {
        const existingTaskList = localStorage.getItem(`taskList_${project.id}`);
        if (existingTaskList) {
          setTaskList(existingTaskList);
          return;
        }
      }

      // Generate new task list if none exists
      await generateNewTaskList();
    };

    if (project) {
      loadOrGenerateTaskList();
    }
  }, [project]);

  const generateNewTaskList = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const generatedTaskList = await generateTaskList(project);
      setTaskList(generatedTaskList);
      
      // Save to localStorage
      if (project?.id) {
        localStorage.setItem(`taskList_${project.id}`, generatedTaskList);
      }
    } catch (error) {
      console.error('Error generating task list:', error);
      setError(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(taskList);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const downloadTaskList = async () => {
    setIsDownloading(true);
    
    try {
      const blob = new Blob([taskList], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.name.replace(/\s+/g, '-')}-TASKS.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading task list:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const retryGeneration = () => {
    generateNewTaskList();
  };

  // Parse task list to extract summary statistics
  const getTaskStats = () => {
    if (!taskList) return { completed: 0, inProgress: 0, future: 0, total: 0 };
    
    const completedMatches = taskList.match(/- \[x\]/g) || [];
    const incompleteMatches = taskList.match(/- \[ \]/g) || [];
    
    return {
      completed: completedMatches.length,
      inProgress: 0, // We'll assume first few incomplete are in progress
      future: incompleteMatches.length,
      total: completedMatches.length + incompleteMatches.length
    };
  };

  const stats = getTaskStats();

  if (!project) {
    return (
      <div className="flex items-center justify-center h-full text-center p-6">
        <div>
          <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-700 mb-2">No Project Selected</h4>
          <p className="text-sm text-gray-500">Select a project to generate a task list.</p>
        </div>
      </div>
    );
  }

  // Enhanced view for overview page
  return (
    <div className="space-y-4">
      {isGenerating ? (
        <div className="flex items-center py-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full mr-3"
          />
          <span className="text-sm text-gray-600 font-medium">Creating your development roadmap...</span>
        </div>
      ) : error ? (
        <div className="py-6 text-center">
          <p className="text-sm text-gray-600 mb-3">Oops! {error}</p>
          <button
            onClick={retryGeneration}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-all duration-200"
          >
            Try again
          </button>
        </div>
      ) : taskList ? (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 font-medium">
              {stats.total} development tasks ready
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-600 font-medium">Generated</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <p className="text-sm text-gray-700 leading-relaxed">
              Your personalized development checklist includes project setup, feature implementation, testing protocols, and deployment steps - all optimized for Cursor AI workflow.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={downloadTaskList}
              disabled={isDownloading}
              className="flex items-center space-x-2 px-5 py-2.5 bg-gray-900 text-white rounded-md hover:bg-gray-800 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 text-sm font-medium shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'Downloading...' : 'Download TASKS.md'}</span>
            </button>
            <button
              onClick={copyToClipboard}
              className="p-2.5 text-gray-500 hover:text-gray-700 transition-colors hover:scale-110 transform duration-200 rounded-md hover:bg-gray-50"
              title="Copy to clipboard"
            >
              {isCopied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={retryGeneration}
              disabled={isGenerating}
              className="p-2.5 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50 hover:scale-110 transform duration-200 rounded-md hover:bg-gray-50"
              title="Regenerate tasks"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {isCopied && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-sm text-green-600 font-medium flex items-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>Copied to clipboard!</span>
            </motion.div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="space-y-3">
            <p className="text-sm text-gray-500">Ready to create your development roadmap?</p>
            <button
              onClick={retryGeneration}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-all duration-200"
            >
              Generate task list
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskListGenerator; 