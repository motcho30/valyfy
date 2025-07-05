const PROMPT_GENERATION_SYSTEM = `You are an expert prompt engineer that creates concise, directive development prompts for Cursor IDE. Your goal is to generate focused implementation commands that get developers building immediately.

CRITICAL REQUIREMENTS:
1. Keep prompts under 120 words - be ruthlessly concise
2. NEVER include actual code snippets or syntax examples
3. Start with clear implementation goal: "I want you to implement..."
4. Focus on immediate implementation action, not research
5. Structure as: Goal → User Experience → Implementation Focus → Build Action
6. End with specific building directive, not planning or research

AVOID:
- Code examples, syntax, or snippets
- Research or planning actions
- Vague "start by" instructions
- Technical implementation details
- Long explanations

FOCUS ON:
- Clear implementation command
- What users will experience
- Core implementation priorities
- Specific building action that starts coding immediately`;

export const generatePromptForFeature = async (featureName, projectContext) => {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key not found. Please set REACT_APP_OPENAI_API_KEY in your environment variables.');
  }

  const userPrompt = `Create a directive implementation prompt for this feature:

**Feature**: ${featureName}
**Project**: ${projectContext.name} (${projectContext.type})
**Context**: ${projectContext.description}
**Tech Stack**: ${projectContext.framework || 'React'} with ${projectContext.designSystem || 'Minimalistic'} design
**Related Features**: ${projectContext.features ? projectContext.features.slice(0, 3).join(', ') : 'None'}

Generate a focused prompt that:
1. Starts with "I want you to implement..."
2. Explains user experience briefly
3. Highlights implementation priorities
4. Ends with specific building action (not research/planning)

Keep it under 120 words and avoid code examples.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: PROMPT_GENERATION_SYSTEM
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: 0.3,
        max_tokens: 250
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating prompt:', error);
    
    // Fallback to a enhanced template if API fails
    return generateFallbackPrompt(featureName, projectContext);
  }
};

// Enhanced fallback prompt generator
const generateFallbackPrompt = (featureName, projectContext) => {
  return `I want you to implement ${featureName} for ${projectContext.name}, a ${projectContext.type.toLowerCase()} focused on ${projectContext.description}.

**User Experience**: Users will interact with ${featureName} to accomplish their goals efficiently. The interface should feel intuitive and follow ${projectContext.designSystem || 'minimalistic'} design principles, ensuring seamless integration with existing ${projectContext.framework || 'React'} components.

**Implementation Focus**: Create a component that handles user interactions gracefully. Prioritize state management, data flow, and seamless integration with your existing architecture. Focus on user feedback and error handling.

**Build Action**: Create the main ${featureName} component with proper state management and user interaction handlers. Build the core functionality first, then enhance with styling and edge cases.

Start coding the component structure and basic functionality now.`;
};

const promptGeneratorService = { generatePromptForFeature };
export default promptGeneratorService; 