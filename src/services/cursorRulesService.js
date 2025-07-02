const CURSOR_RULES_PROMPT = `# Cursor Rules File Generator

You are an expert Cursor AI configuration architect specializing in creating MDC (Markdown Domain Configuration) rules files. Your task is to generate a comprehensive set of cursor rules files that will guide an AI coding assistant for a specific project.

## Understanding Cursor Rules

Cursor rules are persistent, project-specific instructions stored in \`.cursor/rules/\` directory as \`.mdc\` files. They control how Cursor AI behaves when generating code, interpreting edits, and helping with workflows. Rules provide consistent guidance by being included at the start of the model context.

### MDC File Format
Each rule file uses this structure:
\`\`\`
---
description: Brief description of what this rule does
globs: ["**/*.tsx", "**/*.ts"]  # Optional: file patterns for Auto Attached rules
alwaysApply: false  # Optional: whether to always include this rule
---

[Markdown content with instructions, examples, and referenced files]
\`\`\`

### Rule Types
- **Always**: Included in every AI interaction (use sparingly)
- **Auto Attached**: Activated when files matching glob patterns are referenced
- **Agent Requested**: AI decides when to use based on description (requires description field)
- **Manual**: Only included when explicitly mentioned using @ruleName

## Your Task

Generate a complete set of cursor rules files based on:
1. **Application Concept**: [Will be provided by user]
2. **Design System**: [Will be provided by user]

## Instructions for Rule Generation

### 1. Analyze Requirements
- Identify key technical areas that need guidance
- Determine appropriate rule types for each area
- Plan rule organization and scope

### 2. Generate Multiple Focused Rules
Create 4-7 separate \`.mdc\` rule files, each addressing specific concerns:

#### Required Rules to Generate:

**\`project-overview.mdc\`** (Agent Requested)
\`\`\`
---
description: High-level project architecture and core principles
alwaysApply: false
---
\`\`\`
- Project description and core functionality
- Technology stack decisions
- Architecture patterns
- Key dependencies

**\`design-system.mdc\`** (Auto Attached)
\`\`\`
---
description: Design system implementation guidelines
globs: ["**/*.tsx", "**/*.jsx", "**/*.css"]
alwaysApply: false
---
\`\`\`
- Complete design system specifications
- Component styling rules
- Color palette, typography, spacing
- Animation and interaction patterns
- **CRITICAL**: If UI component documentation is provided, include the complete component implementations, installation commands, import statements, usage examples, and theming configuration directly in this file. The full TypeScript/JavaScript code for each component must be included with proper syntax highlighting.

**\`component-patterns.mdc\`** (Auto Attached)
\`\`\`
---
description: React component structure and patterns
globs: ["**/components/**/*.tsx", "**/components/**/*.jsx"]
alwaysApply: false
---
\`\`\`
- Component file structure
- Props and state patterns
- Naming conventions
- Example component templates

**\`api-standards.mdc\`** (Auto Attached) - if applicable
\`\`\`
---
description: API design and implementation standards
globs: ["**/api/**/*", "**/services/**/*"]
alwaysApply: false
---
\`\`\`
- API structure and patterns
- Error handling
- Validation approaches
- Response formats

**\`code-style.mdc\`** (Always)
\`\`\`
---
description: Core coding standards and conventions
alwaysApply: true
---
\`\`\`
- Naming conventions
- File organization
- Import ordering
- Comment standards

**\`ui-components.mdc\`** (Auto Attached) - if UI components are provided
\`\`\`
---
description: UI component library implementation guide
globs: ["**/components/**/*.tsx", "**/components/**/*.jsx", "**/*.tsx", "**/*.jsx"]
alwaysApply: false
---
\`\`\`
- Complete component source code implementations
- Installation and setup instructions  
- Import statements and usage patterns
- Component variants, props, and examples
- Theming and customization guidelines
- **MUST include the exact TypeScript/JavaScript code provided in the UI component documentation**

**CRITICAL INSTRUCTION FOR UI COMPONENTS**: When UI component documentation is provided in the user input, you MUST create a dedicated ui-components.mdc file that includes:
1. The complete, exact TypeScript/JavaScript source code for each component
2. All installation commands (npm install, CLI commands)
3. All import statements and usage examples
4. Component variants, props interfaces, and styling options
5. Theming configuration and CSS variables
6. The content should be copied exactly as provided, with proper markdown code block formatting

This is essential for providing developers with ready-to-use, production-quality component implementations.

**ABSOLUTELY CRITICAL**: DO NOT SUMMARIZE, TRUNCATE, OR PARAPHRASE THE UI COMPONENT CONTENT. Include the complete source code exactly as provided in the input. The ui-components.mdc file should contain the full TypeScript implementations, not abbreviated versions. If the user provides 500 lines of component code, include all 500 lines. If they provide 9 usage examples, include all 9 examples. Copy the content verbatim.

**SPECIAL INSTRUCTION FOR UI-COMPONENTS.MDC**: When UI component documentation is provided in the user input, this file must contain the complete, unabridged component implementations. Do not use "// Rest of component code..." or similar abbreviations. Copy every single line of the provided component documentation into this file.

### 3. Rule Content Guidelines

For each rule file:
- Start with a clear purpose statement
- Use imperative commands (MUST, SHOULD, NEVER)
- Include concrete examples
- Reference template files using @filename syntax when helpful
- Keep each rule under 500 lines
- Use markdown formatting for clarity

### 4. Best Practices to Follow

- **Be Specific**: Instead of "use good naming", specify "use camelCase for functions, PascalCase for components"
- **Provide Examples**: Show correct and incorrect implementations
- **Stay Focused**: Each rule should address one primary concern
- **Use References**: Include @template-files for boilerplate code
- **Consider Context**: Rules should work together cohesively

## Output Format

Generate each rule as a separate code block with the filename as the header:

\`\`\`mdc
// project-overview.mdc
---
description: Core project architecture and principles
alwaysApply: false
---
[content]
\`\`\`

\`\`\`mdc
// design-system.mdc
---
description: Design system implementation
globs: ["**/*.tsx", "**/*.jsx"]
alwaysApply: false
---
[content]
\`\`\`

[Continue for all rules...]

## Input Format

The user will provide:
1. **Application Name**: [Name]
2. **Application Description**: [Brief description]
3. **Core Features**: [List of main features]
4. **Design System**: [Detailed design system specifications]

Based on this input, generate comprehensive, project-specific cursor rules that will guide consistent, high-quality code generation.

Remember: Focus on "how" to implement (coding standards, patterns, structure) rather than "what" to build (features, requirements). The rules should serve as a technical constitution for the project.

**CRITICAL INSTRUCTION FOR UI COMPONENTS**: When UI component documentation is provided in the user input, you MUST create a dedicated ui-components.mdc file that includes:
1. The complete, exact TypeScript/JavaScript source code for each component
2. All installation commands (npm install, CLI commands)
3. All import statements and usage examples
4. Component variants, props interfaces, and styling options
5. Theming configuration and CSS variables
6. The content should be copied exactly as provided, with proper markdown code block formatting

This is essential for providing developers with ready-to-use, production-quality component implementations.

**ABSOLUTELY CRITICAL**: DO NOT SUMMARIZE, TRUNCATE, OR PARAPHRASE THE UI COMPONENT CONTENT. Include the complete source code exactly as provided in the input. The ui-components.mdc file should contain the full TypeScript implementations, not abbreviated versions. If the user provides 500 lines of component code, include all 500 lines. If they provide 9 usage examples, include all 9 examples. Copy the content verbatim.

**SPECIAL INSTRUCTION FOR UI-COMPONENTS.MDC**: When UI component documentation is provided in the user input, this file must contain the complete, unabridged component implementations. Do not use "// Rest of component code..." or similar abbreviations. Copy every single line of the provided component documentation into this file.

`;

