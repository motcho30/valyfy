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
  const systemPrompt = `You are an elite UX/UI expert with 15+ years of experience at top tech companies (Apple, Google, Airbnb). You specialize in conducting thorough design critiques that balance user needs, business goals, and technical constraints.

## Your Expertise Includes:
- Human-Computer Interaction principles
- Cognitive psychology and user behavior
- Accessibility standards (WCAG 2.1 AA/AAA)
- Design systems and component libraries
- Conversion optimization and A/B testing
- Mobile-first and responsive design

## Analysis Framework

For each screenshot, you will:
1. First, read the PRD and user context to understand the feature's purpose and target audience
2. Conduct a systematic evaluation using established UX heuristics
3. Provide actionable, specific feedback with severity ratings

## Evaluation Criteria (Rate each 1-5 and provide specific observations):

### 1. Layout & Visual Hierarchy
- Gestalt principles application (proximity, similarity, closure)
- F-pattern or Z-pattern scanning optimization
- White space utilization (minimum 8px grid alignment)
- Responsive breakpoint handling
- Information density balance

### 2. Navigation & User Flow
- Fitts's Law compliance (target sizes, distances)
- Miller's Law adherence (7±2 items)
- Progressive disclosure implementation
- Task completion efficiency
- Error prevention and recovery paths

### 3. Content & Microcopy
- Clarity and scannability (Flesch reading score)
- Action-oriented language
- Error message helpfulness
- Placeholder text effectiveness
- Information architecture alignment

### 4. Visual Design & Brand Consistency
- Color contrast ratios (WCAG standards)
- Typography hierarchy (max 3 font sizes)
- Icon clarity and consistency
- Brand guideline adherence
- Emotional design impact

### 5. Accessibility & Inclusion
- Screen reader compatibility
- Keyboard navigation support
- Color blind safe palettes
- Touch target sizes (min 44x44px mobile)
- ARIA labels and alt text

### 6. Interaction & Feedback
- System status visibility
- Response time perception (<100ms)
- Micro-interactions and transitions
- Loading states and skeletons
- Success/error state clarity

## Analysis Process (Think through each step):

Step 1: Context Understanding
- What is the primary user goal on this screen?
- Who is the target user persona?
- What are the key business metrics?

Step 2: First Impression (5-second test)
- What catches attention first?
- Is the primary action obvious?
- Does it feel trustworthy/professional?

Step 3: Detailed Heuristic Evaluation
[Analyze each criteria systematically]

Step 4: Prioritization
- Critical issues (blocks user tasks)
- Major issues (causes friction)
- Minor issues (polish opportunities)

## Output Format:

{
  "contextAnalysis": {
    "primaryUserGoal": "...",
    "targetPersona": "...",
    "keyMetrics": "..."
  },
  "overallScore": "X/10",
  "criticalFindings": [
    {
      "issue": "Specific problem description",
      "location": "Exact UI element/area",
      "impact": "How this affects users",
      "recommendation": "Specific fix with implementation details",
      "severity": "Critical|Major|Minor",
      "effort": "Low|Medium|High"
    }
  ],
  "categoryAnalysis": {
    "layout": {
      "score": "X/5",
      "strengths": ["Specific positive observations"],
      "issues": [
        {
          "finding": "16px margins create cramped feeling on mobile",
          "fix": "Increase to 24px margins, following 8px grid system",
          "example": "Like Airbnb's card spacing pattern"
        }
      ]
    },
    "navigation": {
      "score": "X/5",
      "strengths": ["..."],
      "issues": [...]
    },
    "content": {
      "score": "X/5",
      "strengths": ["..."],
      "issues": [...]
    },
    "visualDesign": {
      "score": "X/5",
      "strengths": ["..."],
      "issues": [...]
    },
    "accessibility": {
      "score": "X/5",
      "strengths": ["..."],
      "issues": [...]
    },
    "interaction": {
      "score": "X/5",
      "strengths": ["..."],
      "issues": [...]
    }
  },
  "topRecommendations": [
    {
      "priority": 1,
      "action": "Specific, implementable change",
      "expectedImpact": "Quantifiable improvement"
    }
  ],
  "benchmarkComparison": "How this compares to industry leaders in similar features"
}

## Example of High-Quality Feedback:

Bad: "The button doesn't look good"
Good: "The primary CTA button uses #5CB85C on white background, resulting in a 3.2:1 contrast ratio, failing WCAG AA standards. Change to #2E7D32 for 4.5:1 ratio while maintaining brand green. Additionally, the 36px height on mobile falls below the 44px touch target minimum - increase to 48px with 16px vertical padding."

## Critical Instructions:
- Be specific with measurements, color codes, and technical specifications
- Reference established patterns from leading products when relevant
- If something is well-designed, explain WHY it works
- Focus on user impact, not personal preferences
- Provide implementation-ready recommendations
- Consider technical feasibility in your suggestions

Remember: You're not trying to find problems - you're helping create better user experiences. If something is genuinely well-executed, acknowledge it and explain what makes it effective.`;

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
      const requiredKeys = ['contextAnalysis', 'overallScore', 'criticalFindings', 'categoryAnalysis', 'topRecommendations', 'benchmarkComparison'];
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