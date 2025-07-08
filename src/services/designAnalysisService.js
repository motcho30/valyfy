export const analyzeDesignImage = async (imageFile) => {
  try {
    // Check if OpenAI API key is available
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key not found. Please set REACT_APP_OPENAI_API_KEY in your environment variables.');
    }

    // Convert image to base64 data URL
    const base64Image = await convertImageToBase64(imageFile);
    
    // Prepare the system prompt for GPT-4o Vision
    const systemPrompt = `You are a senior UX/UI designer and expert in design systems. Analyze the provided design image and extract comprehensive design specifications.

Return your response as a JSON object with this exact structure:
{
  "philosophy": "Overall design philosophy and approach",
  "colors": [
    {"name": "Primary", "hex": "#FFFFFF", "description": "Main background color"},
    {"name": "Secondary", "hex": "#000000", "description": "Text color"}
  ],
  "typography": {
    "primary": "Font family name",
    "headings": {
      "h1": {"size": "32px", "weight": "600", "spacing": "0"},
      "h2": {"size": "24px", "weight": "500", "spacing": "0"},
      "h3": {"size": "18px", "weight": "500", "spacing": "0"}
    },
    "body": {"size": "16px", "weight": "400", "lineHeight": "1.5"}
  },
  "spacing": {
    "baseUnit": "8px",
    "sections": "64px",
    "cards": "24px",
    "buttons": "12px 24px"
  },
  "components": {
    "borderRadius": "8px",
    "shadows": "Description of shadow style",
    "buttons": "Button style description",
    "cards": "Card style description"
  },
  "style": "Brief style description (e.g., Modern Minimalist)",
  "prompt": "Complete design specification prompt for implementation"
}`;

    const userPrompt = `Please analyze this design image and provide a comprehensive design specification. Focus on:

1. **Design Philosophy**: What's the overall approach and aesthetic philosophy?
2. **Color Palette**: Identify ALL colors used - backgrounds, text, accents, borders (provide accurate hex codes)
3. **Typography**: Describe font choices, sizing hierarchy, and text treatments
4. **Layout & Spacing**: How are elements arranged and spaced?
5. **Visual Style**: Overall visual treatment and aesthetic direction
6. **Component Style**: How are buttons, cards, and UI elements styled?

Extract specific technical details that can be used to implement this design system.`;

    // Make direct call to OpenAI API
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
                  url: base64Image,
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

    let analysisText = data.choices[0].message.content;
    
    try {
      // Remove markdown code blocks if present
      analysisText = analysisText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      // Parse the JSON response
      const analysis = JSON.parse(analysisText);
      
      // Generate a design object similar to the existing ones
      const designId = 'custom-' + Date.now();
      const designData = {
        id: designId,
        name: generateDesignName(analysis),
        image: URL.createObjectURL(imageFile), // Use the uploaded image as preview
        description: analysis.style || 'AI-generated from your inspiration',
        prompt: analysis.prompt || analysisText,
        isCustom: true,
        analysis: analysis
      };

      return designData;
      
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', parseError);
      console.error('Raw response:', analysisText);
      
      // Fallback: create design object with raw text
      const designId = 'custom-' + Date.now();
      const designData = {
        id: designId,
        name: 'Custom Design',
        image: URL.createObjectURL(imageFile),
        description: 'AI-generated from your inspiration',
        prompt: analysisText,
        isCustom: true,
        analysis: {
          philosophy: 'Custom design analysis',
          colors: [],
          typography: {
            primary: 'Inter',
            headings: {
              h1: { size: '32px', weight: '600', spacing: '0' },
              h2: { size: '24px', weight: '500', spacing: '0' },
              h3: { size: '18px', weight: '500', spacing: '0' }
            },
            body: { size: '16px', weight: '400', lineHeight: '1.5' }
          },
          spacing: {
            baseUnit: '8px',
            sections: '64px',
            cards: '24px',
            buttons: '12px 24px'
          },
          components: {
            borderRadius: '8px',
            shadows: 'subtle shadows',
            buttons: 'modern button style',
            cards: 'clean card style'
          },
          style: 'Custom Design',
          prompt: analysisText
        }
      };

      return designData;
    }
    
  } catch (error) {
    console.error('Error analyzing design:', error);
    throw error;
  }
};

const convertImageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result); // Return full data URL for OpenAI Vision API
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const extractColorsFromAnalysis = (analysis) => {
  // Extract colors from the analysis object
  if (analysis && analysis.colors && Array.isArray(analysis.colors)) {
    // Convert from array format to object format expected by design system
    const colorsObject = {};
    analysis.colors.forEach((color, index) => {
      const key = color.name ? color.name.toLowerCase().replace(/\s+/g, '') : `color${index}`;
      colorsObject[key] = {
        hex: color.hex || '#000000',
        name: color.name || `Color ${index + 1}`,
        description: color.description || 'Custom color from design analysis'
      };
    });
    return colorsObject;
  }
  
  // Return empty object if no colors found
  return {};
};

export const generateDesignName = (analysis) => {
  // Generate a name based on the analysis
  if (analysis && analysis.style) {
    return analysis.style;
  }
  
  if (analysis && analysis.philosophy) {
    const philosophy = analysis.philosophy.toLowerCase();
    if (philosophy.includes('minimalist') || philosophy.includes('clean')) return 'Clean Minimalist';
    if (philosophy.includes('bold') || philosophy.includes('strong')) return 'Bold Modern';
    if (philosophy.includes('elegant') || philosophy.includes('sophisticated')) return 'Elegant Professional';
    if (philosophy.includes('dark') || philosophy.includes('tech')) return 'Tech Dark';
  }
  
  const adjectives = ['Modern', 'Elegant', 'Bold', 'Minimalist', 'Creative', 'Professional'];
  const nouns = ['Design', 'Style', 'Theme', 'Aesthetic'];
  
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  
  return `${randomAdjective} ${randomNoun}`;
}; 