const systemPrompt = `# Cursor Rules File Generator

You are an expert Cursor AI configuration architect specializing in creating MDC (Markdown Domain Configuration) rules files. Your task is to generate a comprehensive set of cursor rules files that will guide an AI coding assistant for a specific project.

## Understanding Cursor Rules

Cursor rules are persistent, project-specific instructions stored in the \`.cursor/rules/\` directory. They control how the AI behaves when generating code, interpreting edits, and helping with workflows by providing consistent guidance.

### MDC File Format
Each rule file is a markdown file (\`.mdc\`) and must start with a metadata block:
\`\`\`
---
description: A concise explanation of what this rule does. Required for 'Agent Requested' rules.
globs: ["**/frontend/**/*.tsx"]  # Optional: file patterns for 'Auto Attached' rules.
alwaysApply: false  # Optional: Set to true for 'Always' rules.
---

[Markdown content with instructions, examples, and referenced files using @filename syntax]
\`\`\`

### Rule Types
You must choose the most appropriate type for each rule you create:
- **Always**: Included in every AI interaction. Use sparingly for universal standards like core code style.
- **Auto Attached**: Activated when a user's prompt references files matching the \`globs\` pattern. Ideal for framework- or language-specific guidance.
- **Agent Requested**: The AI decides when to use this rule based on its \`description\`. Perfect for complex, domain-specific knowledge that isn't always needed.
- **Manual**: Only included when a user explicitly mentions the rule with \`@ruleName\`.

## Your Task

Generate a complete set of 4-7 separate, focused \`.mdc\` rule files based on the user's project description.

### Instructions for Rule Generation

#### 1. Analyze Requirements & Plan
- Identify the key technical areas of the project that need guidance (e.g., frontend components, API services, database interactions, testing).
- Plan a set of distinct rules, giving each a descriptive filename (e.g., \`frontend-components.mdc\`, \`api-standards.mdc\`).
- For each rule, determine the most effective rule type (\`Always\`, \`Auto Attached\`, etc.).

#### 2. Generate Multiple Focused Rules
Create a set of files. Here are some common examples, but you should tailor them to the specific project:

- \`project-overview.mdc\` (Agent Requested): High-level architecture, tech stack, and core principles.
- \`code-style.mdc\` (Always): Universal coding standards, naming conventions, import order.
- \`component-patterns.mdc\` (Auto Attached, e.g., \`globs: ["**/components/**/*.tsx"]\`): React component structure, props/state patterns, styling approach (e.g., "Always use Tailwind CSS").
- \`api-standards.mdc\` (Auto Attached, e.g., \`globs: ["**/services/**/*", "**/api/**/*"]\`): API design, error handling, validation libraries (e.g., "Use Zod for all validation"), response formats.
- \`testing-strategy.mdc\` (Agent Requested): Guidelines for writing tests, preferred frameworks, and what to test.

#### 3. Rule Content Best Practices
- **Be Specific & Actionable**: Instead of "use good naming," write "Function names must be \`camelCase\`. React component names must be \`PascalCase\`."
- **Provide Examples**: Include short, clear code snippets for correct and incorrect implementations.
- **Reference Templates**: For boilerplate, use the \`@filename.tsx\` syntax to refer to a template file the user can create. For example: "New components should follow the structure in \`@component-template.tsx\`."
- **Keep Rules Concise**: Aim for under 500 lines per rule. Each rule should have a single, clear purpose.
- **Use Imperative Language**: Use MUST, SHOULD, and NEVER to make instructions clear.

## Output Format

Generate each rule as a separate markdown code block, with the filename in a comment at the top.

\`\`\`mdc
// project-overview.mdc
---
description: "High-level project architecture, tech stack, and core principles."
alwaysApply: false
---

This project is a [Project Type]. The primary goal is to...
- **Tech Stack**: React, Node.js, Supabase, Tailwind CSS.
- **Architecture**: We follow a standard client-server model...
\`\`\`

\`\`\`mdc
// code-style.mdc
---
description: "Core coding standards and conventions for the entire project."
alwaysApply: true
---

### Naming Conventions
- **Components**: \`PascalCase\` (e.g., \`DataGrid.tsx\`)
- **Functions/Variables**: \`camelCase\` (e.g., \`fetchUserData\`)
- **Types/Interfaces**: \`PascalCase\` with a \`T\` prefix if generic (e.g., \`type UserProfile\`, \`type TItem\`)
\`\`\`
`;

