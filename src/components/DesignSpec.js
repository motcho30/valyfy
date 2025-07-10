import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Download, Edit3, Save, X, Palette, Type, Layout, Eye, Package, FileText } from 'lucide-react';
import { getUIComponentsForDesign, generateInstallationInstructions, generateComponentExamples } from '../services/uiComponentsService';
import { downloadDesignSpec } from '../services/designSpecService';

const DesignSpec = ({ project, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDesign, setEditedDesign] = useState(null);

  // Get design data based on project's selected design
  const getDesignData = (designId) => {
    const designs = {
      'minimalistic': {
        id: 'minimalistic',
        name: 'Minimalistic/Modern',
        image: '/minimlistic.png',
        description: 'Clean, uncluttered, content-focused',
        theme: 'light',
        colors: {
          background: { hex: '#F9FAFB', name: 'Background', description: 'Light gray background' },
          foreground: { hex: '#FFFFFF', name: 'Foreground', description: 'Pure white cards' },
          primaryText: { hex: '#111827', name: 'Primary Text', description: 'Dark charcoal' },
          secondaryText: { hex: '#6B7280', name: 'Secondary Text', description: 'Medium gray' },
          borders: { hex: '#E5E7EB', name: 'Borders', description: 'Light gray borders' },
          accent: { hex: '#10B981', name: 'Primary Accent', description: 'Vibrant green for CTAs' }
        },
        typography: {
          primary: 'Inter',
          secondary: 'Inter',
          headings: {
            h1: { size: '48px', weight: '700', spacing: '-0.025em' },
            h2: { size: '36px', weight: '600', spacing: '-0.025em' },
            h3: { size: '24px', weight: '500', spacing: '0' }
          },
          body: { size: '16px', weight: '400', lineHeight: '1.7' }
        },
        spacing: {
          baseUnit: '8px',
          sections: '64px',
          cards: '24px',
          buttons: '12px 24px'
        },
        components: {
          borderRadius: '8px',
          shadows: 'subtle layered shadows',
          buttons: 'rounded-lg with generous padding',
          cards: 'rounded-xl with 1px borders'
        }
      },
      'tech-dark': {
        id: 'tech-dark',
        name: 'Tech Dark Mode',
        image: '/darkmode.png',
        description: 'Premium dark-mode tech aesthetic',
        theme: 'dark',
        colors: {
          background: { hex: '#000000', name: 'Background', description: 'Pure black' },
          surface: { hex: '#111116', name: 'Surface', description: 'Slightly lighter black' },
          primaryText: { hex: '#FFFFFF', name: 'Text Primary', description: 'Pure white' },
          secondaryText: { hex: '#888888', name: 'Text Secondary', description: 'Muted gray' },
          accent: { hex: '#5865F2', name: 'Electric Blue', description: 'Primary accent' },
          gradient1: { hex: '#8B5CF6', name: 'Purple', description: 'Gradient accent' },
          gradient2: { hex: '#FF6B35', name: 'Orange', description: 'Orange glow' },
          borders: { hex: '#222228', name: 'Borders', description: 'Subtle border' }
        },
        typography: {
          primary: 'Space Grotesk',
          secondary: 'Inter',
          headings: {
            h1: { size: '72px', weight: '600', spacing: '0.02em' },
            h2: { size: '48px', weight: '600', spacing: '0.02em' },
            h3: { size: '32px', weight: '500', spacing: '0' }
          },
          body: { size: '16px', weight: '400', lineHeight: '1.7' }
        },
        spacing: {
          baseUnit: '8px',
          sections: '128px',
          cards: '32px',
          buttons: '16px 32px'
        },
        components: {
          borderRadius: '12px',
          shadows: 'glow effects and blur',
          buttons: 'gradient backgrounds with glow',
          cards: 'floating with backdrop blur'
        }
      }
    };
    
    return designs[designId] || designs['minimalistic'];
  };

  // Use the actual selectedDesign object from the project if available and valid
  const getEffectiveDesignData = () => {
    if (project?.selectedDesign && typeof project.selectedDesign === 'object') {
      // Handle custom designs
      if (project.selectedDesign.isCustom) {
        return {
          ...project.selectedDesign,
          // Ensure we have all required properties for custom designs
          colors: project.selectedDesign.analysis?.colors || project.selectedDesign.colors || {},
          typography: project.selectedDesign.analysis?.typography || { 
            primary: 'Inter', 
            secondary: 'Inter',
            headings: {
              h1: { size: '48px', weight: '700', spacing: '-0.025em' },
              h2: { size: '36px', weight: '600', spacing: '-0.025em' },
              h3: { size: '24px', weight: '500', spacing: '0' }
            },
            body: { size: '16px', weight: '400', lineHeight: '1.7' }
          },
          spacing: project.selectedDesign.analysis?.spacing || {
            baseUnit: '8px',
            sections: '64px',
            cards: '24px',
            buttons: '12px 24px'
          },
          components: project.selectedDesign.analysis?.components || {
            borderRadius: '8px',
            shadows: 'subtle layered shadows',
            buttons: 'rounded-lg with generous padding',
            cards: 'rounded-xl with 1px borders'
          },
          theme: 'custom'
        };
      }
      // Handle standard designs with colors object
      if (project.selectedDesign.colors && Object.keys(project.selectedDesign.colors).length > 0) {
        return project.selectedDesign;
      }
    }
    // fallback to static lookup if not present or incomplete
    const designId = project?.designId || 'minimalistic';
    return getDesignData(designId);
  };

  const [designData, setDesignData] = useState(() => getEffectiveDesignData());

  useEffect(() => {
    setDesignData(getEffectiveDesignData());
  }, [project]);

  useEffect(() => {
    if (editedDesign) {
      setDesignData(editedDesign);
    }
  }, [editedDesign]);

  // Defensive: If designData or its colors are missing, show error
  if (!designData || !designData.colors) {
    return <div className="text-red-500 p-8">Design data is missing or incomplete. Please re-select a design theme.</div>;
  }

  const handleColorChange = (colorKey, newHex) => {
    setEditedDesign(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorKey]: {
          ...prev.colors[colorKey],
          hex: newHex
        }
      }
    }));
  };

  const handleTypographyChange = (section, property, value) => {
    setEditedDesign(prev => ({
      ...prev,
      typography: {
        ...prev.typography,
        [section]: {
          ...prev.typography[section],
          [property]: value
        }
      }
    }));
  };

  const handleSave = () => {
    if (onUpdate && editedDesign) {
      onUpdate(editedDesign);
    }
    setIsEditing(false);
    setEditedDesign(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedDesign(null);
    // Reset to original design
    const selectedDesign = project?.selectedDesign || project?.designId || 'minimalistic';
    setDesignData(getDesignData(selectedDesign));
  };

  const startEditing = () => {
    setIsEditing(true);
    setEditedDesign({ ...designData });
  };

  const exportDesignTokens = () => {
    const tokens = {
      colors: designData.colors,
      typography: designData.typography,
      spacing: designData.spacing,
      components: designData.components
    };
    
    const blob = new Blob([JSON.stringify(tokens, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name}-design-tokens.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-semibold text-slate-900 mb-2">Design Specifications</h1>
            <p className="text-slate-600">
              Visual design system and style guide for {project?.name}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            {!isEditing ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={exportDesignTokens}
                  className="flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Tokens</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => downloadDesignSpec(designData, project?.name || 'Project')}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>Download Design Spec</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={startEditing}
                  className="flex items-center space-x-2 px-4 py-2 bg-vibe-cyan text-black rounded-lg hover:shadow-lg transition-all"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Design</span>
                </motion.button>
              </>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCancel}
                  className="flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </motion.button>
              </>
            )}
          </div>
        </motion.div>

        {/* Design Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-slate-200 p-6 mb-8"
        >
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0">
              <img
                src={designData.image}
                alt={designData.name}
                className="w-32 h-24 object-cover rounded-xl border border-slate-200"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-slate-900 mb-2">{designData.name}</h2>
              <p className="text-slate-600 mb-4">{designData.description}</p>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                  {designData.theme === 'dark' ? '🌙 Dark Theme' : '☀️ Light Theme'}
                </span>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                  {Object.keys(designData.colors).length} Colors
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Color Palette */}
          <ColorPalette
            colors={designData.colors}
            isEditing={isEditing}
            onColorChange={handleColorChange}
          />

          {/* Typography */}
          <Typography
            typography={designData.typography}
            isEditing={isEditing}
            onTypographyChange={handleTypographyChange}
          />

          {/* Spacing & Layout */}
          <SpacingLayout spacing={designData.spacing} />

          {/* Components */}
          <Components components={designData.components} />
        </div>
      </div>
    </div>
  );
};

