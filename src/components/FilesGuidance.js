import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, FileText, ArrowRight, Copy, Check, Palette } from 'lucide-react';
import { generateDesignSpecDocument } from '../services/designSpecService';

/**
 * FilesGuidance – Full-screen onboarding experience for setting up Cursor project
 * Props:
 *  - project: includes generatedFiles array so we can offer copies.
 *  - onClose: callback when the user wants to skip onboarding.
 *  - onComplete: callback when the user completes the onboarding.
 */

const FilesGuidance = ({ project, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [copiedFiles, setCopiedFiles] = useState(new Set());

  const prdFile = project.generatedFiles?.find(f => f.type === 'PRD Document') || null;

  // Function to get combined PRD + Design Spec content
  const getCombinedContent = () => {
    if (!prdFile?.content) return '';
    
    // Get PRD content
    let combinedContent = prdFile.content;
    
    // Generate tech stack section based on project type
    const getTechStackSection = () => {
      const projectType = project?.type;
      
      if (projectType === 'Web App') {
        return `
# Tech Stack Guidelines for Cursor AI

## Development Stack
This is a **Web App** project. When generating code or providing development guidance, use the following tech stack:

### Frontend:
- **JavaScript (ES6+)** - The primary language for the frontend.
- **React** - A JavaScript library for building user interfaces.

### Backend:
- **Node.js** - A JavaScript runtime for the backend server.
- **Express.js** - (Recommended) A web application framework for Node.js.

### Development Guidelines:
- **Frontend**:
  - Use functional components with Hooks.
  - Manage state with React Context or a library like Redux if complex.
  - Use \`create-react-app\` for project setup.
  - Structure components logically.
- **Backend**:
  - Create a RESTful API with Node.js and Express.
  - Use clear and consistent API endpoint naming.
- **General**:
  - Write clean, modular, and well-commented JavaScript code.
  - **Do not use TypeScript.**
  - **Do not use Next.js.**

### File Structure:
- **Frontend (in a \`client\` or \`frontend\` directory):**
  - \`src/components/\` for reusable React components.
  - \`src/pages/\` or \`src/views/\` for page-level components.
- **Backend (in a \`server\` or \`backend\` directory):**
  - \`routes/\` for API route definitions.
  - \`controllers/\` for business logic.
  - \`models/\` for data schema (if applicable).

Always prioritize these technologies when generating code or providing implementation suggestions.`;
      } else if (projectType === 'Mobile App') {
        return `
# Tech Stack Guidelines for Cursor AI

## Development Stack
This is a **Mobile App** project. When generating code or providing development guidance, use the following tech stack:

### Primary Technologies:
- **React Native** - Cross-platform mobile development framework
- **Expo** - Platform for universal React applications

### Development Guidelines:
- Use Expo CLI for development workflow
- Implement responsive design for different screen sizes
- Follow React Native best practices for mobile performance
- Use Expo SDK for device features (camera, notifications, etc.)
- Implement proper navigation with React Navigation

### File Structure:
- Components in \`components/\` directory
- Screens in \`screens/\` directory
- Navigation setup in \`navigation/\` directory
- Use Expo managed workflow unless specific native modules are needed

### Mobile-Specific Considerations:
- Optimize for both iOS and Android platforms
- Handle different screen densities and sizes
- Implement proper touch interactions and gestures
- Consider offline functionality and data persistence

Always prioritize these technologies when generating code or providing implementation suggestions.`;
      }
      
      return '';
    };
    
    // Add tech stack section
    const techStackSection = getTechStackSection();
    if (techStackSection) {
      combinedContent += '\n\n---\n\n' + techStackSection;
    }
    
    // Generate and append design specification if we have design data
    if (project?.selectedDesign) {
      try {
        const designSpecContent = generateDesignSpecDocument(project.selectedDesign, project.name);
        combinedContent += '\n\n---\n\n' + designSpecContent;
      } catch (error) {
        console.error('Error generating design spec:', error);
        // If design spec generation fails, just use PRD content
      }
    }
    
    return combinedContent;
  };

  const handleCopy = async (content, fileType) => {
    if (!content) return;
    
    try {
      await navigator.clipboard.writeText(content);
      setCopiedFiles(prev => new Set([...prev, fileType]));
      
      setTimeout(() => {
        setCopiedFiles(prev => {
          const newSet = new Set(prev);
          newSet.delete(fileType);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const markStepComplete = (stepNumber) => {
    setCompletedSteps(prev => new Set([...prev, stepNumber]));
  };

  const nextStep = () => {
    if (currentStep < 3) {
      markStepComplete(currentStep);
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    markStepComplete(currentStep);
    onComplete && onComplete();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 transition-colors text-sm z-10"
      >
        Skip setup
      </button>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-6">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    completedSteps.has(step)
                      ? 'bg-black text-white'
                      : currentStep === step
                      ? 'bg-vibe-cyan text-black'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {completedSteps.has(step) ? <CheckCircle className="w-5 h-5" /> : step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-24 h-px mx-4 transition-colors ${
                      completedSteps.has(step) ? 'bg-black' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold text-black">Copy your project files</h2>
                  <p className="text-lg text-gray-500">Copy your generated PRD document to set up Cursor AI.</p>
                </div>

                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-3">
                  {prdFile && (
                    <div className="flex items-center bg-white p-3 rounded-xl border border-gray-200/80">
                      <FileText className="w-5 h-5 text-gray-500 mr-4 flex-shrink-0" />
                      <div className="flex-1 text-left">
                        <h4 className="font-semibold text-sm">PRD Document</h4>
                        <p className="text-xs text-gray-500">Combined PRD & Design Specifications</p>
                      </div>
                      <button onClick={() => handleCopy(getCombinedContent(), 'PRD Document')} className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-semibold transition-colors ${copiedFiles.has('PRD Document') ? 'bg-green-100 text-green-700' : 'bg-gray-100 hover:bg-gray-200'}`}>
                        {copiedFiles.has('PRD Document') ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        <span>{copiedFiles.has('PRD Document') ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex justify-end items-center pt-2">
                  <button onClick={nextStep} className="px-6 py-2 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all flex items-center space-x-2">
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold text-black">Add to Cursor project rules</h2>
                  <p className="text-lg text-gray-500">Follow these steps to add your files to Cursor.</p>
                </div>
                
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="text-left space-y-4 flex-1">
                      {[
                        { title: 'Open Cursor Settings', description: 'Go to Cursor Settings → Rules' },
                        { title: 'Add new project rules file', description: 'Click "Add new project rules file"' },
                        { title: 'Create PRD file', description: 'Name it "prd" and paste the copied content' },
                      ].map((item, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-white font-semibold text-xs">{index + 1}</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm text-black">{item.title}</h4>
                            <p className="text-sm text-gray-500">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="w-full md:w-2/3 aspect-video bg-black rounded-lg overflow-hidden border border-gray-200 self-center">
                      <video src="/addingfile.mov" autoPlay loop muted playsInline className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button onClick={prevStep} className="text-gray-500 hover:text-gray-700 transition-colors">Back</button>
                  <button onClick={nextStep} className="px-6 py-2 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all flex items-center space-x-2">
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
               <div className="space-y-6">
                 <div className="space-y-2">
                   <h2 className="text-3xl font-bold text-black">You're all set</h2>
                   <p className="text-lg text-gray-500">Your AI now has context. Time to build!</p>
                 </div>
 
                 <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                   <div className="mt-2">
                     <button
                       onClick={handleComplete}
                       className="w-full px-8 py-3 bg-vibe-cyan text-black rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                     >
                       <span>Start building</span>
                       <ArrowRight className="w-5 h-5" />
                     </button>
                   </div>
                 </div>
 
                 <div className="flex justify-center">
                   <button onClick={prevStep} className="text-gray-500 hover:text-gray-700 transition-colors">Back</button>
                 </div>
               </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FilesGuidance; 