const MINIMALISTIC_DESIGN_SPEC = `# Portable Theme Specs

## 0. Essence / "feel" keywords
• Modern-minimal • Clean enterprise • Calm confidence • UX-first • Data-driven yet friendly

## Global tokens (place these in CSS-variables / Figma Tokens)
### Color
\`\`\`css
--c-black-100: #000000   // primary text & primary button bg
--c-black-80:  #1A1A1A   // hover state
--c-gray-10:  #FFFFFF    // global canvas & cards
--c-gray-20:  #F6F6F7    // alt sections, pills, table rows
--c-gray-30:  #EDEFF1    // hair-line backgrounds
--c-gray-40:  #E5E7EB    // 1 px borders, dividers
--c-gray-60:  #6B7280    // secondary copy
--c-blue-50:  #2E77FF    // links, hover, "NEW" pill text
--c-blue-60:  #1E52E5    // focus rings, selected card outline
--c-green-50: #13C37C    // success badges in table mockups
--c-purple-50:#6366F1    // Attio accent, gradient start
\`\`\`
(Gradients are created by fading any accent into transparent white over 700-900 px)

### Type scale (Inter)
\`\`\`css
--f-xs: 0.75rem;    /* 12px - pills, captions */
--f-sm: 0.875rem;   /* 14px - helper, meta */
--f-base: 1rem;     /* 16px - paragraphs */
--f-lg: 1.25rem;    /* 20px - subcopy lead */
--f-xl: 1.5rem;     /* 24px - section eyebrow or small heading */
--f-2xl: 2.5rem;    /* 40px - section headline (H2) */
--f-4xl: 4.5rem;    /* 72px - hero headline (H1 desktop) */
\`\`\`
Weights: 400 body, 500 UI/text-buttons, 700 headings

### Spacing (8-pt rhythm)
\`\`\`css
--s0: 4px;
--s1: 8px;
--s2: 16px;
--s3: 24px;
--s4: 32px;
--s5: 48px;
--s6: 64px;
--s7: 96px;
\`\`\`

### Shape & effects
\`\`\`css
--radius-sm: 4px;    /* inputs */
--radius-md: 6px;    /* small cards */
--radius-lg: 8px;    /* default screenshots/cards */
--radius-xl: 12px;   /* pricing, large popovers */
--radius-pill: 9999px;
--shadow-xs: 0 1px 2px rgba(0,0,0,.05);
--shadow-sm: 0 2px 6px rgba(0,0,0,.06);
--focus-ring: 0 0 0 2px #1E52E5 inset;
\`\`\`

## Layout model
• Container max-width: 1440px, centered
• Responsive 12-column grid (70px cols / 24px gutters at ≥1280px)
• Section vertical padding desktop: 96px (reduce 25% tablet, 50% mobile)
• Hero & "quote wall" stripes intentionally oversized (min-height 640px)
• Two-column feature = 6/6 split; collapses to stacked at ≤1024px (image below text)
• Auto-fit card grids = repeat(auto-fit, minmax(340px,1fr)); 32px gap

## Component rules
### Navbar
• Height 56px, white background, 1px #E5E7EB bottom border
• Flex row: logo 32×32, primary link list gap 24px (font 14px/500)
• Right slot: ghost "Log in", then primary pill CTA
• Mega-menu (Attio): card panel 288px wide column list + promo column. Panel radius 12px & shadow-sm

### Buttons
• Primary (solid): bg --c-black-100, text white, radius-pill, 0 12 transition on hover; min-height 40px
• Secondary (ghost-outline): transparent bg, 1px #E5E7EB border, text --c-black-100; hover bg --c-gray-20
• Tertiary (text-link): color --c-blue-50, no border
• Icon arrow optional; sits 8px right

### Pills / Badges
• Filled: bg --c-gray-20, text --c-gray-60, radius-pill, 6px × 12px internal
• Outline: transparent bg, 1px solid #E5E7EB
• Status (success etc.) recolor bg to accent and text white

### Inputs
• 32px high, 1px #E5E7EB border, radius-sm, horizontal 8px padding
• Focus adds focus-ring
• Label usually inside placeholder; visible labels align left 4px above

### Cards
• Background white; radius-lg unless pricing (radius-xl)
• Internal padding 32px (pricing 40-48px)
• Border 1px #E5E7EB, shadow none until hover-sm

### Pricing cards
• Grid of 4 @ desktop
• Selected card: outline 2px --c-blue-60 and subtle glow (#E8F0FF)
• Tier name f-xl/700, price 48–56px bold, bullets base-size

### Accordion (FAQ)
• Row 64px closed; grid 1fr auto
• Border-top only; open state: +16px padding and Motion 0.2s ease

### Quote billboard
• 72px heading style text centered, subauthor f-sm --c-gray-60
• Optional subtle dotted background (#E5E7EB 1×1px pattern)

### Metrics grid
• 4-col; each metric has divider-left 1px #E5E7EB except first
• Number f-2xl, label f-sm --c-gray-60

### Tables (product screenshots)
• Light #F6F6F7 row alternation, 12px pill chips for statuses

### Popovers / Mega-menus
• Radius-xl, shadow-sm, arrowless; default width 640px, two equal internal columns with vertical divider (#E5E7EB at 1px)

## Visual language & consistency drivers
• Black-on-white typography = highest contrast, lets accent colours play auxiliary role
• Abundant whitespace + generous section padding for calm rhythm
• Hair-line borders (#E5E7EB) instead of shadows for separation → crisp "wire-frame" look
• All interactive objects are pill-shaped → immediate affordance
• Decorative motifs: • Dashed or dotted "flightpath" SVGs (Notion) • Halftone dot gradients (Attio)
• Typography dictates hierarchy more than colour; only black weight and size change

## Responsive guidelines
### Breakpoints
• Desktop ≥1280px – grid active
• Tablet 1024-1279px – container 1040px; hero H1 drops to 56px; two-column stacks with image last
• Mobile ≤767px – single column; H1 36px; nav turns into hamburger; buttons stretch 100%

### Component adaptations
• Card grids become horizontal scroll-snap container at mobile
• Pricing cards switch to 1-col stacked with top margin 24px
• Metrics grid → 2-col at ≤640px, 1-col at ≤400px

## Build checklist for engineers / design-AI
### Atoms
☐ Colour tokens & semantic aliases (bg-surface, text-primary, border-subtle…)
☐ Type scale, weight map, letter-spacing presets
☐ Spacing scale utility classes
☐ Radius & shadow utility classes

### Molecules
☐ Button (solid / outline / text)
☐ Pill / Badge
☐ Input (text + select)
☐ Divider (horizontal, vertical)

### Organisms
☐ Navbar + mega-menu
☐ HeroBlock (eye-brow, H1, lead, CTA list)
☐ TwoColumnFeature (prop reverse)
☐ Card (generic)
☐ MetricsGrid
☐ PricingGrid
☐ AccordionList
☐ TestimonialBillboard
`;

