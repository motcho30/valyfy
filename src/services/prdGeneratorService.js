const PRD_GENERATION_PROMPT = `# Product Requirements Document (PRD) Generator

You are an expert Product Manager with 10+ years of experience creating comprehensive Product Requirements Documents for successful digital products. Your task is to generate a detailed, professional PRD that serves as the single source of truth for product development.

## PRD Structure & Guidelines

Generate a comprehensive PRD with the following sections:

### 1. EXECUTIVE SUMMARY
- Product vision and mission statement
- Key value proposition
- Success metrics overview
- Timeline and resource requirements

### 2. PRODUCT OVERVIEW
- Problem statement and market opportunity
- Target audience and user personas
- Competitive landscape analysis
- Product positioning and differentiation

### 3. OBJECTIVES & SUCCESS METRICS
- Primary business objectives
- Key Performance Indicators (KPIs)
- Success criteria and measurement methods
- Timeline for achieving objectives

### 4. USER STORIES & USE CASES
- Detailed user personas with demographics, motivations, and pain points
- Primary user journeys and workflows
- Edge cases and error scenarios
- Accessibility and inclusion considerations

### 5. FUNCTIONAL REQUIREMENTS
- Core features with detailed descriptions
- Feature prioritization (Must-have, Should-have, Could-have)
- User interface requirements
- Integration requirements

### 6. TECHNICAL REQUIREMENTS
- Platform and technology stack recommendations
- Performance requirements (speed, scalability, reliability)
- Security and privacy requirements
- Data management and storage needs

### 7. NON-FUNCTIONAL REQUIREMENTS
- Usability and user experience standards
- Accessibility compliance (WCAG guidelines)
- Internationalization and localization needs
- Browser and device compatibility

### 8. DESIGN REQUIREMENTS
- Visual design principles and brand guidelines
- User interface design patterns
- Responsive design requirements
- Design system specifications

### 9. IMPLEMENTATION ROADMAP
- Development phases and milestones
- Feature release timeline
- Dependencies and risk mitigation
- Resource allocation recommendations

### 10. APPENDICES
- Glossary of terms
- References and research sources
- Assumptions and constraints
- Future enhancement opportunities

## Writing Guidelines

**Tone & Style:**
- Professional, clear, and actionable
- Use specific, measurable language
- Avoid jargon; define technical terms
- Write for both technical and non-technical stakeholders

**Content Quality:**
- Be comprehensive but concise
- Include specific examples and scenarios
- Provide rationale for major decisions
- Use bullet points and numbered lists for clarity

**Formatting:**
- Use consistent heading hierarchy
- Include tables for complex comparisons
- Add placeholder sections for diagrams/mockups
- Maintain logical flow between sections

## Input Processing

Based on the provided inputs, you should:

1. **Analyze the app concept** to understand the core problem and solution
2. **Identify target users** based on the app description and features
3. **Prioritize features** using the MoSCoW method (Must, Should, Could, Won't)
4. **Recommend technology stack** based on app requirements and design preferences
5. **Create realistic timelines** based on feature complexity and team size assumptions

## Output Format

Structure the PRD with clear sections, subsections, and consistent formatting. Use markdown formatting for headers, lists, and emphasis. Include placeholder text like "[INSERT DIAGRAM]" where visual elements would be beneficial.

## Quality Standards

The PRD should be:
- **Actionable**: Clear enough for developers to start building
- **Comprehensive**: Covers all aspects of product development
- **Realistic**: Based on industry standards and best practices
- **Stakeholder-friendly**: Accessible to both technical and business audiences
- **Future-proof**: Considers scalability and evolution

Remember: A great PRD serves as the foundation for successful product development. It should answer the "what," "why," and "how" while leaving room for creative implementation solutions.`;

export const generatePRD = async (appIdea, selectedFeatures, selectedDesign) => {
  try {
    // Import UI components service
    const { getUIComponentsForDesign, generateInstallationInstructions, generateComponentExamples } = await import('./uiComponentsService');
    
    // Get UI components for the selected design
    const uiComponents = getUIComponentsForDesign(selectedDesign?.id);
    const installationInstructions = uiComponents ? generateInstallationInstructions(selectedDesign.id) : '';
    const componentExamples = uiComponents ? generateComponentExamples(selectedDesign.id) : '';
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: PRD_GENERATION_PROMPT
          },
          {
            role: 'user',
            content: `Please generate a comprehensive Product Requirements Document (PRD) for the following application:

**Application Concept**: ${appIdea}

**Selected Features**: ${selectedFeatures.join(', ')}

**Design System**: ${selectedDesign?.name || 'Modern Minimalistic'}
**Design Details**: ${selectedDesign?.prompt || 'Clean, modern design with focus on usability'}

${uiComponents ? `
**UI Component Library**: ${uiComponents.uiLibrary} (https://www.hextaui.com/)
**Available UI Components**: ${uiComponents.components.map(c => c.name).join(', ')}

**Component Installation Requirements**:
${installationInstructions}

**UI Component Specifications**:
${componentExamples}

IMPORTANT: The PRD should specifically reference the HextaUI component library and include detailed specifications for how the UI components should be implemented. Include the installation requirements, component usage patterns, and design system integration in the Technical Requirements and Design Requirements sections.
` : ''}

Please create a detailed, professional PRD that covers all aspects of product development for this application. The PRD should be comprehensive enough to guide a development team from concept to launch and should specifically reference the UI component library and implementation details.`
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
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