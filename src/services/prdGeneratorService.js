const BASE_PRD_PROMPT = `
You are an expert Product Manager tasked with creating a clear, concise, and actionable Product Requirements Document (PRD) optimized for ChatGPT Canvas app building.
The PRD must:
- Be easy to implement as an MVP in one build session.
- Contain only essential features for a functional first version.
- Always start with an "Overview" before the problem statement.
- Include a "Design & Technical Guidelines" section with preset styling and stack.
- Use markdown headings.
- Avoid excessive corporate-style complexity.
- Include example/default data so the MVP is functional.
`;

// Separate prompt for GPT-5 Canvas building
const BASE_CANVAS_PROMPT = `You are an expert developer tasked with building a functional web application using ChatGPT's Canvas tool. Focus on creating a working MVP that can be built iteratively. Start with core functionality, then enhance.`;

const buildPRDPrompt = (appIdea, selectedFeatures, selectedDesign, uiSection) => {
  return `# Product Requirements Document (PRD) Generator\n\n` +
         `${BASE_PRD_PROMPT}\n\n` +
         `## Application Concept\n${appIdea}\n\n` +
         `## Selected Features (MVP)\n${selectedFeatures.join(', ')}\n\n` +
         `## Design & Technical Guidelines\n` +
         `- Visual Style: Clean, modern, minimalistic.\n` +
         `- Stack: React + Tailwind CSS + Shadcn UI.\n` +
         `- UI: Responsive design, smooth animations, accessible.\n` +
         `- Use placeholder/example data for all dynamic elements.\n` +
         (selectedDesign?.name ? `- Additional Design Theme: ${selectedDesign.name}\n` : '') +
         (uiSection || '') +
         `\n## PRD Sections\n1. Overview (2–3 sentences)\n2. Problem Statement (brief)\n3. Target Users\n4. Core Functional Requirements (MVP)\n5. Data Model / Schema (minimal)\n6. Platform Pages & Navigation\n7. Example Data / Defaults\n\n` +
         `Return the full PRD in markdown format only.`;
};

// Canvas prompt builder for GPT-5 section
const buildCanvasPrompt = (appIdea, selectedFeatures, selectedDesign, uiSection) => {
  return `Build me this app using the Canvas tool. Here is the breakdown of what I want built:\n\n`+
         `${BASE_CANVAS_PROMPT}\n\n`+
         `## App Overview\n${appIdea}\n\n`+
         `This should be a ${selectedDesign?.name || 'modern, clean, and minimalistic'} web application that provides core functionality for the described concept.\n\n`+
         `## Design & Frontend Requirements\n`+
         `- Use modern, clean, and minimalistic design principles\n`+
         `- Implement with React and Tailwind CSS for styling\n`+
         `- Ensure responsive design that works on desktop and mobile\n`+
         `- Use intuitive UI components and clear navigation\n`+
         `- Focus on user experience and accessibility\n\n`+
         `## Core Features to Build\n${selectedFeatures.join(', ')}\n\n`+
         (uiSection || '') +
         `\n## Build Approach\n`+
         `**Phase 1 (Build First):**\n`+
         `1. Basic app structure and navigation\n`+
         `2. Core functionality that makes the app useful\n`+
         `3. Essential user interface components\n`+
         `4. Basic data handling (local storage or state management)\n\n`+
         `**Phase 2 (Enhance Later):**\n`+
         `1. Advanced features and optimizations\n`+
         `2. Additional UI polish and animations\n`+
         `3. Extended functionality based on user feedback\n\n`+
         `## Technical Requirements\n`+
         `- Start with a single-page application structure\n`+
         `- Use React hooks for state management\n`+
         `- Implement responsive design with Tailwind CSS\n`+
         `- Include proper error handling and loading states\n`+
         `- Make it functional, not just a static UI\n\n`+
         `## Success Criteria\n`+
         `The app should be immediately usable for its core purpose. Users should be able to interact with the main features and see real functionality, not placeholder content.\n\n`+
         `Start building Phase 1 now, focusing on making the core features work properly.`;
};

