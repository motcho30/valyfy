import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, TrendingUp, Users, Eye, BarChart3 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { projectService } from '../services/projectService';

const PromptCopyAnalytics = () => {
  const [userAnalytics, setUserAnalytics] = useState(null);
  const [globalStats, setGlobalStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('user');
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Get user-specific analytics
      if (isAuthenticated && user) {
        const { data: userStats, error: userError } = await projectService.getPromptCopyAnalytics(user.id);
        if (!userError) {
          setUserAnalytics(userStats);
        }
      }
      
      // Get global statistics
      const { data: globalData, error: globalError } = await projectService.getGlobalPromptCopyStats();
      if (!globalError) {
        setGlobalStats(globalData);
      }
      
    } catch (error) {
      console.error('Error fetching prompt copy analytics:', error);
    } finally {
      setLoading(false);
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

  const UserAnalytics = () => {
    if (!userAnalytics) {
      return (
        <div className="p-6 text-center">
          <p className="text-gray-600">No user analytics available. Please sign in to see your stats.</p>
        </div>
      );
    }

    const topDesigns = Object.entries(userAnalytics.popular_designs)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    return (
      <div className="space-y-6">
        {/* User Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <Copy className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{userAnalytics.total_copies}</div>
            <div className="text-sm text-gray-600">Total Copies</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <Eye className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{userAnalytics.unique_designs}</div>
            <div className="text-sm text-gray-600">Unique Designs</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{userAnalytics.authenticated_copies}</div>
            <div className="text-sm text-gray-600">Authenticated</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{userAnalytics.paid_access_copies}</div>
            <div className="text-sm text-gray-600">With Access</div>
          </div>
        </div>

        {/* Top Copied Designs */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Most Copied Designs</h3>
          <div className="space-y-3">
            {topDesigns.map(([designName, count], index) => (
              <div key={designName} className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 truncate">{designName}</div>
                  <div className="text-sm text-gray-600">{count} copies</div>
                </div>
                <div className="w-16 text-right">
                  <div className="bg-blue-100 rounded-full px-2 py-1 text-xs font-semibold text-blue-800">
                    {count}x
                  </div>
                </div>
              </div>
            ))}
            {topDesigns.length === 0 && (
              <div className="text-gray-500 text-center py-4">No design copies yet</div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Copies</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {userAnalytics.recent_copies.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-2 border-b border-gray-100 last:border-b-0">
                <div>
                  <div className="font-medium text-sm text-gray-900 truncate">
                    {activity.design_card_name}
                  </div>
                  <div className="text-xs text-gray-600">
                    {activity.copy_source} • {new Date(activity.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className={`px-2 py-1 rounded text-xs ${activity.user_authenticated ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                  {activity.user_authenticated ? 'Auth' : 'Guest'}
                </div>
              </div>
            ))}
            {userAnalytics.recent_copies.length === 0 && (
              <div className="text-gray-500 text-center py-4">No recent activity</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const GlobalAnalytics = () => {
    if (!globalStats) {
      return (
        <div className="p-6 text-center">
          <p className="text-gray-600">No global analytics available</p>
        </div>
      );
    }

    const topDesigns = Object.entries(globalStats.most_copied_designs)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8);

    const recentDates = Object.entries(globalStats.copies_by_date)
      .sort(([a], [b]) => new Date(b) - new Date(a))
      .slice(0, 7);

    return (
      <div className="space-y-6">
        {/* Global Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <Copy className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{globalStats.total_copies}</div>
            <div className="text-sm text-gray-600">Total Copies</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{globalStats.unique_users}</div>
            <div className="text-sm text-gray-600">Unique Users</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <div className="w-8 h-8 bg-purple-500 rounded mx-auto mb-2"></div>
            <div className="text-2xl font-bold text-gray-900">{globalStats.authenticated_copies}</div>
            <div className="text-sm text-gray-600">Authenticated</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{globalStats.paid_access_copies}</div>
            <div className="text-sm text-gray-600">Paid Access</div>
          </div>
        </div>

        {/* Most Popular Designs */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Popular Designs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topDesigns.map(([designName, count], index) => {
              const percentage = globalStats.total_copies > 0 ? (count / globalStats.total_copies * 100).toFixed(1) : 0;
              return (
                <div key={designName} className="flex items-center space-x-3 p-3 border border-gray-100 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">{designName}</div>
                    <div className="text-sm text-gray-600">{count} copies ({percentage}%)</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity by Date */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-2">
            {recentDates.map(([date, count]) => (
              <div key={date} className="flex items-center justify-between p-2">
                <div className="text-sm font-medium text-gray-900">
                  {new Date(date).toLocaleDateString()}
                </div>
                <div className="flex items-center space-x-2">
                  <div className="bg-blue-100 rounded-full px-2 py-1 text-xs font-semibold text-blue-800">
                    {count} copies
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <BarChart3 className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Prompt Copy Analytics</h1>
        </div>
        
        {/* Tab Switcher */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('user')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'user' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Your Stats
          </button>
          <button
            onClick={() => setActiveTab('global')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'global' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Global Stats
          </button>
        </div>
      </div>

      {activeTab === 'user' ? <UserAnalytics /> : <GlobalAnalytics />}
    </div>
  );
};

export default PromptCopyAnalytics; 