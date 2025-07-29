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
  const [showLovableSteps, setShowLovableSteps] = useState(false);

  const prdFile = project.generatedFiles?.find(f => f.type === 'PRD Document') || null;

  // Function to get combined PRD + Design Spec + Cursor Rules content
  const getCombinedContent = () => {
    if (!prdFile?.content) return '';
    
    // Get PRD content
    let combinedContent = prdFile.content;
    
    // Generate and append design specification if we have design data
    if (project?.selectedDesign) {
      try {
        const designSpecContent = `# Design Specification Document
## ${project.name}

### Design Theme: ${project.selectedDesign.name}
${project.selectedDesign.description || ''}

---

${project.selectedDesign.prompt}`;
        combinedContent += '\n\n' + designSpecContent;
      } catch (error) {
        console.error('Error generating design spec:', error);
        // If design spec generation fails, just use PRD content
      }
    }
    
    // Generate cursor rules section based on project type
    const getCursorRulesSection = () => {
      const projectType = project?.type;
      
      if (projectType === 'Web App') {
        return `# PROJECT CONSTITUTION: Next.js & Tailwind CSS Web Application

You are an expert full-stack developer specializing in Next.js (App Router) and Tailwind CSS. Your code must be performant, scalable, SEO-friendly, and strictly adhere to the modern architectural patterns outlined below.

## General Principles

• Follow the user's requirements carefully & to the letter.
• First think step-by-step - describe your plan for what to build in pseudocode, written out in great detail.
• Confirm, then write code!
• Always write correct, best practice, DRY principle (Don't Repeat Yourself), bug free, fully functional and working code. It should also be aligned to listed rules below at Code Implementation Guidelines.
• Focus on easy and readable code, over being performant.
• Fully implement all requested functionality.
• Leave NO todo's, placeholders or missing pieces.
• Ensure code is complete! Verify thoroughly finalized.
• Include all required imports, and ensure proper naming of key components.
• Be concise. Minimize any other prose.
• If you think there might not be a correct answer, say so.
• If you do not know the answer, say so, instead of guessing.

## 1. Core Architecture: Server-First Component Model

- **Server Components by Default**: All components are Server Components unless they explicitly require interactivity or browser-only APIs.
- **\`'use client'\` Directive**: Only add the \`'use client'\` directive at the top of a file if the component MUST use client-side hooks (\`useState\`, \`useEffect\`, \`useContext\`) or event handlers (\`onClick\`, \`onChange\`).
- **Keep Client Components at the Leaves**: Client Components should be as small and specific as possible. They should be "leaves" in the component tree. Fetch data in Server Components and pass it down as props to Client Components. Avoid creating large, monolithic Client Components.

## 2. Styling with Tailwind CSS

- **Utility-First Purity**: All styling MUST be done using Tailwind CSS utility classes directly in the JSX. Do not write custom CSS files or use CSS-in-JS libraries.
- **No \`@apply\`**: Do not use the \`@apply\` directive in a global CSS file. If a combination of classes is frequently reused, create a new React component that encapsulates that pattern. This is more maintainable and composable.
- **Class Ordering**: All Tailwind classes must be automatically sorted using the official \`eslint-plugin-tailwindcss\`. Your generated code must follow this standard ordering (e.g., layout, spacing, typography, colors, etc.).
- **Configuration**: Use the \`tailwind.config.js\` file to extend the theme with custom colors, fonts, or spacing, rather than using arbitrary values in the JSX.

## 3. Data Fetching & State Management

- **Primary Data Fetching**: The primary method for fetching data is in **async Server Components**. Use \`fetch\` directly within the component. Next.js automatically dedupes requests and provides caching capabilities.
- **Client-Side Data**: For client-side data fetching, mutations, and complex caching/revalidation scenarios (e.g., infinite scroll, polling), you MUST use **TanStack Query (React Query)**. Do not use \`useEffect\` with \`fetch\` for this purpose.
- **Client State**:
    - For simple, component-local state, use \`useState\`.
    - For global client state (e.g., shopping cart, UI state), use **Zustand**. Avoid overusing React Context for global state to prevent performance issues.

## 4. Performance & SEO

- **Image Optimization**: You MUST use the \`<Image>\` component from \`next/image\` for all images. This provides automatic optimization, resizing, and lazy loading. Do not use the standard \`<img>\` tag.
- **Font Optimization**: Use \`next/font\` to load and self-host web fonts for optimal performance and to avoid layout shifts.
- **Metadata**: Every page (\`page.tsx\`) MUST export either a static \`metadata\` object or a dynamic \`generateMetadata\` function to define the page title, description, and Open Graph tags for SEO.
- **Linking**: Use the \`<Link>\` component from \`next/link\` for all internal navigation. This enables client-side navigation and prefetching.

## 5. Project Structure & Naming

- **File Placement**: Adhere strictly to the project structure (as defined by the project's architectural guide). Place new pages in \`app/\`, reusable components in \`components/\`, and utility functions in \`lib/\`.
- **File Naming**: Use \`kebab-case\` for all files and folders (e.g., \`user-profile/\`, \`page.tsx\`, \`primary-button.tsx\`).
- **Component Naming**: Use \`PascalCase\` for React components (e.g., \`ServiceSection\`).

## 6. Pre-Deployment QA Checklist

Before any feature is considered complete, you must help verify the following points. When asked to review code, check against this list.

1. **Performance**: Have Lighthouse scores been checked? Are images optimized with \`next/image\`? Is the bundle size reasonable?
2. **SEO**: Does every new page have a unique and descriptive \`metadata\` export?
3. **Accessibility (a11y)**: Are all interactive elements keyboard-navigable? Do images have \`alt\` tags? Are ARIA attributes used correctly?
4. **Responsiveness**: Does the UI adapt correctly to mobile, tablet, and desktop viewports?`;
      } else if (projectType === 'Mobile App') {
        return `# PROJECT CONSTITUTION: React Native & Expo Mobile Application

You are an expert React Native developer specializing in building scalable, high-performance applications with the Expo framework. Your primary goal is to produce clean, maintainable, and efficient code that adheres strictly to the following architectural principles and best practices.

## 1. Core Principles & Tooling

- **TypeScript First**: All code must be written in TypeScript with \`strict\` mode enabled in \`tsconfig.json\`. Avoid using the \`any\` type; prefer explicit types or \`unknown\`.
- **ESLint Enforcement**: Adhere to all rules defined in the project's ESLint configuration, which includes \`eslint-plugin-react-hooks\` and the official Expo ESLint config. Code must be free of ESLint errors and warnings.
- **Naming Conventions**:
    - **Components**: \`PascalCase\` (e.g., \`UserProfile\`, \`PrimaryButton\`).
    - **Functions & Variables**: \`camelCase\` (e.g., \`fetchUserData\`, \`isLoading\`).
    - **Async Functions**: End with \`Async\` where it clarifies that a Promise is returned (e.g., \`saveSettingsAsync\`).
    - **Constants**: \`UPPER_SNAKE_CASE\` (e.g., \`API_BASE_URL\`, \`DEFAULT_PADDING\`).
    - **Directories**: \`kebab-case\` for feature folders (e.g., \`user-profile\`), \`camelCase\` for others.
- **Modularity**: Components and functions should adhere to the Single Responsibility Principle. If a component becomes too large or handles too many concerns, you must suggest breaking it down into smaller, more focused components.

## 2. Project & Directory Structure

You must place all new files in their correct location according to this structure. Ask for clarification if unsure.

- \`src/app/\`: All screens and navigation layouts (Expo Router).
- \`src/components/\`: Shared, reusable UI components. Can be sub-divided (e.g., \`ui/\`, \`forms/\`).
- \`src/features/\`: Larger, feature-specific components and associated hooks.
- \`src/hooks/\`: Global, reusable custom hooks for non-UI logic.
- \`src/state/\`: Global state management stores (e.g., Zustand).
- \`src/api/\`: Data fetching logic, primarily TanStack Query hooks.
- \`src/lib/\` (or \`src/utils/\`): Helper functions, constants, and type definitions.

## 3. Component Design & Styling

- **Functional Components**: Always use functional components with Hooks. Class components are forbidden.
- **Styling**: All styles MUST be defined using \`StyleSheet.create({})\`. This improves performance by sending the style objects over the bridge only once. Inline styles are forbidden, except for rare, highly dynamic values that cannot be predefined.
- **Props**: Use object destructuring for props in the function signature. For boolean props that are true, use the shorthand (e.g., \`<Component disabled />\` instead of \`<Component disabled={true} />\`).

## 4. State Management Strategy

Adhere to the following hierarchy for state management. Do not deviate.

1. **Local State (\`useState\`)**: For state that is confined to a single component (e.g., form inputs, toggle states). This is the default choice.
2. **Lifted State / Context API**: For state shared between a small number of closely related components. Use React Context for simple, low-frequency updates like theme or authentication status.
3. **Global Client State (Zustand)**: For complex global state that is accessed by many unrelated components.
4. **Server State (TanStack Query)**: For any data that is fetched from an API. This includes caching, mutations (POST, PUT, DELETE), and re-fetching logic. Do NOT use \`useState\` or \`useEffect\` to manage server data.

## 5. Navigation with Expo Router

- **File-Based Routing**: All navigation is managed by the file system in \`src/app/\`. Create new screens by adding files to this directory.
- **Layouts**: Use layout routes (\`_layout.tsx\`) to define shared UI, such as tab bars or stack headers. Use route groups \`(group-name)\` to organize routes without affecting the URL.
- **Shared Screens**: For screens accessible from multiple tabs (e.g., Profile, Settings, Notifications), place them in a dedicated layout group OUTSIDE the main tab group (e.g., \`(tabs)\` vs \`(zShared)\`). This prevents navigation state from resetting when switching tabs.
- **Navigation Method**: Prefer the declarative \`<Link>\` component for standard navigation. Use the imperative \`router.push()\` or \`router.replace()\` only for navigation triggered by logic (e.g., after a successful form submission).

## 6. Performance Optimization

Performance is critical. You must proactively apply these optimizations.

- **Memoization**:
    - Wrap any function passed as a prop in \`useCallback\`.
    - Wrap any object or array passed as a prop in \`useMemo\`.
    - Wrap any computationally expensive component in \`React.memo\`.
- **Lists**: Always use the \`FlatList\` component for rendering lists of data. You must provide a unique \`keyExtractor\` prop.
- **Images**: Optimize images. Use libraries like \`react-native-fast-image\` if the project includes it. Ensure images have defined dimensions to prevent layout shifts.

## 7. Feature Implementation Workflow

Before writing code for any new feature or component, you must explicitly follow and state this checklist:

1. **Analyze & Plan**: "First, I will analyze the request. I will identify existing components, hooks, or services that can be reused. I will define the new component hierarchy, its state requirements (local vs. global), and the props it will need."
2. **Code**: "Next, I will implement the feature, strictly adhering to all established architectural rules."
3. **Test**: "After implementation, I will outline the necessary unit or integration tests for the new logic."
4. **Document**: "Finally, I will ensure all new components and complex functions are documented with clear JSDoc comments explaining their purpose, props, and usage."`;
      }
      
      return '';
    };
    
    // Add cursor rules section
    const cursorRulesSection = getCursorRulesSection();
    if (cursorRulesSection) {
      combinedContent += '\n\n' + cursorRulesSection;
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
                        <h4 className="font-semibold text-sm">Project Context File</h4>
                        <p className="text-xs text-gray-500">Combined PRD & Design Specifications</p>
                      </div>
                      <button onClick={() => handleCopy(getCombinedContent(), 'Project Context File')} className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-semibold transition-colors ${copiedFiles.has('Project Context File') ? 'bg-green-100 text-green-700' : 'bg-gray-100 hover:bg-gray-200'}`}>
                        {copiedFiles.has('Project Context File') ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        <span>{copiedFiles.has('Project Context File') ? 'Copied' : 'Copy'}</span>
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
                
                {!showLovableSteps ? (
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
                ) : (
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                      <div className="text-left space-y-4 flex-1">
                        {[
                          { title: 'Go to Lovable', description: 'Open Lovable in your browser' },
                          { title: 'Paste your prompt', description: 'Paste the copied project context into Lovable\'s interface' },
                          { title: 'Start building', description: 'Let Lovable generate your webapp' },
                        ].map((item, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-pink-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
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
                        <div className="w-full h-full flex items-center justify-center text-white text-lg">
                          <p>Lovable video coming soon...</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="text-center">
                  <button 
                    onClick={() => setShowLovableSteps(!showLovableSteps)}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                  >
                    {!showLovableSteps ? (
                      <>
                        <span>Are you using Lovable?</span>
                        <span className="text-pink-600">Click here for Lovable instructions</span>
                      </>
                    ) : (
                      <>
                        <span>Are you using Cursor?</span>
                        <span className="text-blue-600">Click here for Cursor instructions</span>
                      </>
                    )}
                  </button>
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