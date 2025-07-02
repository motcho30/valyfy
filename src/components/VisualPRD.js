import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Target, Users, DollarSign, Clock, Star, ArrowRight, CheckCircle, AlertCircle,
         TrendingUp, Zap, Shield, Smartphone, Globe, Code, Layers, Download, Edit3 } from 'lucide-react';

const VisualPRD = ({ project, prdContent, onDownload, onUpdate }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [editingField, setEditingField] = useState(null);
  const [editedContent, setEditedContent] = useState({});
  const [showFullRoadmap, setShowFullRoadmap] = useState(false);

  // Enhanced PRD parsing with better content extraction
  const parsedPRD = useMemo(() => {
    if (!prdContent) return null;

    const sections = {};
    const lines = prdContent.split('\n');
    let currentSection = '';
    let currentContent = [];

    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      // Check for headers
      if (trimmedLine.startsWith('#')) {
        // Save previous section
        if (currentSection && currentContent.length > 0) {
          sections[currentSection] = currentContent.join('\n').trim();
        }
        
        // Start new section with better matching
        const headerText = trimmedLine.replace(/^#+\s*/, '').toLowerCase();
        if (headerText.includes('executive') || headerText.includes('summary') || headerText.includes('overview')) {
          currentSection = 'overview';
        } else if (headerText.includes('objective') || headerText.includes('success') || headerText.includes('metrics')) {
          currentSection = 'objectives';
        } else if (headerText.includes('user') || headerText.includes('persona') || headerText.includes('stories')) {
          currentSection = 'users';
        } else if (headerText.includes('feature') || headerText.includes('functional') || headerText.includes('requirement')) {
          currentSection = 'features';
        } else if (headerText.includes('technical') || headerText.includes('non-functional')) {
          currentSection = 'technical';
        } else if (headerText.includes('roadmap') || headerText.includes('implementation') || headerText.includes('timeline')) {
          currentSection = 'roadmap';
        } else if (headerText.includes('design')) {
          currentSection = 'design';
        } else {
          currentSection = headerText.replace(/[^a-z0-9]/g, '');
        }
        currentContent = [];
      } else if (trimmedLine && currentSection) {
        currentContent.push(line);
      }
    });

    // Save last section
    if (currentSection && currentContent.length > 0) {
      sections[currentSection] = currentContent.join('\n').trim();
    }

    return sections;
  }, [prdContent]);

  // Enhanced key information extraction
  const extractKeyInfo = (content) => {
    if (!content) return {};

    const info = {
      vision: '',
      problem: '',
      solution: '',
      target: '',
      value: '',
      mission: '',
      timeline: '',
      budget: ''
    };
    
    const lines = content.split('\n');
    
    lines.forEach(line => {
      const trimmed = line.trim();
      const cleanText = (text) => text.replace(/^[*-]\s*/, '').replace(/^\w+[:\s]*/, '').trim();
      
      if (trimmed.toLowerCase().includes('vision') && !info.vision) {
        info.vision = cleanText(trimmed);
      }
      if (trimmed.toLowerCase().includes('mission') && !info.mission) {
        info.mission = cleanText(trimmed);
      }
      if (trimmed.toLowerCase().includes('problem') && !info.problem) {
        info.problem = cleanText(trimmed);
      }
      if (trimmed.toLowerCase().includes('solution') && !info.solution) {
        info.solution = cleanText(trimmed);
      }
      if ((trimmed.toLowerCase().includes('target') || trimmed.toLowerCase().includes('audience')) && !info.target) {
        info.target = cleanText(trimmed);
      }
      if ((trimmed.toLowerCase().includes('value') || trimmed.toLowerCase().includes('proposition')) && !info.value) {
        info.value = cleanText(trimmed);
      }
      if ((trimmed.toLowerCase().includes('timeline') || trimmed.toLowerCase().includes('months')) && !info.timeline) {
        info.timeline = cleanText(trimmed);
      }
      if ((trimmed.toLowerCase().includes('budget') || trimmed.toLowerCase().includes('cost')) && !info.budget) {
        info.budget = cleanText(trimmed);
      }
    });

    return info;
  };

  // Enhanced feature extraction with better categorization
  const extractFeatures = (content) => {
    if (!content) return [];
    
    const features = [];
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.match(/^\d+\./) || trimmed.startsWith('•')) {
        const feature = trimmed.replace(/^[-*\d.•]\s*/, '').trim();
        if (feature && feature.length > 10) {
          const text = feature.toLowerCase();
          
          // Determine priority based on keywords
          let priority = 'Could Have';
          let complexity = 'Medium';
          let category = 'Core';
          
          if (text.includes('must') || text.includes('core') || text.includes('essential') || text.includes('critical')) {
            priority = 'Must Have';
          } else if (text.includes('should') || text.includes('important') || text.includes('key')) {
            priority = 'Should Have';
          }
          
          if (text.includes('simple') || text.includes('basic')) complexity = 'Low';
          if (text.includes('complex') || text.includes('advanced') || text.includes('integration')) complexity = 'High';
          
          if (text.includes('user') || text.includes('interface') || text.includes('ux')) category = 'User Experience';
          if (text.includes('auth') || text.includes('login') || text.includes('security')) category = 'Security';
          if (text.includes('api') || text.includes('integration') || text.includes('third-party')) category = 'Integration';
          if (text.includes('admin') || text.includes('management') || text.includes('dashboard')) category = 'Admin';
          
          features.push({
            id: `feature-${index}`,
            name: feature.split(':')[0]?.substring(0, 60) || feature.substring(0, 60),
            description: feature,
            priority,
            complexity,
            category,
            icon: getFeatureIcon(category)
          });
        }
      }
    });

    return features.slice(0, 12); // More features for better visualization
  };
  
  const getFeatureIcon = (category) => {
    const icons = {
      'Core': Zap,
      'User Experience': Users,
      'Security': Shield,
      'Integration': Globe,
      'Admin': Code,
      'default': Star
    };
    return icons[category] || icons.default;
  };

  // Enhanced objectives extraction with metrics and KPIs
  const extractObjectives = (content) => {
    if (!content) return [];
    
    const objectives = [];
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.match(/^\d+\./) || trimmed.startsWith('•')) {
        const objective = trimmed.replace(/^[-*\d.•]\s*/, '').trim();
        if (objective && objective.length > 5) {
          const text = objective.toLowerCase();
          
          // Extract numeric targets if present
          const numberMatch = objective.match(/(\d+[%\w]*)/g);
          const hasTarget = numberMatch && numberMatch.length > 0;
          
          // Determine objective type
          let type = 'Growth';
          let icon = TrendingUp;
          
          if (text.includes('user') || text.includes('customer') || text.includes('acquisition')) {
            type = 'User Growth';
            icon = Users;
          } else if (text.includes('revenue') || text.includes('sales') || text.includes('arr') || text.includes('$')) {
            type = 'Revenue';
            icon = DollarSign;
          } else if (text.includes('time') || text.includes('month') || text.includes('launch')) {
            type = 'Timeline';
            icon = Clock;
          } else if (text.includes('quality') || text.includes('satisfaction') || text.includes('rating')) {
            type = 'Quality';
            icon = Star;
          }
          
          objectives.push({
            id: `objective-${index}`,
            metric: objective.split(':')[0]?.substring(0, 40) || objective.substring(0, 40),
            target: objective,
            type,
            icon,
            hasTarget,
            targetValue: hasTarget ? numberMatch[0] : null
          });
        }
      }
    });

    return objectives.slice(0, 8);
  };
  
  // Extract roadmap phases
  const extractRoadmap = (content) => {
    if (!content) return [];
    
    const phases = [];
    const lines = content.split('\n');
    let currentPhase = null;
    
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      // Check for phase headers
      if (trimmed.toLowerCase().includes('phase') || trimmed.toLowerCase().includes('milestone') || 
          trimmed.match(/^\d+\./)) {
        if (currentPhase) phases.push(currentPhase);
        
        currentPhase = {
          id: `phase-${phases.length}`,
          name: trimmed.replace(/^[-*\d.•]\s*/, '').substring(0, 60),
          items: [],
          duration: extractDuration(trimmed)
        };
      } else if (currentPhase && (trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.startsWith('•'))) {
        const item = trimmed.replace(/^[-*•]\s*/, '').trim();
        if (item) currentPhase.items.push(item);
      }
    });
    
    if (currentPhase) phases.push(currentPhase);
    return phases.slice(0, 6);
  };
  
  const extractDuration = (text) => {
    const durationMatch = text.match(/(\d+)\s*(month|week|day)s?/i);
    return durationMatch ? `${durationMatch[1]} ${durationMatch[2]}${durationMatch[1] > 1 ? 's' : ''}` : '2-3 months';
  };

  const keyInfo = extractKeyInfo(parsedPRD?.overview || '');
  const features = extractFeatures(parsedPRD?.features || '');
  const objectives = extractObjectives(parsedPRD?.objectives || '');
  const roadmap = extractRoadmap(parsedPRD?.roadmap || '');

  const sections = [
    { id: 'overview', name: 'Overview', icon: Target },
    { id: 'objectives', name: 'Objectives', icon: TrendingUp },
    { id: 'features', name: 'Features', icon: Star },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'technical', name: 'Technical', icon: Code },
    { id: 'roadmap', name: 'Roadmap', icon: Clock }
  ];

  const handleEdit = (field, value) => {
    setEditedContent(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (onUpdate && Object.keys(editedContent).length > 0) {
      // Update the text version with edited content
      let updatedPRD = prdContent;
      
      Object.entries(editedContent).forEach(([field, value]) => {
        // Simple replacement logic - in production, this would be more sophisticated
        const fieldRegex = new RegExp(`(${field.charAt(0).toUpperCase() + field.slice(1)}[:\s]*)([^\\n]*)`);
        if (updatedPRD.match(fieldRegex)) {
          updatedPRD = updatedPRD.replace(fieldRegex, `$1${value}`);
        }
      });
      
      onUpdate(updatedPRD);
      setEditedContent({});
      setEditingField(null);
    }
  };

  const EditableField = ({ field, value, multiline = false, className = '' }) => {
    const isEditing = editingField === field;
    const currentValue = editedContent[field] || value || '';

    return (
      <div className="group">
        {isEditing ? (
          <div className="space-y-3">
            {multiline ? (
              <textarea
                value={currentValue}
                onChange={(e) => handleEdit(field, e.target.value)}
                className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent resize-none shadow-sm"
                rows={4}
                autoFocus
              />
            ) : (
              <input
                type="text"
                value={currentValue}
                onChange={(e) => handleEdit(field, e.target.value)}
                className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent shadow-sm"
                autoFocus
              />
            )}
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all text-sm font-medium shadow-sm"
              >
                Save Changes
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setEditingField(null);
                  setEditedContent(prev => {
                    const newContent = { ...prev };
                    delete newContent[field];
                    return newContent;
                  });
                }}
                className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all text-sm font-medium"
              >
                Cancel
              </motion.button>
            </div>
          </div>
        ) : (
          <div 
            onClick={() => setEditingField(field)}
            className="cursor-pointer hover:bg-slate-50 p-3 rounded-lg transition-colors relative group"
          >
            <span className={`${className || 'text-slate-700'} ${!currentValue || currentValue === 'Click to add...' ? 'text-slate-400 italic' : ''}`}>
              {currentValue || 'Click to add...'}
            </span>
            <button className="opacity-0 group-hover:opacity-100 absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-opacity">
              <Edit3 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-8 border border-slate-200"
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">{project.name}</h2>
            <p className="text-slate-600 text-lg">{project.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              ✓ PRD Generated
            </span>
          </div>
        </div>
        
        {/* Vision & Mission */}
        {(keyInfo.vision || keyInfo.mission) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {keyInfo.vision && (
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="flex items-center space-x-2 mb-3">
                  <Target className="w-5 h-5 text-blue-500" />
                  <h3 className="font-semibold text-slate-900">Vision</h3>
                </div>
                <p className="text-slate-700">{keyInfo.vision}</p>
              </div>
            )}
            {keyInfo.mission && (
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="flex items-center space-x-2 mb-3">
                  <Zap className="w-5 h-5 text-purple-500" />
                  <h3 className="font-semibold text-slate-900">Mission</h3>
                </div>
                <p className="text-slate-700">{keyInfo.mission}</p>
              </div>
            )}
          </div>
        )}
      </motion.div>
      
      {/* Problem-Solution Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="font-semibold text-slate-900 text-lg">Problem Statement</h3>
          </div>
          <EditableField 
            field="problem" 
            value={keyInfo.problem || "Define the core problem your product solves"}
            multiline
            className="text-slate-700 leading-relaxed"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-slate-900 text-lg">Our Solution</h3>
          </div>
          <EditableField 
            field="solution" 
            value={keyInfo.solution || "Describe your solution approach"}
            multiline
            className="text-slate-700 leading-relaxed"
          />
        </motion.div>
      </div>
      
      {/* Target Audience & Value Prop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-slate-900 text-lg">Target Audience</h3>
          </div>
          <EditableField 
            field="target" 
            value={keyInfo.target || "Who are your primary users?"}
            multiline
            className="text-slate-700 leading-relaxed"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-slate-900 text-lg">Value Proposition</h3>
          </div>
          <EditableField 
            field="value" 
            value={keyInfo.value || "What unique value do you provide?"}
            multiline
            className="text-slate-700 leading-relaxed"
          />
        </motion.div>
      </div>

      {/* Enhanced Key Metrics Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
      >
        <h3 className="text-xl font-semibold text-slate-900 mb-6">Key Metrics & Targets</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Star className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{features.length}</div>
            <div className="text-sm text-slate-600">Core Features</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{keyInfo.timeline || '6-12'}</div>
            <div className="text-sm text-slate-600">Months to MVP</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <DollarSign className="w-8 h-8 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{keyInfo.budget || '$100K'}</div>
            <div className="text-sm text-slate-600">Target ARR</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-8 h-8 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900">10K+</div>
            <div className="text-sm text-slate-600">Target Users</div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderObjectives = () => (
    <div className="space-y-8">
      {/* Objectives Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200"
      >
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Success Metrics & KPIs</h2>
        </div>
        <p className="text-slate-600">Measurable objectives that define product success</p>
      </motion.div>
      
      {objectives.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {objectives.map((objective, index) => {
            const IconComponent = objective.icon;
            return (
              <motion.div
                key={objective.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    objective.type === 'Revenue' ? 'bg-green-100' :
                    objective.type === 'User Growth' ? 'bg-blue-100' :
                    objective.type === 'Timeline' ? 'bg-orange-100' :
                    objective.type === 'Quality' ? 'bg-purple-100' : 'bg-slate-100'
                  }`}>
                    <IconComponent className={`w-6 h-6 ${
                      objective.type === 'Revenue' ? 'text-green-600' :
                      objective.type === 'User Growth' ? 'text-blue-600' :
                      objective.type === 'Timeline' ? 'text-orange-600' :
                      objective.type === 'Quality' ? 'text-purple-600' : 'text-slate-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-slate-900">{objective.metric}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        objective.type === 'Revenue' ? 'bg-green-100 text-green-700' :
                        objective.type === 'User Growth' ? 'bg-blue-100 text-blue-700' :
                        objective.type === 'Timeline' ? 'bg-orange-100 text-orange-700' :
                        objective.type === 'Quality' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {objective.type}
                      </span>
                    </div>
                    {objective.hasTarget && objective.targetValue && (
                      <div className="text-2xl font-bold text-slate-900 mb-2">
                        {objective.targetValue}
                      </div>
                    )}
                    <EditableField 
                      field={`objective_${index}`} 
                      value={objective.target}
                      className="text-slate-700"
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl p-12 text-center border border-slate-200"
        >
          <TrendingUp className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-600 mb-2">No Objectives Found</h3>
          <p className="text-slate-500">Generate a new PRD to see success metrics and KPIs here.</p>
        </motion.div>
      )}
    </div>
  );

  const renderFeatures = () => {
    // Group features by priority for better visualization
    const featuresByPriority = features.reduce((acc, feature) => {
      if (!acc[feature.priority]) acc[feature.priority] = [];
      acc[feature.priority].push(feature);
      return acc;
    }, {});
    
    const priorityOrder = ['Must Have', 'Should Have', 'Could Have'];
    const priorityColors = {
      'Must Have': { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', badge: 'bg-red-100' },
      'Should Have': { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', badge: 'bg-orange-100' },
      'Could Have': { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', badge: 'bg-blue-100' }
    };
    
    return (
      <div className="space-y-8">
        {/* Features Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Feature Roadmap</h2>
              </div>
              <p className="text-slate-600">Prioritized feature set using MoSCoW method</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">{features.length}</div>
              <div className="text-sm text-slate-600">Total Features</div>
            </div>
          </div>
        </motion.div>
        
        {features.length > 0 ? (
          <div className="space-y-8">
            {/* Priority Matrix */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Feature Priority Distribution</h3>
              <div className="flex space-x-4">
                {priorityOrder.map(priority => {
                  const count = featuresByPriority[priority]?.length || 0;
                  const colors = priorityColors[priority];
                  return (
                    <div key={priority} className="flex-1 text-center">
                      <div className={`${colors.bg} ${colors.border} border rounded-lg p-4`}>
                        <div className={`text-2xl font-bold ${colors.text}`}>{count}</div>
                        <div className="text-sm text-slate-600">{priority}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
            
            {/* Features by Priority */}
            {priorityOrder.map((priority, priorityIndex) => {
              const priorityFeatures = featuresByPriority[priority] || [];
              if (priorityFeatures.length === 0) return null;
              
              const colors = priorityColors[priority];
              
              return (
                <motion.div
                  key={priority}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: priorityIndex * 0.1 }}
                  className="space-y-4"
                >
                  <div className={`${colors.bg} ${colors.border} border rounded-xl p-4`}>
                    <h3 className={`text-lg font-semibold ${colors.text} mb-1`}>{priority} Features</h3>
                    <p className="text-sm text-slate-600">
                      {priority === 'Must Have' ? 'Critical features required for MVP launch' :
                       priority === 'Should Have' ? 'Important features for competitive advantage' :
                       'Nice-to-have features for future iterations'}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {priorityFeatures.map((feature, index) => {
                      const IconComponent = feature.icon;
                      return (
                        <motion.div
                          key={feature.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (priorityIndex * 0.1) + (index * 0.05) }}
                          className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start space-x-4">
                            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <IconComponent className="w-5 h-5 text-slate-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-3">
                                <h4 className="font-semibold text-slate-900 text-sm">{feature.name}</h4>
                                <div className="flex space-x-1 ml-2">
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${colors.badge} ${colors.text}`}>
                                    {feature.priority}
                                  </span>
                                  <span className="px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-700">
                                    {feature.complexity}
                                  </span>
                                </div>
                              </div>
                              <div className="mb-3">
                                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                  {feature.category}
                                </span>
                              </div>
                              <EditableField 
                                field={`feature_${feature.id}`} 
                                value={feature.description}
                                multiline
                                className="text-sm text-slate-700"
                              />
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl p-12 text-center border border-slate-200"
          >
            <Star className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No Features Found</h3>
            <p className="text-slate-500">Generate a new PRD to see feature breakdown here.</p>
          </motion.div>
        )}
      </div>
    );
  };

  const renderTechnical = () => {
    // Parse tech stack from content
    const extractTechStack = (content) => {
      if (!content) return { frontend: [], backend: [], infrastructure: [], mobile: [] };
      
      const stack = { frontend: [], backend: [], infrastructure: [], mobile: [] };
      const lines = content.toLowerCase().split('\n');
      
      lines.forEach(line => {
        if (line.includes('react') || line.includes('vue') || line.includes('angular')) {
          if (!stack.frontend.find(item => item.includes('Framework'))) {
            stack.frontend.push(line.includes('react') ? 'React/Next.js' : 
                               line.includes('vue') ? 'Vue.js' : 'Angular');
          }
        }
        if (line.includes('typescript') || line.includes('javascript')) {
          stack.frontend.push('TypeScript');
        }
        if (line.includes('tailwind') || line.includes('css')) {
          stack.frontend.push('Tailwind CSS');
        }
        if (line.includes('node') || line.includes('express')) {
          stack.backend.push('Node.js/Express');
        }
        if (line.includes('python') || line.includes('django') || line.includes('fastapi')) {
          stack.backend.push('Python/FastAPI');
        }
        if (line.includes('postgresql') || line.includes('postgres')) {
          stack.backend.push('PostgreSQL');
        }
        if (line.includes('mongodb')) {
          stack.backend.push('MongoDB');
        }
        if (line.includes('aws') || line.includes('amazon')) {
          stack.infrastructure.push('AWS');
        }
        if (line.includes('vercel') || line.includes('netlify')) {
          stack.infrastructure.push('Vercel');
        }
        if (line.includes('docker')) {
          stack.infrastructure.push('Docker');
        }
        if (line.includes('react native') || line.includes('flutter')) {
          stack.mobile.push(line.includes('react native') ? 'React Native' : 'Flutter');
        }
      });
      
      // Add defaults if empty
      if (stack.frontend.length === 0) stack.frontend = ['React/Next.js', 'TypeScript', 'Tailwind CSS'];
      if (stack.backend.length === 0) stack.backend = ['Node.js/Express', 'PostgreSQL'];
      if (stack.infrastructure.length === 0) stack.infrastructure = ['Vercel', 'Docker'];
      
      return stack;
    };
    
    const techStack = extractTechStack(parsedPRD?.technical || '');
    
    return (
      <div className="space-y-8">
        {/* Technical Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-6 border border-slate-200"
        >
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
              <Code className="w-6 h-6 text-slate-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Technical Architecture</h2>
          </div>
          <p className="text-slate-600">Technology stack and implementation requirements</p>
        </motion.div>
        
        {parsedPRD?.technical ? (
          <div className="space-y-8">
            {/* Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Technical Overview</h3>
              <EditableField 
                field="technical_overview" 
                value={parsedPRD.technical.split('\n').slice(0, 5).join('\n')}
                multiline
                className="text-slate-700 leading-relaxed"
              />
            </motion.div>
            
            {/* Technology Stack Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Frontend */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Layers className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900">Frontend</h4>
                </div>
                <div className="space-y-3">
                  {techStack.frontend.map((tech, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-slate-700">{tech}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
              
              {/* Backend */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Code className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900">Backend</h4>
                </div>
                <div className="space-y-3">
                  {techStack.backend.map((tech, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-slate-700">{tech}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
              
              {/* Infrastructure */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Globe className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900">Infrastructure</h4>
                </div>
                <div className="space-y-3">
                  {techStack.infrastructure.map((tech, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-slate-700">{tech}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
              
              {/* Mobile (if applicable) */}
              {techStack.mobile.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Smartphone className="w-6 h-6 text-orange-600" />
                    </div>
                    <h4 className="font-semibold text-slate-900">Mobile</h4>
                  </div>
                  <div className="space-y-3">
                    {techStack.mobile.map((tech, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-slate-700">{tech}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
            
            {/* Technical Requirements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-6">Key Requirements</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-6 h-6 text-red-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Security</h4>
                  <p className="text-sm text-slate-600">Authentication, authorization, data encryption</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-6 h-6 text-yellow-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Performance</h4>
                  <p className="text-sm text-slate-600">Fast loading, scalability, optimization</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Accessibility</h4>
                  <p className="text-sm text-slate-600">WCAG compliance, inclusive design</p>
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl p-12 text-center border border-slate-200"
          >
            <Code className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No Technical Requirements Found</h3>
            <p className="text-slate-500">Generate a new PRD to see technical architecture details here.</p>
          </motion.div>
        )}
      </div>
    );
  };

  // Render Users section
  const renderUsers = () => {
    const extractUserPersonas = (content) => {
      if (!content) return [];
      
      const personas = [];
      const lines = content.split('\n');
      let currentPersona = null;
      
      lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.includes('persona') || trimmed.includes('user') || trimmed.includes('audience')) {
          if (trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.match(/^\d+\./)) {
            if (currentPersona) personas.push(currentPersona);
            currentPersona = {
              name: trimmed.replace(/^[-*\d.]\s*/, '').substring(0, 50),
              description: '',
              demographics: [],
              goals: [],
              painPoints: []
            };
          }
        } else if (currentPersona && trimmed.startsWith('-')) {
          const item = trimmed.replace(/^[-*]\s*/, '');
          if (item.toLowerCase().includes('age') || item.toLowerCase().includes('demographic')) {
            currentPersona.demographics.push(item);
          } else if (item.toLowerCase().includes('goal') || item.toLowerCase().includes('want')) {
            currentPersona.goals.push(item);
          } else if (item.toLowerCase().includes('pain') || item.toLowerCase().includes('problem')) {
            currentPersona.painPoints.push(item);
          }
        }
      });
      
      if (currentPersona) personas.push(currentPersona);
      return personas.slice(0, 4);
    };
    
    const personas = extractUserPersonas(parsedPRD?.users || '');
    
    return (
      <div className="space-y-8">
        {/* Users Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200"
        >
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">User Personas & Stories</h2>
          </div>
          <p className="text-slate-600">Target audience analysis and user journey mapping</p>
        </motion.div>
        
        {personas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {personas.map((persona, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-lg font-semibold text-slate-700">
                      {persona.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="font-semibold text-slate-900">{persona.name}</h3>
                </div>
                
                <EditableField 
                  field={`persona_${index}`} 
                  value={persona.description || 'User persona description...'}
                  multiline
                  className="text-slate-700 mb-4"
                />
                
                {persona.goals.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-slate-900">Goals</h4>
                    {persona.goals.map((goal, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <Target className="w-3 h-3 text-green-500" />
                        <span className="text-sm text-slate-600">{goal}</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl p-12 text-center border border-slate-200"
          >
            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No User Personas Found</h3>
            <p className="text-slate-500">Generate a new PRD to see user analysis here.</p>
          </motion.div>
        )}
      </div>
    );
  };
  
  // Render Roadmap section
  const renderRoadmap = () => (
    <div className="space-y-8">
      {/* Roadmap Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Implementation Roadmap</h2>
            </div>
            <p className="text-slate-600">Development phases and timeline</p>
          </div>
          <button
            onClick={() => setShowFullRoadmap(!showFullRoadmap)}
            className="flex items-center space-x-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
          >
            <span>{showFullRoadmap ? 'Show Less' : 'Show Full Timeline'}</span>
            <ArrowRight className={`w-4 h-4 transition-transform ${showFullRoadmap ? 'rotate-90' : ''}`} />
          </button>
        </div>
      </motion.div>
      
      {roadmap.length > 0 ? (
        <div className="space-y-6">
          {roadmap.slice(0, showFullRoadmap ? roadmap.length : 3).map((phase, index) => (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Timeline connector */}
              {index < roadmap.length - 1 && (
                <div className="absolute left-6 top-16 w-0.5 h-16 bg-slate-200"></div>
              )}
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-orange-600">{index + 1}</span>
                </div>
                <div className="flex-1 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900">{phase.name}</h3>
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                      {phase.duration}
                    </span>
                  </div>
                  
                  {phase.items.length > 0 && (
                    <div className="space-y-2">
                      {phase.items.map((item, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-slate-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl p-12 text-center border border-slate-200"
        >
          <Clock className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-600 mb-2">No Roadmap Found</h3>
          <p className="text-slate-500">Generate a new PRD to see implementation timeline here.</p>
        </motion.div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'overview': return renderOverview();
      case 'objectives': return renderObjectives();
      case 'features': return renderFeatures();
      case 'users': return renderUsers();
      case 'technical': return renderTechnical();
      case 'roadmap': return renderRoadmap();
      default: return renderOverview();
    }
  };

  if (!prdContent) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-lg max-w-2xl mx-auto"
        >
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Target className="w-12 h-12 text-slate-400" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-4">PRD Not Generated Yet</h3>
          <p className="text-slate-600 text-lg leading-relaxed">
            Generate your Product Requirements Document to see the visual breakdown with modern, 
            interactive components that bring your project requirements to life.
          </p>
          <div className="flex items-center justify-center space-x-6 mt-8 text-sm text-slate-500">
            <span className="flex items-center space-x-2">
              <Star className="w-4 h-4" />
              <span>Visual Components</span>
            </span>
            <span className="flex items-center space-x-2">
              <Edit3 className="w-4 h-4" />
              <span>Fully Editable</span>
            </span>
            <span className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export Ready</span>
            </span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Product Requirements Document</h1>
            <p className="text-lg text-slate-600">Visual breakdown of {project.name} requirements</p>
            <div className="flex items-center space-x-4 mt-3">
              <span className="flex items-center space-x-2 text-sm text-slate-500">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Generated with AI</span>
              </span>
              <span className="flex items-center space-x-2 text-sm text-slate-500">
                <Edit3 className="w-4 h-4" />
                <span>Fully Editable</span>
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onDownload}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-slate-800 to-slate-700 text-white rounded-xl hover:from-slate-700 hover:to-slate-600 transition-all shadow-lg"
            >
              <Download className="w-5 h-5" />
              <span>Download PRD</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Enhanced Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-sm">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {sections.map((section) => {
                const IconComponent = section.icon;
                return (
                  <motion.button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex flex-col items-center space-y-2 p-4 rounded-xl font-medium transition-all ${
                      activeSection === section.id
                        ? 'bg-slate-900 text-white shadow-lg'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="text-sm">{section.name}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {renderContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default VisualPRD; 