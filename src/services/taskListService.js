export const generateTaskList = async (project) => {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key is not configured');
  }

  const prompt = `You are an expert software architect and project manager. Generate a comprehensive development task list for the following project:

**Project Name:** ${project.name}
**Project Type:** ${project.type}
**Framework:** ${project.framework || 'Not specified'}
**Description:** ${project.description}
**Features:** ${(project.features || project.selectedFeatures || []).join(', ')}

Create a detailed markdown task list following this EXACT structure:

# ${project.name} - Development Task List

${project.description}

## Completed Tasks

- [x] Initial project setup and configuration
- [x] Project structure planning

## In Progress Tasks

- [ ] [Add 2-3 high-priority tasks that should be worked on first]

## Future Tasks

- [ ] [Add 8-12 specific, actionable tasks covering all aspects of development]

## Implementation Plan

[Provide a detailed 2-3 paragraph implementation strategy covering architecture, tech stack, development phases, and deployment considerations]

### Relevant Files

- [List 6-10 key files that will be created/modified with their purposes]

**Requirements:**
1. Make tasks specific and actionable (not vague)
2. Include both frontend and backend tasks if applicable
3. Cover testing, deployment, and documentation
4. Order tasks by logical development sequence
5. Include file paths that make sense for the project type and framework
6. Each task should be 1-2 lines maximum
7. Implementation plan should be practical and detailed
8. Relevant files should include realistic file paths and clear descriptions

Generate the markdown content exactly as requested, starting with the main heading.`;

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
            content: 'You are an expert software architect and project manager. Generate comprehensive, actionable development task lists in markdown format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const taskList = data.choices[0]?.message?.content;

    if (!taskList) {
      throw new Error('No task list generated from OpenAI response');
    }

    return taskList.trim();
  } catch (error) {
    console.error('Error generating task list:', error);
    throw error;
  }
}; 