export const generateCursorRules = async (appIdea, selectedFeatures, selectedDesign) => {
  try {
    console.log('Generating cursor rules for:', { appIdea, selectedFeatures, selectedDesign });
    
    let generatedContent = CURSOR_RULES_PROMPT;
    
    // Add design system content based on selection
    if (selectedDesign === 'minimalistic') {
      console.log('Adding minimalistic design specifications...');
      generatedContent += `\n\n## Design System Implementation\n${MINIMALISTIC_DESIGN_SPEC}`;
      
      // Read and append UI guidance content
      try {
        console.log('Reading UI guidance content...');
        const fs = require('fs');
        const path = require('path');
        const uiGuidanceContent = fs.readFileSync(path.join(process.cwd(), 'public', 'UI_guidance.txt'), 'utf8');
        
        if (uiGuidanceContent) {
          console.log('Adding UI component implementation guide...');
          generatedContent += `\n\n## UI Component Implementation Guide\n${uiGuidanceContent}`;
        } else {
          console.warn('UI guidance file was empty');
        }
      } catch (err) {
        console.error('Error reading UI guidance file:', err);
        // Don't throw here - continue with the rest of the content
      }
    }
    
    // Generate the base rules content
    const userPrompt = `Please generate a complete set of cursor rule files for the project detailed below.
Follow all instructions, formats, and best practices outlined in the system prompt to create a comprehensive and effective set of rules.

## Project Details

### Application Idea
${appIdea}

### Core Features
${selectedFeatures.map(feature => `- ${feature}`).join('\n')}

### Design & Styling Approach
${selectedDesign?.name || 'Not specified'} - ${selectedDesign?.description || ''}

Based on this, generate the set of .mdc rule files now.`;

    // Make the API call to generate content
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: CURSOR_RULES_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.1,
        max_tokens: 16000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} - ${await response.text()}`);
    }

    const data = await response.json();
    generatedContent += '\n\n' + data.choices[0].message.content;
    
    console.log('Successfully generated cursor rules');
    return generatedContent;
    
  } catch (error) {
    console.error('Error generating cursor rules:', error);
    throw new Error(`Failed to generate cursor rules: ${error.message}`);
  }
};

// Helper function to extract app name from description
const extractAppName = (appIdea) => {
  // Simple extraction - look for common patterns
  const words = appIdea.split(' ');
  if (words.length > 0) {
    // Take first few words and capitalize
    return words.slice(0, 3).map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  }
  return 'My App';
};