// Color Palette Component
const ColorPalette = ({ colors, isEditing, onColorChange }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    className="bg-white rounded-2xl border border-slate-200 p-6"
  >
    <div className="flex items-center space-x-2 mb-6">
      <Palette className="w-5 h-5 text-slate-600" />
      <h3 className="text-lg font-semibold text-slate-900">Color Palette</h3>
    </div>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {Object.entries(colors).map(([key, color]) => (
        <div key={key} className="group">
          <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
            <div className="flex-shrink-0 relative">
              <div
                className="w-12 h-12 rounded-lg border-2 border-white shadow-md"
                style={{ backgroundColor: color.hex }}
              />
              {isEditing && (
                <input
                  type="color"
                  value={color.hex}
                  onChange={(e) => onColorChange(key, e.target.value)}
                  className="absolute inset-0 w-12 h-12 opacity-0 cursor-pointer"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h4 className="font-medium text-slate-900 truncate">{color.name}</h4>
                <button
                  onClick={() => navigator.clipboard.writeText(color.hex)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Copy className="w-3 h-3 text-slate-400" />
                </button>
              </div>
              <p className="text-sm text-slate-600 truncate">{color.description}</p>
              <code className="text-xs font-mono text-slate-500">{color.hex}</code>
            </div>
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

// Typography Component
const Typography = ({ typography, isEditing, onTypographyChange }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
    className="bg-white rounded-2xl border border-slate-200 p-6"
  >
    <div className="flex items-center space-x-2 mb-6">
      <Type className="w-5 h-5 text-slate-600" />
      <h3 className="text-lg font-semibold text-slate-900">Typography</h3>
    </div>
    
    <div className="space-y-6">
      <div>
        <h4 className="font-medium text-slate-900 mb-3">Font Families</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600">Primary:</span>
            <span className="font-medium" style={{ fontFamily: typography.primary }}>
              {typography.primary}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600">Secondary:</span>
            <span className="font-medium" style={{ fontFamily: typography.secondary }}>
              {typography.secondary}
            </span>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-medium text-slate-900 mb-3">Headings</h4>
        <div className="space-y-3">
          {Object.entries(typography.headings).map(([level, styles]) => (
            <div key={level} className="border border-slate-100 rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-700 uppercase">{level}</span>
                <code className="text-xs text-slate-500">
                  {styles.size} / {styles.weight}
                </code>
              </div>
              <div
                style={{
                  fontSize: styles.size,
                  fontWeight: styles.weight,
                  letterSpacing: styles.spacing,
                  fontFamily: typography.primary
                }}
                className="text-slate-900"
              >
                Sample Heading
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium text-slate-900 mb-3">Body Text</h4>
        <div className="border border-slate-100 rounded-lg p-3">
          <div
            style={{
              fontSize: typography.body.size,
              fontWeight: typography.body.weight,
              lineHeight: typography.body.lineHeight,
              fontFamily: typography.secondary
            }}
            className="text-slate-700"
          >
            This is sample body text that demonstrates the typography styles for regular content. 
            It should be readable and comfortable for extended reading.
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

// Spacing & Layout Component
const SpacingLayout = ({ spacing }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 }}
    className="bg-white rounded-2xl border border-slate-200 p-6"
  >
    <div className="flex items-center space-x-2 mb-6">
      <Layout className="w-5 h-5 text-slate-600" />
      <h3 className="text-lg font-semibold text-slate-900">Spacing & Layout</h3>
    </div>
    
    <div className="space-y-4">
      {Object.entries(spacing).map(([key, value]) => (
        <div key={key} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-b-0">
          <span className="text-slate-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
          <code className="text-sm font-mono bg-slate-100 px-2 py-1 rounded text-slate-700">
            {value}
          </code>
        </div>
      ))}
    </div>
  </motion.div>
);

// UI Components Library Component
const UIComponents = ({ designId }) => {
  const uiComponents = getUIComponentsForDesign(designId);
  
  if (!uiComponents) {
    return null;
  }

  const handleCopyInstallation = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleDownloadInstructions = () => {
    const instructions = generateInstallationInstructions(designId);
    const blob = new Blob([instructions], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${uiComponents.designName}-installation-guide.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadExamples = () => {
    const examples = generateComponentExamples(designId);
    const blob = new Blob([examples], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${uiComponents.designName}-component-examples.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-2xl border border-slate-200 p-6 lg:col-span-2"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Package className="w-5 h-5 text-slate-600" />
          <h3 className="text-lg font-semibold text-slate-900">UI Components Library</h3>
        </div>
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDownloadInstructions}
            className="flex items-center space-x-1 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm"
          >
            <Download className="w-3 h-3" />
            <span>Setup Guide</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDownloadExamples}
            className="flex items-center space-x-1 px-3 py-1.5 bg-vibe-cyan text-black rounded-lg hover:shadow-lg transition-all text-sm"
          >
            <Eye className="w-3 h-3" />
            <span>Examples</span>
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Library Info */}
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-slate-900 mb-2">Library Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Library:</span>
                <a 
                  href="https://www.hextaui.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-vibe-cyan hover:underline font-medium"
                >
                  {uiComponents.uiLibrary}
                </a>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Components:</span>
                <span className="font-medium">{uiComponents.components.length} available</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-slate-900 mb-2">Quick Setup</h4>
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <code className="text-xs text-slate-600">Install dependencies</code>
                <button
                  onClick={() => handleCopyInstallation('npm install @radix-ui/react-slot class-variance-authority')}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
              <code className="text-xs text-slate-800 font-mono">
                npm install @radix-ui/react-slot class-variance-authority
              </code>
            </div>
          </div>
        </div>

        {/* Available Components */}
        <div>
          <h4 className="font-medium text-slate-900 mb-3">Available Components</h4>
          <div className="grid grid-cols-1 gap-3">
            {uiComponents.components.map((component, index) => (
              <div key={index} className="border border-slate-100 rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h5 className="font-medium text-slate-900">{component.name}</h5>
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      {component.category}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopyInstallation(component.installation.cli)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-xs text-slate-600 mb-2">{component.description}</p>
                <div className="flex flex-wrap gap-1">
                  {component.variants && component.variants.slice(0, 3).map((variant, idx) => (
                    <span key={idx} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      {variant}
                    </span>
                  ))}
                  {component.variants && component.variants.length > 3 && (
                    <span className="text-xs text-slate-400">
                      +{component.variants.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Components Component
const Components = ({ components }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5 }}
    className="bg-white rounded-2xl border border-slate-200 p-6"
  >
    <div className="flex items-center space-x-2 mb-6">
      <Eye className="w-5 h-5 text-slate-600" />
      <h3 className="text-lg font-semibold text-slate-900">Component Styles</h3>
    </div>
    
    <div className="space-y-4">
      {Object.entries(components).map(([key, value]) => (
        <div key={key} className="py-2 border-b border-slate-100 last:border-b-0">
          <div className="flex justify-between items-start">
            <span className="text-slate-700 capitalize font-medium">
              {key.replace(/([A-Z])/g, ' $1')}
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">{value}</p>
        </div>
      ))}
    </div>
  </motion.div>
);

export default DesignSpec;