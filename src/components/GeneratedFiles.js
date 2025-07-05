import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Download, FileText, Code, BookOpen, Calendar, Search } from 'lucide-react';

const GeneratedFiles = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  // Mock data - in a real app this would come from a database
  const generatedFiles = [
    {
      id: 1,
      name: 'ecommerce-prd-v1.md',
      type: 'PRD Document',
      icon: <FileText className="w-4 h-4" />,
      date: '2024-01-14',
      size: '15.7 KB',
      description: 'Product requirements for e-commerce platform'
    },
    {
      id: 2,
      name: 'feature-analysis-report.md',
      type: 'Analysis Report',
      icon: <BookOpen className="w-4 h-4" />,
      date: '2024-01-13',
      size: '8.9 KB',
      description: 'Codebase feature extraction and analysis'
    }
  ];

  const filteredFiles = generatedFiles.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = (file) => {
    // Mock download - in a real app this would trigger actual file download
    const blob = new Blob([`Generated ${file.type}: ${file.name}\n\nDescription: ${file.description}`], 
      { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Sidebar - Same as Dashboard */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6">
          <h1 className="font-jersey text-2xl text-black">VALYFY</h1>
        </div>

        <nav className="flex-1 px-4">
          <div className="space-y-1">
            <button
              onClick={onClose}
              className="w-full px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg flex items-center space-x-3 text-left transition-colors"
            >
              <span className="text-sm">← Back to Dashboard</span>
            </button>

            <button
              onClick={() => window.dispatchEvent(new CustomEvent('navigate-files-guidance'))}
              className="w-full px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg flex items-center space-x-3 text-left transition-colors"
            >
              <span className="text-sm">📖 How to use these files</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Files</h1>
              <p className="mt-1 text-sm text-gray-600">
                Order by: Most recent
              </p>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            {/* Search and Controls */}
            <div className="mb-8 flex items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="ml-4 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="recent">Most recent</option>
                <option value="name">Name</option>
                <option value="type">Type</option>
                <option value="size">Size</option>
              </select>
            </div>

            {/* Files Grid */}
            {filteredFiles.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? 'No files found' : 'No generated files yet'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm ? 'Try a different search term' : 'Start generating some files to see them here'}
                </p>
                
                {!searchTerm && (
                  <button
                    onClick={onClose}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Create Your First File
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredFiles.map((file) => (
                  <motion.div
                    key={file.id}
                    whileHover={{ backgroundColor: '#f9fafb' }}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1 min-w-0">
                        {/* File Icon */}
                        <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-600">
                          {file.icon}
                        </div>
                        
                        {/* File Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium text-gray-900 truncate">{file.name}</h3>
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              {file.type}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 truncate">{file.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{file.date}</span>
                            </span>
                            <span>{file.size}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDownload(file)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Download file"
                        >
                          <Download className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratedFiles; 