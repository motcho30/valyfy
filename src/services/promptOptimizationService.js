// Prompt Optimization Service
// This service handles AI-powered prompt optimization

export const optimizePrompt = async (originalPrompt, context = {}) => {
  try {
    // Check if OpenAI API key is available
    if (!process.env.REACT_APP_OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    const optimizationPrompt = `You are an expert prompt engineer. Please optimize the following prompt to make it more effective, clear, and specific.

Original prompt context:
- Name: ${context.name || 'Unnamed prompt'}
- Description: ${context.description || 'No description provided'}
- Category: ${context.category || 'General'}

Original prompt:
${originalPrompt}

Please provide an optimized version that follows these principles:
1. **Clarity**: Use clear, unambiguous language
2. **Specificity**: Include specific details and constraints
3. **Structure**: Organize the prompt logically with clear sections
4. **Context**: Provide relevant background information
5. **Instructions**: Give clear, actionable instructions
6. **Examples**: Include examples where helpful
7. **Constraints**: Specify any limitations or requirements
8. **Output Format**: Define the expected output format

Optimized prompt:`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert prompt engineer specializing in creating clear, effective, and optimized prompts for AI assistants.'
          },
          {
            role: 'user',
            content: optimizationPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const optimizedPrompt = data.choices[0]?.message?.content;

    if (!optimizedPrompt) {
      throw new Error('No optimized prompt received from API');
    }

    return optimizedPrompt;
  } catch (error) {
    console.error('Error optimizing prompt:', error);
    throw new Error(`Failed to optimize prompt: ${error.message}`);
  }
};

export const analyzePromptEffectiveness = async (prompt, usageData = {}) => {
  try {
    if (!process.env.REACT_APP_OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    const analysisPrompt = `Analyze the following prompt and provide a detailed effectiveness assessment.

Prompt:
${prompt}

Usage Data:
- Usage Count: ${usageData.usageCount || 0}
- Average Rating: ${usageData.averageRating || 'N/A'}
- Common Issues: ${usageData.commonIssues || 'None reported'}

Please provide:
1. **Effectiveness Score** (1-10): Rate how effective this prompt is likely to be
2. **Strengths**: What makes this prompt good
3. **Weaknesses**: Areas for improvement
4. **Suggestions**: Specific recommendations for optimization
5. **Best Use Cases**: When this prompt would work well
6. **Potential Issues**: What might go wrong

Analysis:`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert prompt analyst who provides detailed, actionable feedback on prompt effectiveness.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const analysis = data.choices[0]?.message?.content;

    if (!analysis) {
      throw new Error('No analysis received from API');
    }

    return analysis;
  } catch (error) {
    console.error('Error analyzing prompt:', error);
    throw new Error(`Failed to analyze prompt: ${error.message}`);
  }
};

export const generatePromptVariations = async (originalPrompt, variationType = 'alternative') => {
  try {
    if (!process.env.REACT_APP_OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    const variationPrompts = {
      alternative: 'Provide 3 alternative versions of this prompt that achieve the same goal but use different approaches.',
      simplified: 'Provide 2 simplified versions of this prompt that are easier to understand and use.',
      detailed: 'Provide 2 more detailed versions of this prompt with additional context and examples.',
      specialized: 'Provide 3 specialized versions of this prompt for different use cases or audiences.'
    };

    const variationPrompt = `Generate ${variationPrompts[variationType] || variationPrompts.alternative}

Original prompt:
${originalPrompt}

Please provide the variations in a clear, numbered format with brief explanations of how each variation differs from the original.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert prompt engineer who creates effective variations of prompts for different use cases.'
          },
          {
            role: 'user',
            content: variationPrompt
          }
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const variations = data.choices[0]?.message?.content;

    if (!variations) {
      throw new Error('No variations received from API');
    }

    return variations;
  } catch (error) {
    console.error('Error generating prompt variations:', error);
    throw new Error(`Failed to generate variations: ${error.message}`);
  }
};

export const validatePrompt = async (prompt) => {
  try {
    if (!process.env.REACT_APP_OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    const validationPrompt = `Validate the following prompt and provide feedback on its quality and potential issues.

Prompt:
${prompt}

Please check for:
1. **Clarity**: Is the prompt clear and unambiguous?
2. **Completeness**: Does it provide all necessary information?
3. **Specificity**: Are the instructions specific enough?
4. **Bias**: Are there any potential biases or assumptions?
5. **Safety**: Are there any safety concerns?
6. **Effectiveness**: Will this prompt likely produce the desired result?

Provide a validation report with:
- Overall score (1-10)
- Issues found (if any)
- Recommendations for improvement
- Safety considerations`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a prompt validation expert who ensures prompts are safe, effective, and well-structured.'
          },
          {
            role: 'user',
            content: validationPrompt
          }
        ],
        temperature: 0.2,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const validation = data.choices[0]?.message?.content;

    if (!validation) {
      throw new Error('No validation received from API');
    }

    return validation;
  } catch (error) {
    console.error('Error validating prompt:', error);
    throw new Error(`Failed to validate prompt: ${error.message}`);
  }
}; 