export const generateDesignSpecDocument = (designData, projectName) => {
  // --- SAFETY NET -------------------------------------------------
  // Ensure essential sub-objects exist so template literals below
  // don’t throw runtime errors when certain design fields are missing.
  // These defaults are lightweight and will be overridden by any
  // provided values in designData.

  if (!designData) designData = {};

  // Default typography
  if (!designData.typography) {
    designData.typography = {
      primary: 'Inter',
      headings: {
        h1: { size: '48px', weight: '700', spacing: '-0.02em' },
        h2: { size: '36px', weight: '600', spacing: '-0.02em' },
        h3: { size: '24px', weight: '500', spacing: '-0.01em' }
      },
      body: { size: '16px', weight: '400', lineHeight: '1.6' }
    };
  } else {
    // Ensure nested objects
    designData.typography.primary = designData.typography.primary || 'Inter';
    designData.typography.headings = designData.typography.headings || {
      h1: { size: '48px', weight: '700', spacing: '-0.02em' },
      h2: { size: '36px', weight: '600', spacing: '-0.02em' },
      h3: { size: '24px', weight: '500', spacing: '-0.01em' }
    };
    ['h1','h2','h3'].forEach((lvl) => {
      if (!designData.typography.headings[lvl]) {
        designData.typography.headings[lvl] = { size: '32px', weight: '600', spacing: '-0.01em' };
      }
    });
    designData.typography.body = designData.typography.body || { size: '16px', weight: '400', lineHeight: '1.6' };
  }

  // Default spacing
  if (!designData.spacing) {
    designData.spacing = {
      baseUnit: '8px',
      sections: '48px',
      cards: '24px',
      buttons: '12px 24px'
    };
  }

  // Default components
  if (!designData.components) {
    designData.components = {
      borderRadius: '8px',
      shadows: 'subtle layered shadows',
      buttons: 'solid accent buttons',
      cards: 'standard cards with soft shadow'
    };
  }
  // ---------------------------------------------------------------
  const designDescriptions = {
    'homerun': {
      philosophy: `The Homerun design philosophy centers on creating a clean, professional recruitment platform that prioritizes clarity and user trust. This design approach emphasizes intuitive candidate flow, clear information hierarchy, and a welcoming aesthetic that builds confidence in both recruiters and job seekers.

The design creates a sense of reliability and professionalism, making it ideal for recruitment and HR applications where trust and clarity are paramount. The aesthetic communicates competence, approachability, and modern business sensibilities.`,
      
      visualTheme: `The visual theme revolves around a clean, spacious layout with a carefully curated color palette featuring vibrant blues and greens. The design feels open and trustworthy, with strategic use of white space and clear visual hierarchy. Professional typography and consistent spacing guide users through the recruitment process naturally.

The overall feeling is one of professional warmth - sophisticated yet approachable, clean yet engaging, and modern yet trustworthy.`,
      
      userExperience: `This design prioritizes user clarity and reduces friction in the recruitment process. Users can quickly understand the platform's value proposition, navigate features intuitively, and complete tasks efficiently. The generous spacing and clear typography ensure excellent readability and accessibility.`,
      
      brandPersonality: 'Professional, Trustworthy, Approachable, Modern, Reliable, Welcoming'
    },
    
    'cluely': {
      philosophy: `The Cluely design philosophy embraces modern web design principles with a sophisticated, premium aesthetic. This approach leverages subtle gradients, strategic use of negative space, and a refined color palette to create an elegant analytics dashboard experience.

The design communicates innovation, precision, and premium quality. It's inspired by modern SaaS applications and data visualization tools. The gradient-heavy design with blue/purple accent colors creates a sense of depth and sophistication.`,
      
      visualTheme: `The visual theme is built around layered gradient backgrounds, glassmorphic effects, and sophisticated color transitions. The design feels like a premium analytics platform with advanced visual effects and smooth animations. Clean typography and generous spacing create breathing room for complex data visualization.

The overall aesthetic is modern, sophisticated, and technologically advanced while maintaining excellent usability.`,
      
      userExperience: `This design creates an engaging, focused environment ideal for data analysis and business intelligence. The sophisticated visual effects enhance the premium feel while the clear hierarchy ensures users can quickly understand and interact with complex data.`,
      
      brandPersonality: 'Innovative, Sophisticated, Premium, Modern, Analytical, Professional'
    },
    
    'airbnb': {
      philosophy: `The Airbnb design philosophy centers on creating warm, welcoming experiences that feel personal and trustworthy. This approach emphasizes human connection, local authenticity, and seamless booking experiences that make users feel confident in their travel decisions.

The design communicates warmth, authenticity, and global community. It's inspired by travel experiences and local cultures, creating a sense of adventure and connection. The minimalist, content-first approach prioritizes clarity and accessibility.`,
      
      visualTheme: `The visual theme revolves around clean, geometric layouts with sophisticated use of whitespace and subtle animations. The design feels warm and inviting, with careful attention to micro-interactions and progressive disclosure of information. The brand red color creates focal points while neutral colors provide balance.

The overall aesthetic is modern, trustworthy, and globally accessible while maintaining local authenticity.`,
      
      userExperience: `This design prioritizes user confidence and reduces anxiety in travel decisions. Users can quickly browse options, understand pricing, and complete bookings with minimal friction. The mobile-first responsive design ensures excellent experiences across all devices.`,
      
      brandPersonality: 'Warm, Authentic, Trustworthy, Global, Welcoming, Adventurous'
    },
    
    'discord': {
      philosophy: `The Discord design philosophy embraces dark-themed interfaces with playful yet professional aesthetics. This approach combines rounded corners, animated elements, and bold typography to create engaging communication experiences that feel both fun and functional.

The design communicates community, creativity, and modern communication. It's inspired by gaming interfaces and social platforms, creating an immersive environment for digital communities. The dark theme reduces eye strain while vibrant accents create visual interest.`,
      
      visualTheme: `The visual theme is built around deep blue-purple gradients, glassmorphic elements, and extensive use of border-radius. The design feels like a modern gaming interface with sophisticated visual effects and smooth animations. High contrast ensures readability while playful elements maintain engagement.

The overall aesthetic is modern, engaging, and community-focused while maintaining professional functionality.`,
      
      userExperience: `This design creates an immersive, engaging environment ideal for extended communication sessions. The dark background reduces eye strain while the playful elements maintain user engagement. The design appeals to gamers, creators, and community builders.`,
      
      brandPersonality: 'Playful, Community-focused, Modern, Engaging, Creative, Professional'
    },
    
    'notion': {
      philosophy: `The Notion design philosophy centers on clean productivity interfaces with minimalist design principles. This approach emphasizes clarity, flexibility, and distraction-free work environments that help users focus on their content and workflows.

The design communicates simplicity, productivity, and thoughtful design. It's inspired by clean interfaces and productivity tools, creating a sense of calm and focus. The warm color palette and generous spacing reduce cognitive load.`,
      
      visualTheme: `The visual theme revolves around clean lines, warm neutrals, and strategic use of whitespace. The design feels open and uncluttered, with subtle shadows and borders providing structure without distraction. The warm color palette creates a comfortable, approachable feel.

The overall aesthetic is clean, productive, and thoughtfully designed while maintaining excellent usability.`,
      
      userExperience: `This design prioritizes user focus and reduces distractions in productivity workflows. Users can quickly organize information, collaborate effectively, and maintain focus on their work. The clean interface supports complex workflows without overwhelming users.`,
      
      brandPersonality: 'Clean, Productive, Thoughtful, Minimalist, Focused, Approachable'
    },
    
    'figma': {
      philosophy: `The Figma design philosophy embraces professional design tool interfaces with collaborative features. This approach emphasizes precision, creativity, and seamless collaboration between designers and stakeholders.

The design communicates professionalism, creativity, and technical excellence. It's inspired by design tools and creative software, creating an environment that supports both individual creativity and team collaboration.`,
      
      visualTheme: `The visual theme is built around clean interfaces with strategic use of color and typography. The design feels professional and precise, with clear visual hierarchy and excellent contrast. The brand orange creates focal points while neutral colors provide balance.

The overall aesthetic is professional, creative, and technically excellent while maintaining excellent usability.`,
      
      userExperience: `This design prioritizes precision and collaboration in design workflows. Users can quickly access tools, collaborate effectively, and maintain focus on their creative work. The interface supports complex design tasks without overwhelming users.`,
      
      brandPersonality: 'Professional, Creative, Precise, Collaborative, Technical, Innovative'
    },
    
    'cursor': {
      philosophy: `The Cursor design philosophy centers on modern code editor interfaces with AI-powered features. This approach emphasizes developer productivity, intelligent assistance, and seamless coding experiences that feel both powerful and intuitive.

The design communicates technical excellence, innovation, and developer-focused functionality. It's inspired by modern development tools and AI interfaces, creating an environment that enhances coding productivity.`,
      
      visualTheme: `The visual theme is built around dark interfaces with strategic use of color for syntax highlighting and AI features. The design feels like a modern development environment with sophisticated visual effects and clear information hierarchy.

The overall aesthetic is technical, innovative, and developer-focused while maintaining excellent usability.`,
      
      userExperience: `This design creates a focused, productive environment ideal for extended coding sessions. The dark background reduces eye strain while the intelligent features enhance productivity. The design appeals to developers and technical professionals.`,
      
      brandPersonality: 'Technical, Innovative, Productive, Developer-focused, Intelligent, Modern'
    },
    
    'netflix': {
      philosophy: `The Netflix design philosophy embraces streaming platform interfaces with immersive content discovery. This approach emphasizes entertainment, content exploration, and seamless viewing experiences that keep users engaged and entertained.

The design communicates entertainment, discovery, and premium content experiences. It's inspired by cinematic interfaces and entertainment platforms, creating an immersive environment for content consumption.`,
      
      visualTheme: `The visual theme is built around dark interfaces with dramatic content presentation and smooth animations. The design feels like a premium entertainment platform with sophisticated visual effects and engaging interactions.

The overall aesthetic is immersive, entertaining, and content-focused while maintaining excellent usability.`,
      
      userExperience: `This design creates an immersive, engaging environment ideal for content discovery and entertainment. The dark background enhances content visibility while the smooth animations maintain user engagement.`,
      
      brandPersonality: 'Entertaining, Immersive, Premium, Engaging, Cinematic, Modern'
    },
    
    'jasper-ai': {
      philosophy: `The Jasper AI design philosophy centers on AI-powered content creation platforms with modern interfaces. This approach emphasizes creativity, productivity, and intelligent assistance that helps users create high-quality content efficiently.

The design communicates innovation, creativity, and AI-powered functionality. It's inspired by modern AI tools and content creation platforms, creating an environment that enhances creative productivity.`,
      
      visualTheme: `The visual theme revolves around clean interfaces with strategic use of green accents and modern design elements. The design feels innovative and productive, with clear visual hierarchy and excellent contrast.

The overall aesthetic is modern, creative, and AI-enhanced while maintaining excellent usability.`,
      
      userExperience: `This design prioritizes creativity and productivity in content creation workflows. Users can quickly access AI features, create content efficiently, and maintain focus on their creative work.`,
      
      brandPersonality: 'Innovative, Creative, Productive, AI-enhanced, Modern, Intelligent'
    }
  };

  const designId = designData.id;
  
  // Handle custom designs
  let description;
  if (designData.isCustom) {
    description = {
      philosophy: designData.analysis?.philosophy || designData.prompt || 'AI-generated design based on uploaded inspiration',
      visualTheme: designData.description || 'AI-analyzed visual theme from uploaded design inspiration',
      userExperience: 'Custom design optimized for your specific use case and visual preferences',
      brandPersonality: designData.analysis?.style || 'Unique, Custom, AI-Enhanced'
    };
  } else {
    description = designDescriptions[designId] || designDescriptions['minimalistic'];
  }

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
${designData.colors && Object.keys(designData.colors).length > 0 ? 
  Object.entries(designData.colors).map(([key, color]) => {
    // Handle both object format and simple string format
    if (typeof color === 'object' && color !== null) {
      return `**${color.name || key}** (${color.hex || color.color || '#000000'}): ${color.description || 'Custom color from design analysis'}`;
    } else {
      return `**${key}** (${color}): Custom color from design analysis`;
    }
  }).join('\n') :
  'Colors will be defined based on your custom design analysis'
}

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