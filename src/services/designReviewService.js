// This service will handle API calls related to design review and feedback.

/**
 * Gets AI-powered feedback for a given design screenshot using OpenAI GPT-4 Vision API.
 *
 * @param {string} image - Base64 encoded image string.
 * @param {string} scope - User-defined scope or objectives for the review.
 * @param {object} project - The project context (contains details, PRD, etc.).
 * @returns {Promise<object>} A promise that resolves to the feedback data.
 */
export const getDesignFeedback = async (image, scope, project) => {
  console.log('Requesting design feedback for project:', project?.name);
  console.log('Scope:', scope);

  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key not found. Please set REACT_APP_OPENAI_API_KEY in your environment variables.');
  }

  // Create the system prompt for structured UI/UX feedback
  const systemPrompt = `You are a world-class senior UX/UI designer, known for your honest and direct feedback. Your goal is to provide **genuine, high-impact feedback** to help developers improve their designs. Do not invent issues just to fill out sections.

Analyze the provided screenshot and evaluate it based on the following categories:
1. Layout & Spacing
2. Navigation & Flow
3. Content & Clarity
4. Visual Design & Branding
5. Accessibility
6. Interaction & Feedback

For each category, provide your expert assessment.
- **If you identify a real area for improvement,** provide a clear, actionable comment with specific recommendations. Explain *why* it's a problem and *how* to fix it.
- **If a category is well-executed and doesn't need significant changes,** explicitly state that and briefly explain what is done well. For example: "No significant issues found. The visual hierarchy is clear and effective."
- Prioritize feedback that will have the most significant positive impact on the user experience. Avoid nitpicking minor stylistic preferences.


Return your response as a JSON object with this exact structure:
{
  "layout": {
    "title": "Layout & Spacing",
    "comment": "Your expert assessment here..."
  },
  "navigation": {
    "title": "Navigation & Flow", 
    "comment": "Your expert assessment here..."
  },
  "content": {
    "title": "Content & Clarity",
    "comment": "Your expert assessment here..."
  },
  "visualDesign": {
    "title": "Visual Design & Branding",
    "comment": "Your expert assessment here..."
  },
  "accessibility": {
    "title": "Accessibility",
    "comment": "Your expert assessment here..."
  },
  "interaction": {
    "title": "Interaction & Feedback",
    "comment": "Your expert assessment here..."
  }
}`;

  // Create the user prompt with context
  let userPrompt = `Please analyze this UI/UX design screenshot and provide structured feedback based on your expert assessment.`;
  
  if (project?.name) {
    userPrompt += ` This is for a project called "${project.name}".`;
  }
  
  if (project?.description) {
    userPrompt += ` Project description: ${project.description}`;
  }
  
  if (scope) {
    userPrompt += ` Specific scope/objectives for this review: ${scope}`;
  }
  
  userPrompt += ` Please focus on actionable improvements and best practices, but also highlight what is done well.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: userPrompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: image,
                  detail: 'high'
                }
              }
            ]
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from OpenAI API');
    }

    let feedbackText = data.choices[0].message.content;
    
    try {
      // Remove markdown code blocks if present
      feedbackText = feedbackText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      // Parse the JSON response
      const feedback = JSON.parse(feedbackText);
      
      // Validate the response structure
      const requiredKeys = ['layout', 'navigation', 'content', 'visualDesign', 'accessibility', 'interaction'];
      const missingKeys = requiredKeys.filter(key => !feedback[key]);
      
      if (missingKeys.length > 0) {
        console.warn('Missing keys in feedback:', missingKeys);
      }
      
      return {
        success: true,
        feedback: feedback
      };
      
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', parseError);
      console.error('Raw response:', feedbackText);
      
      // Fallback: return a general error with the raw text
      return {
        success: false,
        message: 'Failed to parse AI feedback. Please try again.'
      };
    }
    
  } catch (error) {
    console.error('OpenAI API error:', error);
    
    if (error.message.includes('API key')) {
      return {
        success: false,
        message: 'OpenAI API key is not configured or invalid. Please check your environment variables.'
      };
    }
    
    return {
      success: false,
      message: error.message || 'Failed to get design feedback. Please try again.'
    };
  }
}; 