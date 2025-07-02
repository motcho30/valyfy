import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getUIComponentsForDesign } from '../services/uiComponentsService';

const DesignSelector = ({ onDesignSelected, onBack }) => {
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [customColors, setCustomColors] = useState({});
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [activeColorIndex, setActiveColorIndex] = useState(0);
  const [hue, setHue] = useState(180);
  const [saturation, setSaturation] = useState(50);
  const [lightness, setLightness] = useState(50);
  const colorPickerRef = useRef(null);

  // Extract colors from design prompts
  const extractColors = (designId) => {
    const colorMaps = {
      'minimalistic': [
        { name: 'Background', color: '#F9FAFB', description: 'Light gray background' },
        { name: 'Foreground', color: '#FFFFFF', description: 'Pure white cards' },
        { name: 'Primary Text', color: '#111827', description: 'Dark charcoal' },
        { name: 'Secondary Text', color: '#6B7280', description: 'Medium gray' },
        { name: 'Borders', color: '#E5E7EB', description: 'Light gray borders' },
        { name: 'Primary Accent', color: '#10B981', description: 'Vibrant green' }
      ],
      'tech-dark': [
        { name: 'Background', color: '#000000', description: 'Pure black' },
        { name: 'Surface', color: '#111116', description: 'Lighter black' },
        { name: 'Text Primary', color: '#FFFFFF', description: 'Pure white' },
        { name: 'Text Secondary', color: '#888888', description: 'Muted gray' },
        { name: 'Accent Blue', color: '#5865F2', description: 'Electric blue' },
        { name: 'Gradient Purple', color: '#8B5CF6', description: 'Purple accent' },
        { name: 'Gradient Orange', color: '#FF6B35', description: 'Orange glow' },
        { name: 'Border', color: '#222228', description: 'Subtle border' }
      ]
    };
    return colorMaps[designId] || [];
  };

  // Convert hex to HSL
  const hexToHsl = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0; break;
      }
      h /= 6;
    }

    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
  };

  // Convert HSL to hex
  const hslToHex = (h, s, l) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  // Handle design selection
  const handleDesignSelect = (design) => {
    setSelectedDesign(design.id);
    const colors = extractColors(design.id);
    const colorMap = {};
    colors.forEach((color, index) => {
      colorMap[index] = color.color;
    });
    setCustomColors(colorMap);
  };

  // Handle color change
  const handleColorChange = (colorIndex, newColor) => {
    setCustomColors(prev => ({
      ...prev,
      [colorIndex]: newColor
    }));
  };

  // Open color picker
  const openColorPicker = (colorIndex, currentColor) => {
    setActiveColorIndex(colorIndex);
    const [h, s, l] = hexToHsl(currentColor);
    setHue(h);
    setSaturation(s);
    setLightness(l);
    setShowColorPicker(true);
  };

  // Close color picker on escape key
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setShowColorPicker(false);
      }
    };

    if (showColorPicker) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showColorPicker]);

  // Update color from picker
  const updateColorFromPicker = () => {
    const newColor = hslToHex(hue, saturation, lightness);
    handleColorChange(activeColorIndex, newColor);
  };

  useEffect(() => {
    if (showColorPicker) {
      updateColorFromPicker();
    }
  }, [hue, saturation, lightness]); // eslint-disable-line react-hooks/exhaustive-deps

  // Generate updated design prompt with custom colors
  const getUpdatedDesignPrompt = (originalDesign) => {
    if (!selectedDesign || Object.keys(customColors).length === 0) {
      return originalDesign.prompt;
    }

    const colors = extractColors(selectedDesign);
    let updatedPrompt = originalDesign.prompt;

    // Replace color values in the prompt
    colors.forEach((colorInfo, index) => {
      if (customColors[index]) {
        const originalColor = colorInfo.color;
        const newColor = customColors[index];
        updatedPrompt = updatedPrompt.replace(new RegExp(originalColor, 'g'), newColor);
      }
    });

    return updatedPrompt;
  };

  const handleContinue = () => {
    const originalDesign = designTypes.find(d => d.id === selectedDesign);
    const updatedDesign = {
      ...originalDesign,
      prompt: getUpdatedDesignPrompt(originalDesign),
      customColors: customColors
    };
    onDesignSelected(updatedDesign);
  };

  const designTypes = [
    {
      id: 'minimalistic',
      name: 'Minimalistic/Modern',
      image: '/minimlistic.png',
      description: 'Clean, uncluttered, content-focused',
      prompt: `Core Philosophy: The design must be clean, uncluttered, and content-focused. It prioritizes clarity and effortless usability through generous use of negative space, a strict typographic hierarchy, and a restrained color palette. Every element should feel intentional and purposeful. The aesthetic is premium, trustworthy, and sophisticated.

1. Typography
Font: The primary and only font family is Inter. It must be used for all text elements, from headings to body copy to labels. Use the variable font version to access a range of weights.

Headings:
- h1 (Primary Page Titles): font-sans, font-bold (weight 700), text-4xl or text-5xl. Letter spacing should be slightly tightened (tracking-tight).
- h2 (Section Titles): font-sans, font-semibold (weight 600), text-3xl, tracking-tight.
- h3 (Card Titles / Sub-Sections): font-sans, font-medium (weight 500), text-xl.

Body Text: font-sans, font-normal (weight 400), text-base (typically 16px). Line height should be generous for readability (leading-relaxed or leading-7). The color should be a dark gray, not pure black, to be easier on the eyes.

UI Labels & Metadata: font-sans, font-medium (weight 500), text-sm. Used for form labels, button text, and captions.

2. Color Palette
The palette is fundamentally monochromatic, using shades of gray, with a single, clear accent color for calls-to-action.

Background: A very light gray (#F9FAFB or Tailwind's gray-50). Pure white should be used sparingly for specific foreground elements to create contrast.

Foreground (Cards/Modals): Pure white (#FFFFFF). This creates a subtle layering effect on top of the light gray background.

Primary Text: A dark, near-black charcoal (#111827 or Tailwind's gray-900).

Secondary Text / Placeholders: A medium gray (#6B7280 or Tailwind's gray-500). Used for subtitles, descriptions, and placeholder text in forms.

Borders & Dividers: A light, subtle gray (#E5E7EB or Tailwind's gray-200). Borders should be 1px and used to define component edges, not for decoration.

Primary Accent (for buttons & links): A strong, professional color. A vibrant green (#10B981 or Tailwind's emerald-500) or a confident blue (#3B82F6 or Tailwind's blue-500) are excellent choices. It must have a slightly darker shade for hover states.

3. Layout & Spacing
Core Principle: "Let it breathe." White space is the most important component.

Base Unit: Use a 4px or 8px grid system. All padding, margins, and component dimensions should be multiples of this base.

Page Layout: Use a centered, max-width container (max-w-7xl mx-auto) with horizontal padding (px-4 or px-6) to ensure content is readable on large screens.

Grid System: Use CSS Flexbox or Grid for all layouts. Do not use floats or older techniques.

Shadows: Shadows should be subtle and realistic, used only to indicate elevation (e.g., for modals, dropdowns). Avoid harsh, dark shadows. Use multiple, layered box-shadows to create a soft, diffused effect (similar to Tailwind's shadow-md and shadow-lg).

4. Component Styling
Buttons:
- Primary: Solid background of the Primary Accent color, white text, rounded-lg, no border. Padding should be generous (px-5 py-2.5). On hover, the background should darken by one shade. Add a subtle scale-95 transform on press.
- Secondary: White background, dark gray text, and a 1px Border color. rounded-lg. On hover, the background can shift to a very light gray (gray-100).

Input Fields: rounded-lg, with a 1px Border color. The background should be the main Background color or white. On focus, the border must change to the Primary Accent color (e.g., focus:ring-blue-500 focus:border-blue-500).

Cards: rounded-xl or rounded-2xl for a softer feel. Use a 1px Border color and a bg-white background. They should have a very subtle shadow-md. Padding inside cards must be generous (p-6).

Modals / Popups: Elevated above the page with a semi-transparent black overlay (bg-black/40). The modal itself should be a bg-white card with a shadow-lg to create a strong sense of depth.`
    },
    {
      id: 'tech-dark',
      name: 'Tech Dark Mode',
      image: '/darkmode.png',
      description: 'Premium dark-mode tech aesthetic',
      prompt: `Core Design Philosophy
Create a premium dark-mode tech aesthetic that pushes boundaries with bold typography, dramatic gradients, and sophisticated visual effects. Think "digital luxury meets experimental design" - where darkness creates drama and every element commands attention.

Color Palette
Background: #000000 to #0A0A0F (Pure black to near-black)
Surface: #111116 to #1A1A20 (Slightly lighter blacks)
Text Primary: #FFFFFF (Pure white)
Text Secondary: #888888 to #AAAAAA (Muted grays)
Accent Primary: Electric blues (#5865F2, #7B8FF9)
Accent Gradients: 
  - Purple to blue: #8B5CF6 to #3B82F6
  - Orange glow: #FF6B35 to #FF8C42
  - Multicolor: #FF006E, #8338EC, #3A86FF
Border: #222228 to #333339 (Very subtle)

Typography
Font Families:
Headlines: Bold serif (Playfair Display) OR geometric sans (Space Grotesk)
Body: Inter, Söhne, or similar clean sans-serif

Sizing:
Hero H1: 72-120px, font-weight: 400-800, dramatic presence
H2: 48-64px, font-weight: 600-700
H3: 32-40px, font-weight: 500-600
Body: 16-18px, font-weight: 400, line-height: 1.7

Special Effects:
Letter-spacing: Generous on headlines (0.02-0.05em)
Mix serif and sans-serif for contrast

Layout Principles
Dark canvas philosophy: Black background is the stage
Floating elements: Components feel like they hover in space
Asymmetrical layouts: Break the grid for visual interest
Depth through lighting: Use gradients and glows to create Z-axis
Generous spacing: 100-160px between major sections

Visual Effects
Gradients & Glows
Gradient meshes: Complex multi-color gradients for backgrounds
Glow effects: Soft light emanating from elements
css: filter: blur(100px); opacity: 0.4-0.6;
Gradient text: On key headlines
Orbs and shapes: Blurred geometric shapes as background elements

Textures & Patterns
Dot matrices: White dots forming patterns/shapes
Noise textures: Subtle film grain overlay (opacity: 0.02-0.05)
Grid patterns: Faint grid lines for technical feel
Blur effects: Heavy gaussian blur on background shapes

Component Patterns
Buttons
Primary CTA:
Bright gradient or solid accent color
Padding: 16-20px vertical, 32-48px horizontal
Border-radius: 8-12px OR fully rounded (9999px)
Glow effect on hover
Font-weight: 500-600

Secondary:
White/gray border (1px), transparent background
Subtle background on hover

Navigation
Minimal header: Logo + essential links only
Sticky with backdrop blur:
css: backdrop-filter: blur(10px); background: rgba(0,0,0,0.7);
Wide spacing: 40-60px between nav items
No underlines: Use opacity/color changes for hover

Cards & Containers
Glass morphism:
css: background: rgba(255,255,255,0.05); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1);
Gradient borders: Using pseudo-elements
Inner glow: Subtle light inside cards
Large border-radius: 16-24px

Hero Sections
Massive typography: 80-120px headlines
Layered elements: Text over gradients over patterns
Centered or off-center: Break traditional alignment
Animated backgrounds: Slowly morphing gradients
CTAs with breathing room: 60-80px from other elements

Special Elements
Background Effects
Gradient orbs: Large, blurred circular gradients
Geometric patterns: Dots, lines, grids with low opacity
Animated meshes: Slowly moving gradient backgrounds
Light leaks: Colored light bleeding from edges

Interactive States
Hover: Brightness increase, subtle scale (1.02-1.05)
Active: Slight depression effect
Focus: Bright outline or glow
Transitions: 300-400ms with ease-out

Data & Metrics
Glowing numbers: Key metrics with light effects
Gradient progress bars
Dark cards with light borders
Monospace fonts for numbers

Animation Principles
Smooth and slow: 400-800ms for major transitions
Parallax scrolling: Different speeds for layers
Reveal animations: Fade + subtle translate
Continuous subtle motion: Floating/breathing elements
GPU-accelerated: Transform and opacity only

Mobile Responsiveness
Maintain dark theme: No light mode option
Reduce effects: Simpler gradients, less blur
Stack dramatically: Generous vertical spacing
Larger touch targets: 48-56px minimum
Simplified navigation: Fullscreen overlay menu

Critical Rules
Darkness is the canvas - Never fight the black background
Light creates hierarchy - Brighter = more important
Effects with purpose - Every glow/gradient must enhance meaning
Performance matters - Optimize heavy effects for 60fps
Accessibility in darkness - Maintain WCAG AA contrast ratios
Progressive enhancement - Core experience works without effects

Technical Implementation
css:
/* Base setup */
* { 
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Performance */
.gpu-accelerated {
  will-change: transform;
  transform: translateZ(0);
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; }
}`
    }
    // Additional design types can be added here later
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-6xl h-full flex flex-col py-2"
    >
      {/* Back button */}
      <motion.button
        whileHover={{ x: -4 }}
        onClick={onBack}
        className="flex items-center text-black/60 hover:text-black transition-colors mb-4"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </motion.button>

      <div className="text-center mb-4">
        <h1 className="text-2xl font-light text-black mb-1 tracking-tight">
          Choose your design
        </h1>
        <p className="text-black/60 text-sm">
          Select the visual style for your app
        </p>
      </div>

      {/* Design Options - More compact */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
          {designTypes.map((design, index) => (
            <motion.div
              key={design.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group"
            >
              <motion.button
                whileHover={{ y: -8 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleDesignSelect(design)}
                className={`w-full text-left transition-all duration-500 ${
                  selectedDesign === design.id
                    ? 'ring-2 ring-vibe-cyan'
                    : 'hover:ring-1 hover:ring-black/20'
                }`}
                style={{
                  borderRadius: '24px',
                  overflow: 'hidden'
                }}
              >
                {/* Design Preview */}
                <div className="relative aspect-[3/2] bg-white/60 backdrop-blur-xl border border-black/10 overflow-hidden"
                  style={{ 
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)'
                  }}
                >
                  <img
                    src={design.image}
                    alt={design.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Selection indicator */}
                  {selectedDesign === design.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-3 right-3 w-5 h-5 bg-vibe-cyan rounded-full flex items-center justify-center"
                    >
                      <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </motion.div>
                  )}
                </div>

                {/* Design Info */}
                <div className="p-4 bg-white/80 backdrop-blur-xl border-x border-b border-black/10"
                  style={{ 
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)'
                  }}
                >
                  <h3 className="text-lg font-medium text-black mb-1">
                    {design.name}
                  </h3>
                  <p className="text-black/60 font-light text-sm mb-2">
                    {design.description}
                  </p>
                  
                  {/* UI Components Info */}
                  {(() => {
                    const uiComponents = getUIComponentsForDesign(design.id);
                    if (uiComponents) {
                      return (
                        <div className="mt-2 pt-2 border-t border-black/10">
                          <div className="flex items-center mb-1">
                            <svg className="w-3 h-3 mr-1 text-black/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                            <span className="text-xs font-medium text-black/50">UI Components</span>
                          </div>
                          <div className="text-xs text-black/40 mb-1">
                            {uiComponents.uiLibrary} • {uiComponents.components.length} components
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {uiComponents.components.slice(0, 3).map((component, idx) => (
                              <span key={idx} className="text-xs bg-black/5 text-black/60 px-2 py-0.5 rounded-full">
                                {component.name}
                              </span>
                            ))}
                            {uiComponents.components.length > 3 && (
                              <span className="text-xs text-black/40">
                                +{uiComponents.components.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
              </motion.button>
            </motion.div>
          ))}

          {/* Coming Soon Cards */}
          {[1].map((index) => (
            <motion.div
              key={`coming-soon-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (designTypes.length + index) * 0.1, duration: 0.5 }}
              className="group"
            >
              <div
                className="w-full opacity-40"
                style={{
                  borderRadius: '24px',
                  overflow: 'hidden'
                }}
              >
                {/* Coming Soon Preview */}
                <div className="relative aspect-[3/2] bg-white/30 backdrop-blur-xl border border-black/5 flex items-center justify-center"
                  style={{ 
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)'
                  }}
                >
                  <div className="text-center">
                    <div className="w-10 h-10 bg-black/10 rounded-full mx-auto mb-2 flex items-center justify-center">
                      <svg className="w-5 h-5 text-black/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <p className="text-black/40 text-xs font-light">Coming Soon</p>
                  </div>
                </div>

                {/* Coming Soon Info */}
                <div className="p-4 bg-white/40 backdrop-blur-xl border-x border-b border-black/5"
                  style={{ 
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)'
                  }}
                >
                  <h3 className="text-lg font-medium text-black/40 mb-1">
                    More Designs
                  </h3>
                  <p className="text-black/30 font-light text-sm">
                    Additional styles coming soon
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

        {/* Color Palette Editor */}
        {selectedDesign && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 relative"
          >
            <div className="bg-white/60 backdrop-blur-xl border border-black/10 rounded-2xl p-4"
              style={{ 
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)'
              }}
            >
              <h3 className="text-base font-medium text-black mb-3">Customize Colors</h3>
              
                              {/* Color Grid */}
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 mb-3">
                  {extractColors(selectedDesign).map((colorInfo, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openColorPicker(index, customColors[index] || colorInfo.color)}
                      className="group relative"
                    >
                      <div
                        className="w-8 h-8 rounded-full border-2 border-white shadow-md cursor-pointer transition-all duration-200 group-hover:shadow-lg"
                        style={{ backgroundColor: customColors[index] || colorInfo.color }}
                      />
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                        <div className="bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                          {colorInfo?.name || 'Color'}
                        </div>
                      </div>
                    </motion.button>
                  ))}
              </div>

              {/* Add Color Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  const colors = extractColors(selectedDesign);
                  const newIndex = colors.length;
                  openColorPicker(newIndex, '#C1F2E8');
                }}
                className="flex items-center text-black/60 hover:text-black transition-colors text-xs"
              >
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add custom color
              </motion.button>
            </div>

                      {/* Figma-style Color Picker */}
            <AnimatePresence>
              {showColorPicker && (
                <>
                  {/* Backdrop overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998]"
                    onClick={() => setShowColorPicker(false)}
                  />
                  
                  {/* Color picker modal */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999]"
                  >
                    <div
                      ref={colorPickerRef}
                      className="bg-white/98 backdrop-blur-xl border border-black/10 rounded-xl p-4 shadow-2xl"
                      style={{ 
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)'
                      }}
                    >
                    {/* Color Preview */}
                    <div className="flex items-center mb-3">
                      <div
                        className="w-10 h-10 rounded-lg border-2 border-black/10 mr-3"
                        style={{ backgroundColor: hslToHex(hue, saturation, lightness) }}
                      />
                      <div className="flex-1">
                        <div className="text-xs text-black/60 mb-1">Color</div>
                        <div className="text-sm font-mono text-black">
                          {hslToHex(hue, saturation, lightness).toUpperCase()}
                        </div>
                      </div>
                    </div>

                    {/* Color Area */}
                    <div 
                      className="relative w-48 h-32 mb-3 rounded-lg overflow-hidden cursor-crosshair"
                     onMouseDown={(e) => {
                       const rect = e.currentTarget.getBoundingClientRect();
                       const handleMouseMove = (e) => {
                         const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
                         const y = Math.max(0, Math.min(100, 100 - ((e.clientY - rect.top) / rect.height) * 100));
                         setSaturation(x);
                         setLightness(y);
                       };
                       const handleMouseUp = () => {
                         document.removeEventListener('mousemove', handleMouseMove);
                         document.removeEventListener('mouseup', handleMouseUp);
                       };
                       document.addEventListener('mousemove', handleMouseMove);
                       document.addEventListener('mouseup', handleMouseUp);
                       
                       // Initial click
                       const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
                       const y = Math.max(0, Math.min(100, 100 - ((e.clientY - rect.top) / rect.height) * 100));
                       setSaturation(x);
                       setLightness(y);
                     }}
                   >
                     <div
                       className="w-full h-full"
                       style={{
                         background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, hsl(${hue}, 100%, 50%))`
                       }}
                     />
                     <div
                       className="absolute w-4 h-4 border-2 border-white rounded-full shadow-lg pointer-events-none transform -translate-x-2 -translate-y-2"
                       style={{
                         left: `${saturation}%`,
                         top: `${100 - lightness}%`,
                         backgroundColor: hslToHex(hue, saturation, lightness)
                       }}
                     />
                   </div>

                                                         {/* Hue Slider */}
                    <div 
                      className="relative w-full h-4 mb-3 rounded-full overflow-hidden cursor-pointer"
                     onMouseDown={(e) => {
                       const rect = e.currentTarget.getBoundingClientRect();
                       const handleMouseMove = (e) => {
                         const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
                         setHue((x / 100) * 360);
                       };
                       const handleMouseUp = () => {
                         document.removeEventListener('mousemove', handleMouseMove);
                         document.removeEventListener('mouseup', handleMouseUp);
                       };
                       document.addEventListener('mousemove', handleMouseMove);
                       document.addEventListener('mouseup', handleMouseUp);
                       
                       // Initial click
                       const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
                       setHue((x / 100) * 360);
                     }}
                   >
                     <div
                       className="w-full h-full"
                       style={{
                         background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)'
                       }}
                     />
                                           <div
                        className="absolute top-1/2 w-3 h-3 bg-white border-2 border-black/20 rounded-full shadow-lg pointer-events-none transform -translate-x-1.5 -translate-y-1.5"
                        style={{ left: `${(hue / 360) * 100}%` }}
                      />
                   </div>

                    {/* Preset Colors */}
                    <div className="mb-3">
                      <div className="text-xs text-black/60 mb-2">Presets</div>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          '#FF6B35', '#F7931E', '#FFD23F', '#06FFA5', '#1FB6FF', '#5865F2',
                          '#8B5CF6', '#EC4899', '#EF4444', '#10B981', '#3B82F6', '#6366F1'
                        ].map((presetColor) => (
                          <button
                            key={presetColor}
                            onClick={() => {
                              const [h, s, l] = hexToHsl(presetColor);
                              setHue(h);
                              setSaturation(s);
                              setLightness(l);
                            }}
                            className="w-6 h-6 rounded-md border border-black/10 hover:scale-110 transition-transform"
                            style={{ backgroundColor: presetColor }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setShowColorPicker(false)}
                        className="px-3 py-1.5 text-black/60 hover:text-black transition-colors text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => setShowColorPicker(false)}
                        className="px-3 py-1.5 bg-black text-white rounded-lg hover:bg-black/90 transition-colors text-sm"
                      >
                        Done
                      </button>
                    </div>
                                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
        </motion.div>
      )}

        {/* Continue Button */}
        {selectedDesign && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-4 border-t border-black/5 mt-auto"
          >
            <div className="flex justify-center space-x-4">
              {onBack && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onBack}
                  className="px-8 py-3 border border-black/10 rounded-xl font-medium text-black/70 hover:bg-black/5 transition-colors"
                >
                  Back
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleContinue}
                className="px-8 py-3 rounded-full font-light bg-black text-white hover:bg-black/90 shadow-lg shadow-black/20 transition-all duration-300"
              >
                Continue
              </motion.button>
            </div>
          </motion.div>
        )}
    </motion.div>
  );
};

export default DesignSelector; 