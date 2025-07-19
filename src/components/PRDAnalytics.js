import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, FileText, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { projectService } from '../services/projectService';

const PRDAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [prdsBySource, setPrdsBySource] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Get analytics
      const { data: analyticsData, error: analyticsError } = await projectService.getPRDSourceAnalytics(user.id);
      if (analyticsError) throw analyticsError;
      setAnalytics(analyticsData);

      // Get PRDs by source
      const sources = ['landing_page', 'project_creation_flow', 'project_detail_app'];
      const sourceData = {};
      
      for (const source of sources) {
        const { data: prds, error } = await projectService.getPRDsBySource(user.id, source);
        if (!error) {
          sourceData[source] = prds;
        }
      }
      
      setPrdsBySource(sourceData);
    } catch (error) {
      console.error('Error fetching PRD analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSourceLabel = (source) => {
    switch (source) {
      case 'landing_page': return 'Landing Page';
      case 'project_creation_flow': return 'Project Creation Flow';
      case 'project_detail_app': return 'Project Detail App';
      default: return 'Unknown';
    }
  };

  const getSourceColor = (source) => {
    switch (source) {
      case 'landing_page': return 'bg-blue-500';
      case 'project_creation_flow': return 'bg-green-500';
      case 'project_detail_app': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
        <p className="text-center text-gray-600 mt-4">Loading analytics...</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center space-x-3 mb-8">
        <BarChart3 className="w-8 h-8 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">PRD Source Analytics</h1>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
          <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{analytics.total}</div>
          <div className="text-sm text-gray-600">Total PRDs</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
          <div className="w-8 h-8 bg-blue-500 rounded mx-auto mb-2"></div>
          <div className="text-2xl font-bold text-gray-900">{analytics.landing_page}</div>
          <div className="text-sm text-gray-600">Landing Page</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
          <div className="w-8 h-8 bg-green-500 rounded mx-auto mb-2"></div>
          <div className="text-2xl font-bold text-gray-900">{analytics.project_creation_flow}</div>
          <div className="text-sm text-gray-600">Project Creation</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
          <div className="w-8 h-8 bg-purple-500 rounded mx-auto mb-2"></div>
          <div className="text-2xl font-bold text-gray-900">{analytics.project_detail_app}</div>
          <div className="text-sm text-gray-600">Project Detail</div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">PRD Generation by Source</h3>
        <div className="space-y-4">
          {['landing_page', 'project_creation_flow', 'project_detail_app'].map((source) => {
            const count = analytics[source];
            const percentage = analytics.total > 0 ? (count / analytics.total) * 100 : 0;
            
            return (
              <div key={source} className="flex items-center space-x-4">
                <div className="w-32 text-sm text-gray-700 font-medium">
                  {getSourceLabel(source)}
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className={`h-full rounded-full ${getSourceColor(source)}`}
                  />
                </div>
                <div className="w-16 text-sm text-gray-900 font-semibold">
                  {count} ({percentage.toFixed(1)}%)
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent PRDs by Source */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {['landing_page', 'project_creation_flow', 'project_detail_app'].map((source) => (
          <div key={source} className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <div className={`w-4 h-4 ${getSourceColor(source)} rounded mr-2`}></div>
              {getSourceLabel(source)}
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {prdsBySource[source]?.slice(0, 5).map((prd) => (
                <div key={prd.id} className="border-b border-gray-100 pb-2 last:border-b-0">
                  <div className="font-medium text-sm text-gray-900 truncate">
                    {prd.projectName}
                  </div>
                  <div className="text-xs text-gray-600">
                    {new Date(prd.createdAt).toLocaleDateString()}
                  </div>
                </div>
              )) || (
                <div className="text-sm text-gray-500 italic">No PRDs from this source yet</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Debug Information */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Debug Info:</h4>
        <pre className="text-xs text-gray-600 overflow-auto">
          {JSON.stringify(analytics, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default PRDAnalytics; 