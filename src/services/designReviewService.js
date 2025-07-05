// This service will handle API calls related to design review and feedback.

/**
 * Mocks an API call to get AI-powered feedback for a given design screenshot.
 *
 * @param {string} image - Base64 encoded image string.
 * @param {string} scope - User-defined scope or objectives for the review.
 * @param {object} project - The project context (contains details, PRD, etc.).
 * @returns {Promise<object>} A promise that resolves to the feedback data.
 */
export const getDesignFeedback = async (image, scope, project) => {
  console.log('Requesting design feedback for project:', project?.name);
  console.log('Scope:', scope);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2500));

  // In a real application, you would make a fetch call to your backend here.
  // The backend would then process the image and project data, possibly using an AI service.
  // For now, we return a detailed, mocked response.

  return {
    success: true,
    feedback: {
      layout: {
        title: "Layout & Spacing",
        comment: "The overall layout is clean, but spacing could be improved for better visual hierarchy and readability. Consider increasing the padding within cards and standardizing margins between sections.",
        icon: "LayoutTemplate"
      },
      navigation: {
        title: "Navigation & Flow",
        comment: "The primary user flow is intuitive. However, the sidebar's active state lacks contrast, making it difficult to identify the current page. Adding icons to navigation items could also improve scannability.",
        icon: "Navigation"
      },
      content: {
        title: "Content & Clarity",
        comment: "Headlines are clear and concise. Ensure body text has sufficient contrast against the background. Tooltips on icons would enhance clarity for users unfamiliar with the interface.",
        icon: "FileText"
      },
      visualDesign: {
        title: "Visual Design & Branding",
        comment: "The color palette is consistent with a modern aesthetic. However, using more distinct colors for status tags (e.g., 'Generalist', 'Marketing') would help users differentiate them at a glance.",
        icon: "Palette"
      },
      accessibility: {
        title: "Accessibility",
        comment: "Good use of semantic HTML. Ensure all images have 'alt' tags and that form inputs are associated with labels. Check color contrasts against WCAG guidelines, especially for text on colored backgrounds.",
        icon: "Accessibility"
      },
      interaction: {
        title: "Interaction & Feedback",
        comment: "Buttons provide clear visual feedback on hover. Consider adding a subtle loading indicator after an action is initiated to provide immediate feedback to the user.",
        icon: "MousePointerClick"
      }
    }
  };
}; 