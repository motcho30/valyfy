// Feature Extraction Service
// This service handles API calls to extract and suggest features using GPT

const FEW_SHOT_PROMPT = `You are an expert software engineer and product manager. Your task is to analyze a user's application idea and break it down into a list of actionable, implementable features.

**Instructions:**
1.  Read the user's description carefully.
2.  Extract a list of core features. These should be specific functionalities a developer would build.
    -   **Good Example:** "User Authentication", "Product Search Bar", "Shopping Cart Management"
    -   **Bad Example:** "Users", "Products", "E-commerce"
3.  Suggest a list of additional, valuable features that would complement the user's idea.
4.  Keep all feature names concise (2-4 words).
5.  Format your response as a single, clean JSON object with two keys: "extracted_features" and "suggested_features". Do not include any other text or formatting.

**Example 1: Travel App**
Input: "I want to build an AI travel planner generator for users that want to travel"
Output:
{
  "extracted_features": [
    "AI Trip Planner",
    "Itinerary Generation",
    "Destination Suggestions"
  ],
  "suggested_features": [
    "Budget Tracking",
    "Weather Forecasts",
    "Flight & Hotel Booking",
    "Local Attraction Finder",
    "Multi-day Itineraries",
    "Travel Document Storage",
    "Group Travel Planning",
    "Currency Converter"
  ]
}

**Example 2: E-commerce Platform**
Input: "I need a marketplace where people can sell handmade crafts with a rating system"
Output:
{
  "extracted_features": [
    "Handmade Craft Marketplace",
    "Seller Profiles",
    "Product Ratings & Reviews",
    "Product Listing Creation"
  ],
  "suggested_features": [
    "Secure Payment Gateway",
    "Shopping Cart",
    "Advanced Search & Filters",
    "Seller Verification",
    "Favorite Items/Sellers",
    "Custom Order Requests",
    "Inventory Management",
    "Direct Buyer-Seller Messaging"
  ]
}

**Example 3: Fitness Application**
Input: "Create a workout tracker that uses AI to suggest exercises based on user goals"
Output:
{
  "extracted_features": [
    "Workout Logging",
    "AI Exercise Recommendations",
    "User Fitness Goals"
  ],
  "suggested_features": [
    "Progress Visualization",
    "Exercise Video Library",
    "Rest Day Scheduling",
    "Calorie Tracking",
    "Personal Record Tracking",
    "Wearable Device Sync",
    "Social Sharing",
    "Nutrition Suggestions"
  ]
}

Now, analyze the following description and provide the JSON output:`;

export const extractFeatures = async (appDescription, useRealAPI = false) => {
  if (useRealAPI) {
    return await callOpenAIAPI(appDescription);
  } else {
    return await simulateFeatureExtraction(appDescription);
  }
};

// Real OpenAI API call (requires API key)
const callOpenAIAPI = async (appDescription) => {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key not found. Please set REACT_APP_OPENAI_API_KEY in your environment variables.');
  }

  const prompt = `${FEW_SHOT_PROMPT}\n${appDescription}`;

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
            content: 'You are a feature extraction expert. Respond only with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse JSON response
    const result = JSON.parse(content);
    return result;
  } catch (error) {
    console.error('OpenAI API error:', error);
    // Fallback to simulation
    return await simulateFeatureExtraction(appDescription);
  }
};

// Simulated feature extraction (for demo purposes)
const simulateFeatureExtraction = async (input) => {
  // Add realistic delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  const lowercaseInput = input.toLowerCase();
  
  // Common extracted features based on keywords
  const extracted = [];
  const suggested = [];

  // Extract features based on keywords
  if (lowercaseInput.includes('travel') || lowercaseInput.includes('trip')) {
    extracted.push('Travel planning', 'Destination selection');
    if (lowercaseInput.includes('ai')) extracted.push('AI-powered recommendations');
    suggested.push(...['Budget tracking', 'Weather integration', 'Hotel booking', 'Flight booking', 'Local attractions finder', 'Itinerary optimization', 'Currency converter', 'Travel checklist']);
  }
  
  if (lowercaseInput.includes('marketplace') || lowercaseInput.includes('sell') || lowercaseInput.includes('buy')) {
    extracted.push('Product listings', 'User accounts');
    if (lowercaseInput.includes('rating') || lowercaseInput.includes('review')) extracted.push('Rating system');
    suggested.push(...['Payment processing', 'Shopping cart', 'Search filters', 'Seller profiles', 'Order management', 'Shipping calculator', 'Product galleries']);
  }
  
  if (lowercaseInput.includes('workout') || lowercaseInput.includes('fitness') || lowercaseInput.includes('exercise')) {
    extracted.push('Workout tracking', 'Exercise database');
    if (lowercaseInput.includes('ai')) extracted.push('AI exercise suggestions');
    suggested.push(...['Progress charts', 'Exercise videos', 'Calorie tracking', 'Goal setting', 'Workout plans', 'Social sharing', 'Wearable integration']);
  }
  
  if (lowercaseInput.includes('quiz') || lowercaseInput.includes('test') || lowercaseInput.includes('education') || lowercaseInput.includes('student')) {
    extracted.push('Quiz system', 'Score tracking');
    if (lowercaseInput.includes('student')) extracted.push('Student accounts');
    suggested.push(...['Multiple question types', 'Timed quizzes', 'Performance analytics', 'Certificates', 'Progress tracking', 'Teacher dashboard', 'Study materials']);
  }
  
  if (lowercaseInput.includes('social') || lowercaseInput.includes('share') || lowercaseInput.includes('community')) {
    extracted.push('User profiles', 'Content sharing');
    if (lowercaseInput.includes('code')) extracted.push('Code snippet sharing');
    suggested.push(...['Following system', 'Comments', 'Likes/reactions', 'Private messaging', 'Content moderation', 'Search functionality', 'Notifications']);
  }
  
  if (lowercaseInput.includes('todo') || lowercaseInput.includes('task') || lowercaseInput.includes('productivity')) {
    extracted.push('Task management', 'Task lists');
    if (lowercaseInput.includes('sync')) extracted.push('Cross-device sync');
    suggested.push(...['Task prioritization', 'Due dates', 'Reminders', 'Categories', 'Subtasks', 'Collaboration', 'Calendar view', 'Offline mode']);
  }

  // Generic features if nothing specific detected
  if (extracted.length === 0) {
    extracted.push('User authentication', 'Data management', 'User interface');
    suggested.push(...['User profiles', 'Search functionality', 'Notifications', 'Mobile responsiveness', 'Data export', 'Settings management', 'Help documentation']);
  }

  // Add common suggestions for all apps
  suggested.push(...['Dark mode', 'Email notifications', 'User onboarding', 'Data backup', 'Analytics dashboard']);
  
  // Remove duplicates and limit suggestions
  const uniqueSuggested = [...new Set(suggested)].slice(0, 12);
  
  return {
    extracted_features: [...new Set(extracted)],
    suggested_features: uniqueSuggested
  };
}; 