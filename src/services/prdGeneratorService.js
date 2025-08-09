// Concise base prompt (core requirements only). Detailed guidelines removed for performance.
const BASE_PRD_PROMPT = `You are an expert Product Manager tasked with creating a comprehensive, professional Product Requirements Document (PRD). The PRD must be complete yet concise, actionable, and formatted in markdown with clear section headings.`;

// Build an optimized prompt with only relevant dynamic context.
const buildPRDPrompt = (appIdea, selectedFeatures, selectedDesign, uiSection) => {
  return `# Product Requirements Document Generator\n\n`+
         `${BASE_PRD_PROMPT}\n\n`+
         `## Application Concept\n${appIdea}\n\n`+
         `## Selected Features\n${selectedFeatures.join(', ')}\n\n`+
         `## Design System\n${selectedDesign?.name || 'Modern Minimalistic'}\n\n`+
         (uiSection || '') +
         `\n## PRD Sections\n1. Problem Statement\n2. Target Users & Personas\n3. Functional Requirements (with MoSCoW)\n4. Data Model / Schema\n5. Platform Pages\n6. User Stories & Flows\n7. Success Metrics & KPIs\n8. Scope & MVP Definition\n9. Competitive Landscape\n\nReturn the full PRD.`;
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