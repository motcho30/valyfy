import { getPMResponse } from './productManagerService';

const DIAGRAM_SYSTEM_PROMPT = `You are an expert in software engineering and user flow design. Your task is to generate a user flow diagram in Mermaid.js syntax.

**Instructions:**
1.  Analyze the user's project context (name, description, features).
2.  Create a logical, clear user flow diagram representing how a user would navigate through the key features.
3.  The diagram must be in Mermaid's 'graph TD' (Top-Down) format.
4.  Keep the diagram clear and concise. Use short, descriptive labels for nodes and arrows.
5.  Do not include any other text, explanations, or markdown formatting. Your entire response must be only the Mermaid syntax.

**Example:**
For a project with features like "User Auth", "Dashboard", "Create Project", your output should look like this:

graph TD
    A[Start] --> B{User Authentication};
    B --> C[Dashboard];
    C --> D[Create New Project];
    D --> E[View Project Details];
    C --> F[View Existing Projects];
`;

export const generateUserFlowDiagram = async (project) => {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OpenAI API key not found.');
  }

  const userMessage = `Generate a user flow diagram for the following project:\n\nName: ${project.name}\nDescription: ${project.description}\nFeatures: ${(project.features || project.selectedFeatures || []).join(', ')}`;

  const messages = [
    { role: 'system', content: DIAGRAM_SYSTEM_PROMPT },
    { role: 'user', content: userMessage }
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
        temperature: 0.3,
        max_tokens: 800,
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    let diagramSyntax = data.choices[0].message.content;

    // Clean up the response to ensure it's valid Mermaid syntax
    diagramSyntax = diagramSyntax.replace(/```mermaid/g, '').replace(/```/g, '').trim();

    return diagramSyntax;

  } catch (error) {
    console.error('Error generating diagram from OpenAI:', error);
    throw error;
  }
};

const REACT_FLOW_SYSTEM_PROMPT = `You are an expert in software architecture and user flow design. Your task is to generate a JSON object representing a user flow diagram for React Flow.

**Instructions:**
1.  Analyze the user's project context (name, description, features).
2.  Create a logical user flow with nodes and edges.
3.  The output **must** be a single, valid JSON object containing two keys: "nodes" and "edges". Do not include any other text, explanations, or markdown formatting.
4.  For each node, provide:
    -   \`id\`: A unique string identifier (e.g., '1', '2').
    -   \`type\`: Use 'input' for the start node, 'output' for end nodes, and 'default' for all others.
    -   \`data\`: An object with a \`label\` key for the node's text.
    -   \`position\`: An object with \`x\` and \`y\` coordinates. Arrange the nodes in a logical top-to-bottom layout. Start at x: 250, y: 5 and increment y by 100-150 for each new row.
5.  For each edge, provide:
    -   \`id\`: A unique string identifier (e.g., 'e1-2').
    -   \`source\`: The \`id\` of the source node.
    -   \`target\`: The \`id\` of the target node.
    -   \`animated\`: Set to \`true\`.

**Example JSON Output:**
{
  "nodes": [
    { "id": "1", "type": "input", "data": { "label": "User Lands on Page" }, "position": { "x": 250, "y": 5 } },
    { "id": "2", "data": { "label": "User Authentication" }, "position": { "x": 250, "y": 100 } },
    { "id": "3", "data": { "label": "Dashboard" }, "position": { "x": 250, "y": 200 } }
  ],
  "edges": [
    { "id": "e1-2", "source": "1", "target": "2", "animated": true },
    { "id": "e2-3", "source": "2", "target": "3", "animated": true }
  ]
}
`;

export const generateReactFlowData = async (project) => {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
  if (!apiKey) throw new Error('OpenAI API key not found.');

  const userMessage = `Generate a React Flow JSON for the following project:\n\nName: ${project.name}\nDescription: ${project.description}\nFeatures: ${(project.features || project.selectedFeatures || []).join(', ')}`;
  
  const messages = [
    { role: 'system', content: REACT_FLOW_SYSTEM_PROMPT },
    { role: 'user', content: userMessage }
  ];

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: 0.3,
        max_tokens: 1500,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const content = JSON.parse(data.choices[0].message.content);
    
    // Basic validation
    if (!content.nodes || !content.edges) {
        throw new Error("Invalid JSON structure received from AI.");
    }

    return content;

  } catch (error) {
    console.error('Error generating React Flow data from OpenAI:', error);
    throw error;
  }
}; 