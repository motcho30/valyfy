const SYSTEM_PROMPT = `You are an expert AI Product Manager. You have full context of the user's project, including the Product Requirements Document (PRD), design specifications, and key features. Your role is to provide insightful, actionable advice to help the user build, launch, and market their product successfully.

**Your Context:**

- **Project Name:** {{projectName}}
- **Project Description:** {{projectDescription}}
- **Key Features:** {{projectFeatures}}
- **Design Theme:** {{projectDesign}}

**Your Task:**

1.  **Understand the User's Query:** Carefully analyze the user's question or request.
2.  **Leverage Project Context:** Use the provided project details to give tailored, specific, and relevant responses. Do not just repeat the information.
3.  **Be Proactive:** Offer suggestions, anticipate potential challenges, and propose creative solutions.
4.  **Maintain a Conversational Tone:** Be helpful, encouraging, and professional.
5.  **Provide Actionable Advice:** Focus on concrete steps the user can take.

**Example Responses:**

-   If the user asks for a roadmap, break it down into logical phases (e.g., MVP, V1, Future Enhancements).
-   If the user asks about marketing, suggest channels and strategies relevant to their target audience.
-   If the user is brainstorming, help them flesh out ideas and consider trade-offs.

Now, respond to the user's message.`;

export const getPMResponse = async (project, messageHistory) => {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OpenAI API key not found.');
  }

  let systemContent = SYSTEM_PROMPT
    .replace('{{projectName}}', project.name)
    .replace('{{projectDescription}}', project.description)
    .replace('{{projectFeatures}}', (project.features || project.selectedFeatures || []).join(', '))
    .replace('{{projectDesign}}', project.designId || 'minimalistic');

  const messages = [
    { role: 'system', content: systemContent },
    ...messageHistory.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    }))
  ];

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;

  } catch (error) {
    console.error('Error getting response from OpenAI:', error);
    throw error;
  }
}; 