import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Play, FileText, Palette, Code, ArrowRight, ExternalLink } from 'lucide-react';
import { downloadDesignSpec } from '../services/designSpecService';

/**
 * FilesGuidance – Modern "Get Started" guide component
 * Props:
 *  - project: includes generatedFiles array so we can offer downloads.
 *  - onClose (optional): callback when the user clicks the back link.
 */

const DownloadButton = ({ file, label, icon: Icon, project, isDesignSpec }) => {
  const handleDownload = async () => {
    if (!file?.content) return;
    
    // Special handling for design spec downloads
    if (isDesignSpec && project) {
      // Get design data for download
      const getDesignData = () => {
        if (
          project?.selectedDesign &&
          typeof project.selectedDesign === 'object' &&
          project.selectedDesign.colors &&
          Object.keys(project.selectedDesign.colors).length > 0
        ) {
          return project.selectedDesign;
        }
        // fallback to static lookup if not present or incomplete
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
        const designId = project?.designId || 'minimalistic';
        return designs[designId] || designs['minimalistic'];
      };

      const designData = getDesignData();
      await downloadDesignSpec(designData, project?.name || 'Project');
      return;
    }

    // Regular file download
    const blob = new Blob([file.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name || `${label.replace(/\s+/g, '-').toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.button
      onClick={handleDownload}
      disabled={!file?.content}
      whileHover={{ scale: file?.content ? 1.02 : 1, y: file?.content ? -2 : 0 }}
      whileTap={{ scale: file?.content ? 0.98 : 1 }}
      className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all shadow-sm ${
        file?.content 
          ? 'bg-vibe-cyan text-black hover:shadow-lg' 
          : 'bg-slate-200 text-slate-500 cursor-not-allowed'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{file?.content ? `Download ${label}` : `Generate ${label} First`}</span>
    </motion.button>
  );
};

const StepCard = ({ step, isCompleted, isActive, project }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: step.id * 0.1, duration: 0.6 }}
      className={`bg-white border rounded-2xl p-6 transition-all duration-300 w-full ${
        isActive 
          ? 'border-vibe-cyan shadow-lg' 
          : 'border-slate-200/80 hover:border-slate-300'
      }`}
    >
      <div className="flex items-center space-x-4 mb-4">
        <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg flex-shrink-0 ${
          isCompleted 
            ? 'bg-slate-800 text-white' 
            : isActive 
              ? 'bg-vibe-cyan text-black' 
              : 'bg-slate-100 text-slate-600 border border-slate-200'
        }`}>
          {isCompleted ? <CheckCircle className="w-6 h-6" /> : step.id}
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800">{step.title}</h3>
          <p className="text-sm text-slate-500">{step.subtitle}</p>
        </div>
      </div>
      
      <div className="pl-16">
        <p className="text-slate-600 leading-relaxed mb-6">{step.description}</p>
        
        <div className="flex flex-wrap gap-4 items-center">
          {step.downloadButton && (
            <DownloadButton 
              file={step.file} 
              label={step.downloadButton.label}
              icon={step.downloadButton.icon}
              project={project}
              isDesignSpec={step.id === 1}
            />
          )}
          
          {step.actions?.map((action, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={action.onClick}
              className="flex items-center space-x-2 text-sm font-medium text-slate-600 hover:text-black transition-colors"
            >
              <span>{action.label}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const FilesGuidance = ({ project, onClose, onNavigateToTab, onOpenModal }) => {
  const [activeStep, setActiveStep] = useState(1);

  const prdFile = project.generatedFiles?.find(f => f.type === 'PRD Document') || null;
  const designSpecFile = {
    name: `${project.name}-design-spec.html`,
    content: 'dummy' // a truthy value to enable download
  };

  const steps = [
    {
      id: 1,
      title: 'Review Design Specifications',
      subtitle: 'Understand the visual language',
      description: 'Your design specification is a comprehensive guide to the visual style of your project, including colors, typography, spacing, and component design. It\'s the blueprint for a consistent user interface.',
      status: designSpecFile?.content ? 'completed' : 'pending',
      file: designSpecFile,
      downloadButton: {
        label: 'Design Spec',
        icon: Palette
      },
      actions: [
        { 
          label: 'View Design Review', 
          onClick: () => onNavigateToTab('design-review'),
          className: 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50'
        },
      ]
    },
    {
      id: 2,
      title: 'Examine Product Requirements',
      subtitle: 'Get your product requirements',
      description: 'Your Product Requirements Document outlines all the features, technical specifications, and business requirements for your project. This serves as your development blueprint.',
      status: prdFile ? 'completed' : 'pending',
      file: prdFile,
      downloadButton: {
        label: 'PRD',
        icon: FileText
      },
      actions: [
        { 
          label: 'Open PRD Editor',
          onClick: () => onOpenModal('prd'),
          className: 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50'
        },
      ]
    },
    {
      id: 3,
      title: 'Generate Prompts',
      subtitle: 'Create prompts for your features',
      description: 'Generate tailored prompts for each of your application\'s features. These prompts can be used with AI tools like Cursor to accelerate development and ensure consistency.',
      status: 'active',
      actions: [
        {
          label: 'Go to Prompt Generator',
          onClick: () => onNavigateToTab('prompt-templates'),
          icon: Code,
          className: 'bg-blue-600 text-white hover:bg-blue-700'
        }
      ]
    }
  ];

  const handleStepClick = (stepId) => {
    setActiveStep(stepId);
  };

  return (
    <div className="w-full bg-slate-50/80 p-6 md:p-10">
      {/* Header */}
      <header className="mb-12 text-center">
        <h1 className="font-jersey text-4xl md:text-5xl text-black leading-tight">
          🚀 Get Started with Your Project
        </h1>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
          Follow these steps to familiarize yourself with the generated assets and kickstart your development process.
        </p>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        <div className="space-y-6">
          {steps.map((step) => (
            <StepCard
              key={step.id}
              step={step}
              isActive={activeStep === step.id}
              isCompleted={step.status === 'completed'}
              project={project}
            />
          ))}
        </div>
      </div>
      
      {/* Back to dashboard link */}
      {onClose && (
        <div className="text-center mt-12">
          <button onClick={onClose} className="text-slate-600 hover:text-black transition-colors font-medium text-sm">
            Back to Dashboard
          </button>
        </div>
      )}
    </div>
  );
};

export default FilesGuidance; 