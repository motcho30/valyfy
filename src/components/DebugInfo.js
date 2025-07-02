import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const DebugInfo = ({ projects, loading }) => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  
  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 bg-white border border-slate-300 rounded-lg p-4 shadow-lg text-xs max-w-xs">
      <h4 className="font-semibold mb-2">Debug Info</h4>
      <div className="space-y-1">
        <div>Auth Loading: {authLoading ? '✅' : '❌'}</div>
        <div>Authenticated: {isAuthenticated ? '✅' : '❌'}</div>
        <div>User ID: {user?.id || 'None'}</div>
        <div>Projects Loading: {loading ? '✅' : '❌'}</div>
        <div>Projects Count: {projects?.length || 0}</div>
        <div>localStorage: {JSON.parse(localStorage.getItem('fallback_projects') || '[]').length} projects</div>
      </div>
    </div>
  );
};

export default DebugInfo;