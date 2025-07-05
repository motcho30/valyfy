export const generateDesignSpecDocument = (designData, projectName) => {
  const designDescriptions = {
    'minimalistic': {
      philosophy: `The Minimalistic/Modern design philosophy centers on the principle that "less is more." This design approach emphasizes clarity, simplicity, and purposeful use of space. Every element serves a function, and visual clutter is eliminated to focus the user's attention on what matters most - the content and core functionality.

This design creates a sense of calm and professionalism, making it ideal for applications that require users to focus on tasks, data, or content consumption. The aesthetic communicates reliability, sophistication, and modern sensibilities without being trendy or ephemeral.`,
      
      visualTheme: `The visual theme revolves around a refined monochromatic palette with strategic use of white space. The design feels open and breathable, with a subtle layering system that creates depth without overwhelming the user. Clean lines, consistent spacing, and purposeful typography hierarchy guide the user's eye naturally through the interface.

The overall feeling is one of premium simplicity - sophisticated without being complex, clean without being sterile, and modern without being flashy.`,
      
      userExperience: `This design prioritizes user clarity and reduces cognitive load. Users can quickly scan content, understand hierarchy, and complete tasks without visual distractions. The generous spacing and clear typography ensure excellent readability across all devices and screen sizes.`,
      
      brandPersonality: 'Professional, Trustworthy, Modern, Sophisticated, Calm, Focused'
    },
    
    'tech-dark': {
      philosophy: `The Tech Dark Mode design philosophy embraces the cutting-edge aesthetic of modern technology and digital innovation. This approach caters to users who spend extended time on screens, particularly in technical or creative environments where reduced eye strain is crucial.

The design communicates innovation, technical expertise, and premium quality. It's inspired by developer tools, gaming interfaces, and high-end software applications. The dark theme creates an immersive environment that allows content and interactive elements to "glow" and stand out dramatically.`,
      
      visualTheme: `The visual theme is built around dramatic contrast and carefully orchestrated lighting effects. Pure blacks create infinite depth, while electric blues and gradient accents provide vibrant focal points. The design feels like looking into a high-tech control center or premium gaming interface.

Subtle gradients, glow effects, and carefully placed highlights create a sense of depth and dimensionality. The overall aesthetic is futuristic, premium, and technologically advanced.`,
      
      userExperience: `This design creates an immersive, focused environment ideal for extended use sessions. The dark background reduces eye strain in low-light conditions while the strategic use of bright accents ensures important elements remain highly visible. The design appeals to technical users, gamers, and professionals who prefer dark interfaces.`,
      
      brandPersonality: 'Innovative, Technical, Premium, Modern, Powerful, Immersive'
    }
  };

  const designId = designData.id;
  const description = designDescriptions[designId] || designDescriptions['minimalistic'];

  const document = `
# Design Specification Document
## ${projectName}

### Design Theme: ${designData.name}
${designData.description}

---

## 1. Design Philosophy & Vision

${description.philosophy}

### Visual Theme
${description.visualTheme}

### User Experience Goals
${description.userExperience}

### Brand Personality
${description.brandPersonality}

---

## 2. Color System

The ${designData.name} theme uses a carefully curated color palette designed to ${designId === 'tech-dark' ? 'create dramatic contrast and visual impact' : 'maintain clarity and reduce visual noise'}.

### Primary Colors
${Object.entries(designData.colors).map(([key, color]) => 
  `**${color.name}** (${color.hex}): ${color.description}`
).join('\n')}

### Color Usage Guidelines
${designId === 'minimalistic' ? 
  `- Background colors should create subtle layers and depth
- Text colors maintain high contrast for readability
- Accent colors are used sparingly for calls-to-action and important highlights
- Borders and dividers provide structure without competing with content` :
  `- Deep blacks create infinite depth and premium feel
- Bright accents create dramatic focal points and guide attention
- Gradients add depth and visual interest to key elements
- Color combinations should maintain accessibility while maximizing impact`
}

---

## 3. Typography System

### Primary Typeface: ${designData.typography.primary}
${designId === 'minimalistic' ? 
  'Inter is chosen for its exceptional readability, modern character, and versatility across all interface elements. Its clean, neutral design ensures content clarity while maintaining personality.' :
  'Space Grotesk provides a distinctive, technical character that complements the high-tech aesthetic. Its geometric forms and modern letterforms create visual consistency with the theme.'
}

### Typography Hierarchy

#### Headings
- **H1 (Page Titles)**: ${designData.typography.headings.h1.size}, weight ${designData.typography.headings.h1.weight}, letter-spacing ${designData.typography.headings.h1.spacing}
  ${designId === 'minimalistic' ? 'Used for primary page titles and major sections. Should have generous spacing above and below.' : 'Creates dramatic impact for primary page titles with bold presence.'}

- **H2 (Section Headers)**: ${designData.typography.headings.h2.size}, weight ${designData.typography.headings.h2.weight}, letter-spacing ${designData.typography.headings.h2.spacing}
  ${designId === 'minimalistic' ? 'Used for main content sections and card titles.' : 'Maintains hierarchy while creating visual rhythm through the interface.'}

- **H3 (Subsections)**: ${designData.typography.headings.h3.size}, weight ${designData.typography.headings.h3.weight}, letter-spacing ${designData.typography.headings.h3.spacing}
  ${designId === 'minimalistic' ? 'Used for component titles and smaller sections.' : 'Provides clear content organization without overwhelming the primary hierarchy.'}

#### Body Text
- **Size**: ${designData.typography.body.size}
- **Weight**: ${designData.typography.body.weight}
- **Line Height**: ${designData.typography.body.lineHeight}

${designId === 'minimalistic' ? 
  'Body text prioritizes readability with generous line spacing and comfortable font size. The medium gray color reduces eye strain while maintaining sufficient contrast.' :
  'Body text maintains readability against dark backgrounds with carefully chosen contrast ratios and optimized spacing for extended reading sessions.'
}

---

## 4. Spacing & Layout System

### Base Grid System
- **Base Unit**: ${designData.spacing.baseUnit}
- **Section Spacing**: ${designData.spacing.sections}
- **Card Padding**: ${designData.spacing.cards}
- **Button Padding**: ${designData.spacing.buttons}

### Spacing Philosophy
${designId === 'minimalistic' ? 
  'Spacing is generous and purposeful, creating breathing room that allows content to stand out. The 8px base unit ensures consistent rhythm throughout the interface. Larger spacing between sections creates clear content hierarchy.' :
  'Spacing creates dramatic gaps and focused groupings. Larger base spacing accommodates glow effects and creates premium feel. Generous section spacing allows for immersive visual effects.'
}

### Layout Principles
${designId === 'minimalistic' ? 
  `- Content should never feel cramped or cluttered
- Use ample whitespace to create visual hierarchy
- Maintain consistent spacing patterns throughout the interface
- Group related elements with appropriate proximity` :
  `- Create dramatic spacing for visual impact
- Allow space for glow effects and gradients
- Use spacing to create depth and layering
- Maintain rhythm while allowing for visual effects`
}

---

## 5. Component Design Language

### Border Radius
**Standard Radius**: ${designData.components.borderRadius}
${designId === 'minimalistic' ? 
  'Subtle rounding creates friendly, approachable components without being overly playful. Consistent radius across all elements maintains visual harmony.' :
  'Generous rounding creates a modern, refined appearance that complements the high-tech aesthetic while maintaining usability.'
}

### Shadows & Effects
**Shadow Style**: ${designData.components.shadows}
${designId === 'minimalistic' ? 
  'Subtle shadows create gentle elevation and depth without drawing attention away from content. Shadows should be soft and barely perceptible.' :
  'Glow effects and backdrop blur create dramatic depth and premium feel. Effects should enhance the high-tech aesthetic while maintaining usability.'
}

### Buttons
**Button Style**: ${designData.components.buttons}
${designId === 'minimalistic' ? 
  'Buttons have generous padding for easy interaction and clear visual hierarchy. Primary buttons use the accent color while secondary buttons maintain subtle styling.' :
  'Buttons feature gradient backgrounds and subtle glow effects. Interactive states should include color transitions and enhanced glow effects.'
}

### Cards & Containers
**Card Style**: ${designData.components.cards}
${designId === 'minimalistic' ? 
  'Cards create clear content boundaries with subtle borders and gentle shadows. Background remains clean white to maximize content contrast.' :
  'Cards feature floating appearance with backdrop blur effects. Dark surfaces with subtle borders create depth and premium feel.'
}

---

## 6. Implementation Guidelines

### Responsive Behavior
${designId === 'minimalistic' ? 
  `- Maintain generous spacing on all screen sizes
- Ensure typography scales appropriately for mobile
- Preserve clean, uncluttered appearance across devices
- Adapt spacing proportionally for different breakpoints` :
  `- Preserve dramatic visual effects across screen sizes
- Adapt glow effects for mobile performance
- Maintain contrast and readability on all devices
- Scale effects appropriately for different screen densities`
}

### Accessibility Considerations
${designId === 'minimalistic' ? 
  `- High contrast between text and background colors
- Generous touch targets for mobile interaction
- Clear focus states for keyboard navigation
- Sufficient color contrast ratios (WCAG AA compliant)` :
  `- Ensure sufficient contrast despite dark theme
- Provide high contrast mode alternatives
- Maintain readability with glow effects
- Clear focus indicators that work against dark backgrounds`
}

### Performance Notes
${designId === 'minimalistic' ? 
  `- Minimal use of shadows and effects for optimal performance
- Simple, efficient styling that loads quickly
- Optimized for fast rendering across all devices` :
  `- Optimize blur and glow effects for performance
- Use CSS-based effects over images when possible
- Consider reduced motion preferences for animations
- Test performance on lower-end devices`
}

---

## 7. Brand Integration

This design system creates a cohesive visual language that communicates:

${designId === 'minimalistic' ? 
  `**Professionalism**: Clean, organized appearance builds trust
**Clarity**: Uncluttered design ensures message clarity
**Modernity**: Contemporary styling appeals to modern users
**Accessibility**: Thoughtful design accommodates all users
**Focus**: Minimal distractions keep users task-focused` :
  `**Innovation**: Cutting-edge aesthetic shows technical leadership
**Premium Quality**: High-end visual effects communicate value
**Technical Expertise**: Dark theme appeals to technical users
**Immersion**: Dramatic design creates engaging experience
**Modernity**: Future-forward styling shows innovation`
}

---

## 8. Next Steps

To implement this design system:

1. **Development Setup**: Ensure all specified fonts are loaded and available
2. **Color Variables**: Set up CSS custom properties or design tokens for all colors
3. **Component Library**: Build reusable components following these specifications
4. **Testing**: Verify appearance across different devices and browsers
5. **Iteration**: Gather user feedback and refine based on real-world usage

---

*This document serves as the definitive guide for implementing the ${designData.name} design theme for ${projectName}. All interface elements should adhere to these specifications to maintain visual consistency and optimal user experience.*

Generated on: ${new Date().toLocaleDateString()}
`;

  return document.trim();
};

export const downloadDesignSpec = (designData, projectName) => {
  const content = generateDesignSpecDocument(designData, projectName);
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${projectName}-design-specification.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}; 