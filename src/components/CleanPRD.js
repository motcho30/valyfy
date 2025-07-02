import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Edit3, Download, Save, X } from 'lucide-react';

const CleanPRD = ({ project, prdContent, onDownload, onUpdate }) => {
  const [editingSection, setEditingSection] = useState(null);
  const [editedContent, setEditedContent] = useState({});

  // Parse the PRD content into clean sections
  const parsedSections = useMemo(() => {
    if (!prdContent) return [];

    const sections = [];
    const lines = prdContent.split('\n');
    let currentSection = null;
    let currentContent = [];

    lines.forEach(line => {
      const trimmed = line.trim();
      
      // Check for main headers (# or ##)
      if (trimmed.match(/^#{1,2}\s+/)) {
        // Save previous section
        if (currentSection && currentContent.length > 0) {
          sections.push({
            ...currentSection,
            content: currentContent.join('\n').trim()
          });
        }
        
        // Start new section
        const title = trimmed.replace(/^#+\s*/, '');
        currentSection = {
          id: title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          title: title,
          type: getSectonType(title)
        };
        currentContent = [];
      } else if (trimmed && currentSection) {
        currentContent.push(line);
      }
    });

    // Save last section
    if (currentSection && currentContent.length > 0) {
      sections.push({
        ...currentSection,
        content: currentContent.join('\n').trim()
      });
    }

    return sections;
  }, [prdContent]);

  // Determine section type for styling
  function getSectonType(title) {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('executive') || titleLower.includes('summary')) return 'summary';
    if (titleLower.includes('objective') || titleLower.includes('success')) return 'objectives';
    if (titleLower.includes('user') || titleLower.includes('persona')) return 'users';
    if (titleLower.includes('feature') || titleLower.includes('functional')) return 'features';
    if (titleLower.includes('technical')) return 'technical';
    if (titleLower.includes('roadmap') || titleLower.includes('timeline')) return 'roadmap';
    return 'general';
  }

  // Get color scheme for section type
  function getSectionColors(type) {
    const colors = {
      summary: 'border-blue-200 bg-blue-50',
      objectives: 'border-green-200 bg-green-50',
      users: 'border-purple-200 bg-purple-50',
      features: 'border-orange-200 bg-orange-50',
      technical: 'border-gray-200 bg-gray-50',
      roadmap: 'border-indigo-200 bg-indigo-50',
      general: 'border-slate-200 bg-slate-50'
    };
    return colors[type] || colors.general;
  }

  // Handle editing
  const startEditing = (sectionId, content) => {
    setEditingSection(sectionId);
    setEditedContent({ [sectionId]: content });
  };

  const saveEdit = () => {
    if (onUpdate && editingSection && editedContent[editingSection]) {
      // Create updated PRD content
      let updatedPRD = prdContent;
      
      // Find and replace the section content
      const section = parsedSections.find(s => s.id === editingSection);
      if (section) {
        const oldContent = section.content;
        const newContent = editedContent[editingSection];
        updatedPRD = updatedPRD.replace(oldContent, newContent);
      }
      
      onUpdate(updatedPRD);
    }
    setEditingSection(null);
    setEditedContent({});
  };

  const cancelEdit = () => {
    setEditingSection(null);
    setEditedContent({});
  };

  // Extract key information from content for visualization
  const extractContentData = (content, sectionType) => {
    const lines = content.split('\n').filter(line => line.trim());
    
    switch (sectionType) {
      case 'summary':
        return extractSummaryData(lines);
      case 'objectives':
        return extractObjectivesData(lines);
      case 'users':
        return extractUsersData(lines);
      case 'features':
        return extractFeaturesData(lines);
      case 'technical':
        return extractTechnicalData(lines);
      case 'roadmap':
        return extractRoadmapData(lines);
      default:
        return extractGeneralData(lines);
    }
  };

  // Extract summary key points and metrics
  const extractSummaryData = (lines) => {
    const keyPoints = [];
    const metrics = [];
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.match(/^\*\s+|^-\s+|^\d+\.\s+/)) {
        keyPoints.push(trimmed.replace(/^\*\s+|^-\s+|^\d+\.\s+/, ''));
      }
      // Look for numbers/percentages that could be metrics
      const metricMatch = trimmed.match(/(\d+%|\$\d+|\d+\s+(users|days|months|features))/gi);
      if (metricMatch) {
        metricMatch.forEach(metric => metrics.push(metric));
      }
    });
    
    return { keyPoints: keyPoints.slice(0, 4), metrics: metrics.slice(0, 3), rawContent: lines.join('\n') };
  };

  // Extract objectives and success criteria
  const extractObjectivesData = (lines) => {
    const objectives = [];
    const successCriteria = [];
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.match(/^\*\s+|^-\s+|^\d+\.\s+/)) {
        const cleaned = trimmed.replace(/^\*\s+|^-\s+|^\d+\.\s+/, '');
        if (cleaned.toLowerCase().includes('success') || cleaned.toLowerCase().includes('criteria') || cleaned.toLowerCase().includes('kpi')) {
          successCriteria.push(cleaned);
        } else {
          objectives.push(cleaned);
        }
      }
    });
    
    return { objectives: objectives.slice(0, 4), successCriteria: successCriteria.slice(0, 3), rawContent: lines.join('\n') };
  };

  // Extract user personas and segments
  const extractUsersData = (lines) => {
    const personas = [];
    const segments = [];
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.match(/^\*\s+|^-\s+|^\d+\.\s+/)) {
        const cleaned = trimmed.replace(/^\*\s+|^-\s+|^\d+\.\s+/, '');
        if (cleaned.length < 100) { // Short items are likely personas/segments
          personas.push(cleaned);
        }
      }
    });
    
    return { personas: personas.slice(0, 4), segments: segments, rawContent: lines.join('\n') };
  };

  // Extract features as individual items
  const extractFeaturesData = (lines) => {
    const features = [];
    const priorities = { high: [], medium: [], low: [] };
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.match(/^\*\s+|^-\s+|^\d+\.\s+/)) {
        const cleaned = trimmed.replace(/^\*\s+|^-\s+|^\d+\.\s+/, '');
        features.push(cleaned);
        
        // Categorize by priority keywords
        const lower = cleaned.toLowerCase();
        if (lower.includes('critical') || lower.includes('essential') || lower.includes('core')) {
          priorities.high.push(cleaned);
        } else if (lower.includes('nice') || lower.includes('optional') || lower.includes('enhancement')) {
          priorities.low.push(cleaned);
        } else {
          priorities.medium.push(cleaned);
        }
      }
    });
    
    return { features: features.slice(0, 6), priorities, rawContent: lines.join('\n') };
  };

  // Extract technical requirements and architecture
  const extractTechnicalData = (lines) => {
    const technologies = [];
    const requirements = [];
    const architecture = [];
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.match(/^\*\s+|^-\s+|^\d+\.\s+/)) {
        const cleaned = trimmed.replace(/^\*\s+|^-\s+|^\d+\.\s+/, '');
        const lower = cleaned.toLowerCase();
        
        if (lower.includes('react') || lower.includes('node') || lower.includes('database') || 
            lower.includes('api') || lower.includes('framework') || lower.includes('library')) {
          technologies.push(cleaned);
        } else if (lower.includes('architecture') || lower.includes('structure') || lower.includes('design')) {
          architecture.push(cleaned);
        } else {
          requirements.push(cleaned);
        }
      }
    });
    
    return { technologies: technologies.slice(0, 4), requirements: requirements.slice(0, 4), architecture: architecture.slice(0, 3), rawContent: lines.join('\n') };
  };

  // Extract roadmap milestones and timeline
  const extractRoadmapData = (lines) => {
    const milestones = [];
    const phases = [];
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.match(/^\*\s+|^-\s+|^\d+\.\s+/)) {
        const cleaned = trimmed.replace(/^\*\s+|^-\s+|^\d+\.\s+/, '');
        const lower = cleaned.toLowerCase();
        
        if (lower.includes('phase') || lower.includes('stage') || lower.includes('sprint')) {
          phases.push(cleaned);
        } else {
          milestones.push(cleaned);
        }
      }
    });
    
    return { milestones: milestones.slice(0, 4), phases: phases.slice(0, 3), rawContent: lines.join('\n') };
  };

  // Extract general content
  const extractGeneralData = (lines) => {
    const bulletPoints = [];
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.match(/^\*\s+|^-\s+|^\d+\.\s+/)) {
        bulletPoints.push(trimmed.replace(/^\*\s+|^-\s+|^\d+\.\s+/, ''));
      }
    });
    
    return { bulletPoints: bulletPoints.slice(0, 5), rawContent: lines.join('\n') };
  };

  // Render visual components for different section types
  const renderSectionVisuals = (sectionType, data) => {
    switch (sectionType) {
      case 'summary':
        return renderSummaryVisuals(data);
      case 'objectives':
        return renderObjectivesVisuals(data);
      case 'users':
        return renderUsersVisuals(data);
      case 'features':
        return renderFeaturesVisuals(data);
      case 'technical':
        return renderTechnicalVisuals(data);
      case 'roadmap':
        return renderRoadmapVisuals(data);
      default:
        return renderGeneralVisuals(data);
    }
  };

  // Summary section with key points and metrics
  const renderSummaryVisuals = (data) => (
    <div className="space-y-6">
      {data.metrics.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">Key Metrics</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.metrics.map((metric, index) => (
              <div key={index} className="bg-slate-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-slate-900">{metric}</div>
                <div className="text-xs text-slate-500 mt-1">Target</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {data.keyPoints.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">Key Points</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.keyPoints.map((point, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm text-slate-700 leading-relaxed">{point}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Objectives section with goals and success criteria
  const renderObjectivesVisuals = (data) => (
    <div className="space-y-6">
      {data.objectives.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">Primary Objectives</h4>
          <div className="space-y-3">
            {data.objectives.map((objective, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 border border-slate-200 rounded-lg bg-green-50">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-800 leading-relaxed">{objective}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {data.successCriteria.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">Success Criteria</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.successCriteria.map((criteria, index) => (
              <div key={index} className="p-3 border border-green-200 rounded-lg bg-green-50">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-xs font-medium text-green-700 uppercase">KPI</span>
                </div>
                <p className="text-sm text-slate-700">{criteria}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Users section with persona cards
  const renderUsersVisuals = (data) => (
    <div className="space-y-6">
      {data.personas.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">User Personas</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.personas.map((persona, index) => (
              <div key={index} className="p-4 border border-purple-200 rounded-lg bg-purple-50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {persona.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">{persona}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Features section with feature cards and priorities
  const renderFeaturesVisuals = (data) => (
    <div className="space-y-6">
      {data.features.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">Feature Overview</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.features.map((feature, index) => {
              const priority = data.priorities.high.includes(feature) ? 'high' :
                             data.priorities.low.includes(feature) ? 'low' : 'medium';
              const priorityColors = {
                high: 'border-red-200 bg-red-50 text-red-700',
                medium: 'border-orange-200 bg-orange-50 text-orange-700',
                low: 'border-slate-200 bg-slate-50 text-slate-600'
              };
              
              return (
                <div key={index} className={`p-4 border rounded-lg ${priorityColors[priority]}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      priority === 'high' ? 'bg-red-100 text-red-600' :
                      priority === 'medium' ? 'bg-orange-100 text-orange-600' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {priority.toUpperCase()}
                    </div>
                  </div>
                  <p className="text-sm font-medium">{feature}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  // Technical section with tech stack and requirements
  const renderTechnicalVisuals = (data) => (
    <div className="space-y-6">
      {data.technologies.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">Technology Stack</h4>
          <div className="flex flex-wrap gap-2">
            {data.technologies.map((tech, index) => (
              <span key={index} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {data.requirements.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">Technical Requirements</h4>
          <div className="space-y-2">
            {data.requirements.map((req, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                <div className="w-5 h-5 border-2 border-slate-400 rounded mt-0.5"></div>
                <span className="text-sm text-slate-700">{req}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {data.architecture.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">Architecture</h4>
          <div className="space-y-3">
            {data.architecture.map((arch, index) => (
              <div key={index} className="p-3 border border-slate-200 rounded-lg bg-slate-50">
                <p className="text-sm text-slate-700">{arch}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Roadmap section with timeline
  const renderRoadmapVisuals = (data) => (
    <div className="space-y-6">
      {data.phases.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">Development Phases</h4>
          <div className="space-y-3">
            {data.phases.map((phase, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 border border-indigo-200 rounded-lg bg-indigo-50">
                <div className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">{phase}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {data.milestones.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">Key Milestones</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.milestones.map((milestone, index) => (
              <div key={index} className="p-3 border border-indigo-200 rounded-lg bg-indigo-50">
                <div className="flex items-start space-x-2">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full mt-1"></div>
                  <p className="text-sm text-slate-700">{milestone}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // General section with bullet points
  const renderGeneralVisuals = (data) => (
    <div className="space-y-3">
      {data.bulletPoints.map((point, index) => (
        <div key={index} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
          <div className="w-2 h-2 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
          <span className="text-sm text-slate-700 leading-relaxed">{point}</span>
        </div>
      ))}
    </div>
  );

  if (!prdContent) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Edit3 className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-600 mb-2">No PRD Generated</h3>
          <p className="text-slate-500">Generate a PRD to see the content here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Product Requirements</h1>
            <p className="text-slate-600">{project.name}</p>
          </div>
          <div className="flex items-center space-x-3">
            {editingSection ? (
              <>
                <button
                  onClick={saveEdit}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
                <button
                  onClick={cancelEdit}
                  className="flex items-center space-x-2 px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </>
            ) : (
              <button
                onClick={onDownload}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            )}
          </div>
        </motion.div>

        {/* Content Sections */}
        <div className="space-y-6">
          {parsedSections.map((section, index) => {
            const isEditing = editingSection === section.id;
            const sectionData = extractContentData(section.content, section.type);

            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-xl border-2 ${getSectionColors(section.type)} p-6 group`}
              >
                <div className="flex items-start justify-between mb-6">
                  <h2 className="text-xl font-semibold text-slate-900">{section.title}</h2>
                  {!editingSection && (
                    <button
                      onClick={() => startEditing(section.id, section.content)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white rounded-lg"
                    >
                      <Edit3 className="w-4 h-4 text-slate-500" />
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <textarea
                      value={editedContent[section.id] || ''}
                      onChange={(e) => setEditedContent({ ...editedContent, [section.id]: e.target.value })}
                      className="w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent resize-none font-mono text-sm"
                      rows={Math.max(6, section.content.split('\n').length)}
                      autoFocus
                    />
                  </div>
                ) : (
                  <div>
                    {renderSectionVisuals(section.type, sectionData)}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Empty state if no sections */}
        {parsedSections.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Edit3 className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No Content Found</h3>
            <p className="text-slate-500">The PRD content couldn't be parsed. Try regenerating the PRD.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CleanPRD;