export const generatePRD = async (appIdea, selectedFeatures, selectedDesign, onProgress) => {
  try {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key not found. Please set REACT_APP_OPENAI_API_KEY in your environment variables.');
    }
    // Lazily include UI components details only if a design is selected
    let uiSection = '';
    if (selectedDesign?.id) {
      const { getUIComponentsForDesign, generateInstallationInstructions } = await import('./uiComponentsService');
      const uiComponents = getUIComponentsForDesign(selectedDesign.id);
      const installationInstructions = uiComponents ? generateInstallationInstructions(selectedDesign.id) : '';
      uiSection = uiComponents ? `**UI Library**: ${uiComponents.uiLibrary}\n**Key Components**: ${uiComponents.components.slice(0,5).map(c=>c.name).join(', ')}\n\nInstallation:\n${installationInstructions}` : '';
    }

    const optimizedPrompt = buildPRDPrompt(appIdea, selectedFeatures, selectedDesign, uiSection);

    const fetchBody = {
      model: 'gpt-5',
      input: `System: ${BASE_PRD_PROMPT}\n\nUser: ${optimizedPrompt}`,
      reasoning: {
        effort: 'minimal'
      },
      text: {
        verbosity: 'medium'
      },
      max_output_tokens: 2000
      // stream removed: use non-streaming response for reliability in browser
    };

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(fetchBody)
    });
 
    if (!response.ok) {
      let errorMessage = `OpenAI API error: ${response.status}`;
      try {
        const errData = await response.json();
        if (errData && (errData.error?.message || errData.message)) {
          errorMessage += ` - ${errData.error?.message || errData.message}`;
        }
      } catch (_) {}
      throw new Error(errorMessage);
    }

    // Non-streaming: parse full JSON and extract text reliably across shapes
    const data = await response.json();
    const extractText = (d) => {
      if (!d || typeof d !== 'object') return '';
      if (typeof d.text === 'string') return d.text;
      if (Array.isArray(d.output_text)) return d.output_text.filter(Boolean).join('\n');
      if (d.output && Array.isArray(d.output)) {
        const segments = d.output
          .map((o) => Array.isArray(o.content) ? o.content.map((c) => c.text).filter(Boolean).join('') : '')
          .filter(Boolean)
          .join('\n');
        if (segments) return segments;
      }
      if (Array.isArray(d.choices)) {
        const combined = d.choices
          .map((c) => c.message?.content || c.delta?.content || c.text)
          .filter(Boolean)
          .join('');
        if (combined) return combined;
      }
      return '';
    };
    const fullText = extractText(data) || '';
    if (onProgress && fullText) onProgress(fullText);
    return fullText;
  } catch (error) {
    console.error('Error generating PRD:', error);
    throw error;
  }
};

// Separate function specifically for GPT-5 PRD generation (gets wrapped for Canvas later)
export const generatePRDForGPT5 = async (appIdea, onProgress) => {
  try {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key not found. Please set REACT_APP_OPENAI_API_KEY in your environment variables.');
    }

    // For GPT-5, we'll use basic features and design since it focuses on Canvas-ready PRDs
    const basicFeatures = ['User interface', 'Core functionality', 'Data management'];
    const minimalisticDesign = { name: 'modern, clean, and minimalistic' };
    
    const optimizedPrompt = buildPRDPrompt(appIdea, basicFeatures, minimalisticDesign, '');

    const fetchBody = {
      model: 'gpt-5',
      input: `System: ${BASE_PRD_PROMPT}\n\nUser: ${optimizedPrompt}`,
      reasoning: {
        effort: 'minimal'
      },
      text: {
        verbosity: 'medium'
      },
      max_output_tokens: 2000
    };

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(fetchBody)
    });
 
    if (!response.ok) {
      let errorMessage = `OpenAI API error: ${response.status}`;
      try {
        const errData = await response.json();
        if (errData && (errData.error?.message || errData.message)) {
          errorMessage += ` - ${errData.error?.message || errData.message}`;
        }
      } catch (_) {}
      throw new Error(errorMessage);
    }

    // Non-streaming: parse full JSON and extract text reliably across shapes
    const data = await response.json();
    const extractText = (d) => {
      if (!d || typeof d !== 'object') return '';
      if (typeof d.text === 'string') return d.text;
      if (Array.isArray(d.output_text)) return d.output_text.filter(Boolean).join('\n');
      if (d.output && Array.isArray(d.output)) {
        const segments = d.output
          .map((o) => Array.isArray(o.content) ? o.content.map((c) => c.text).filter(Boolean).join('') : '')
          .filter(Boolean)
          .join('\n');
        if (segments) return segments;
      }
      if (Array.isArray(d.choices)) {
        const combined = d.choices
          .map((c) => c.message?.content || c.delta?.content || c.text)
          .filter(Boolean)
          .join('');
        if (combined) return combined;
      }
      return '';
    };
    const fullText = extractText(data) || '';
    if (onProgress && fullText) onProgress(fullText);
    return fullText;
  } catch (error) {
    console.error('Error generating PRD for GPT-5:', error);
    throw error;
  }
};

// Helper function to extract app name from description
export const extractAppName = (appIdea) => {
  const words = appIdea.split(' ');
  if (words.length > 0) {
    return words.slice(0, 3).map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  }
  return 'My App';
}; 