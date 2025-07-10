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
    // Import UI components service
    const { getUIComponentsForDesign, generateInstallationInstructions } = await import('./uiComponentsService');
    
    // Get UI components for the selected design
    const uiComponents = getUIComponentsForDesign(selectedDesign?.id);
    const installationInstructions = uiComponents ? generateInstallationInstructions(selectedDesign.id) : '';

    // Only include first 5 component names to keep prompt lean
    const uiSection = uiComponents ? `**UI Library**: ${uiComponents.uiLibrary}\n**Key Components**: ${uiComponents.components.slice(0,5).map(c=>c.name).join(', ')}\n\nInstallation:\n${installationInstructions}` : '';

    const optimizedPrompt = buildPRDPrompt(appIdea, selectedFeatures, selectedDesign, uiSection);

    const fetchBody = {
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: BASE_PRD_PROMPT },
        { role: 'user', content: optimizedPrompt }
      ],
      temperature: 0.5,
      max_tokens: 2000,
      stream: true
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
      },
      body: JSON.stringify(fetchBody)
    });
 
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    // Handle streaming response
    if (!response.body || typeof response.body.getReader !== 'function') {
      // Fallback: non-streaming
      const data = await response.json();
      return data.choices[0].message.content;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let content = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter((l) => l.trim());
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const dataStr = line.replace(/^data: /, '');
        if (dataStr === '[DONE]') continue;
        try {
          const json = JSON.parse(dataStr);
          const delta = json.choices?.[0]?.delta?.content;
          if (delta) {
            content += delta;
            if (onProgress) onProgress(content);
          }
        } catch (e) {
          // ignore malformed lines
        }
      }
    }

    return content;
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