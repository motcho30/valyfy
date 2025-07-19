import jsPDF from 'jspdf';

// Format content for different file types
const formatters = {
  // Format for PDF - clean HTML structure
  pdf: (content, appName) => {
    // Convert markdown to HTML for PDF
    let htmlContent = content
      // Headers
      .replace(/^# (.*$)/gim, '<h1 class="main-title">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="section-title">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="subsection-title">$1</h3>')
      .replace(/^#### (.*$)/gim, '<h4 class="sub-subsection-title">$1</h4>')
      
      // Lists
      .replace(/^\* (.*$)/gim, '<li class="list-item">$1</li>')
      .replace(/^- (.*$)/gim, '<li class="list-item">$1</li>')
      
      // Bold and italic
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      
      // Code blocks
      .replace(/```(.*?)```/gs, '<pre class="code-block">$1</pre>')
      .replace(/`(.*?)`/g, '<code class="inline-code">$1</code>')
      
      // Line breaks
      .replace(/\n\n/g, '</p><p class="paragraph">')
      .replace(/\n/g, '<br>');

    // Wrap list items in ul tags
    htmlContent = htmlContent.replace(/(<li class="list-item">.*?<\/li>)/gs, '<ul class="list">$1</ul>');
    
    // Wrap in paragraphs
    if (!htmlContent.startsWith('<h1') && !htmlContent.startsWith('<h2')) {
      htmlContent = `<p class="paragraph">${htmlContent}</p>`;
    }

    return `
      <html>
        <head>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 40px 20px;
            }
            .main-title {
              color: #1a1a1a;
              border-bottom: 3px solid #007acc;
              padding-bottom: 10px;
              margin-bottom: 30px;
              font-size: 28px;
              font-weight: bold;
            }
            .section-title {
              color: #2c3e50;
              margin-top: 35px;
              margin-bottom: 20px;
              font-size: 22px;
              font-weight: 600;
              border-left: 4px solid #007acc;
              padding-left: 15px;
            }
            .subsection-title {
              color: #34495e;
              margin-top: 25px;
              margin-bottom: 15px;
              font-size: 18px;
              font-weight: 500;
            }
            .sub-subsection-title {
              color: #4a5568;
              margin-top: 20px;
              margin-bottom: 10px;
              font-size: 16px;
              font-weight: 500;
            }
            .paragraph {
              margin-bottom: 15px;
              text-align: justify;
            }
            .list {
              margin: 15px 0;
              padding-left: 0;
            }
            .list-item {
              margin-bottom: 8px;
              padding-left: 20px;
              list-style-type: disc;
            }
            .code-block {
              background-color: #f8f9fa;
              border: 1px solid #e9ecef;
              border-radius: 6px;
              padding: 15px;
              margin: 15px 0;
              font-family: 'Monaco', 'Menlo', monospace;
              font-size: 14px;
              overflow-x: auto;
            }
            .inline-code {
              background-color: #f1f3f4;
              padding: 2px 6px;
              border-radius: 3px;
              font-family: 'Monaco', 'Menlo', monospace;
              font-size: 14px;
            }
            strong {
              font-weight: 600;
              color: #2d3748;
            }
            em {
              font-style: italic;
              color: #4a5568;
            }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    `;
  },

  // Format for Markdown - ensure proper markdown syntax
  md: (content, appName) => {
    // Clean up and ensure proper markdown formatting
    let mdContent = content
      // Ensure proper header spacing
      .replace(/^(#{1,6})\s*(.*$)/gim, '$1 $2\n')
      // Ensure proper list formatting
      .replace(/^([*-])\s*(.*$)/gim, '$1 $2')
      // Clean up extra whitespace
      .replace(/\n{3,}/g, '\n\n')
      // Ensure code blocks have proper spacing
      .replace(/```/g, '\n```\n')
      .trim();

    // Add metadata header
    const metadata = `---
title: "${appName} - Product Requirements Document"
date: ${new Date().toLocaleDateString()}
version: "1.0"
---

`;

    return metadata + mdContent;
  },

  // Format for TXT - clean plain text
  txt: (content, appName) => {
    let txtContent = content
      // Remove markdown formatting
      .replace(/#{1,6}\s/g, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/`(.*?)`/g, '$1')
      .replace(/```(.*?)```/gs, '$1')
      .replace(/^\* /gm, '• ')
      .replace(/^- /gm, '• ')
      // Clean up spacing
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    // Add header
    const header = `${appName.toUpperCase()} - PRODUCT REQUIREMENTS DOCUMENT
Generated on: ${new Date().toLocaleDateString()}
${new Date().toLocaleTimeString()}

${'='.repeat(60)}

`;

    return header + txtContent;
  }
};

// Download functions for each format
export const downloadFormats = {
  pdf: async (content, appName) => {
    try {
      const formattedContent = formatters.pdf(content, appName);
      
      // Create a temporary div to render HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = formattedContent;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.width = '800px';
      document.body.appendChild(tempDiv);

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageHeight = pdf.internal.pageSize.height;
      
      // Split content into pages
      const lines = content.split('\n');
      let y = 20;
      const lineHeight = 7;
      const margin = 20;
      const pageWidth = pdf.internal.pageSize.width - 2 * margin;

      // Add title
      pdf.setFontSize(20);
      pdf.setFont(undefined, 'bold');
      pdf.text(appName || 'Product Requirements Document', margin, y);
      y += 15;

      // Add date
      pdf.setFontSize(10);
      pdf.setFont(undefined, 'normal');
      pdf.text(`Generated: ${new Date().toLocaleDateString()}`, margin, y);
      y += 15;

      // Process content
      pdf.setFontSize(12);
      lines.forEach(line => {
        if (y > pageHeight - 30) {
          pdf.addPage();
          y = 20;
        }

        if (line.startsWith('# ')) {
          pdf.setFontSize(18);
          pdf.setFont(undefined, 'bold');
          pdf.text(line.substring(2), margin, y);
          y += 10;
        } else if (line.startsWith('## ')) {
          pdf.setFontSize(14);
          pdf.setFont(undefined, 'bold');
          pdf.text(line.substring(3), margin, y);
          y += 8;
        } else if (line.startsWith('### ')) {
          pdf.setFontSize(12);
          pdf.setFont(undefined, 'bold');
          pdf.text(line.substring(4), margin, y);
          y += 7;
        } else if (line.trim()) {
          pdf.setFontSize(11);
          pdf.setFont(undefined, 'normal');
          
          // Handle long lines by splitting them
          const words = line.split(' ');
          let currentLine = '';
          
          words.forEach(word => {
            const testLine = currentLine + word + ' ';
            const textWidth = pdf.getTextWidth(testLine);
            
            if (textWidth > pageWidth) {
              if (currentLine) {
                pdf.text(currentLine.trim(), margin, y);
                y += lineHeight;
                currentLine = word + ' ';
              } else {
                pdf.text(word, margin, y);
                y += lineHeight;
              }
            } else {
              currentLine = testLine;
            }
          });
          
          if (currentLine.trim()) {
            pdf.text(currentLine.trim(), margin, y);
            y += lineHeight;
          }
        } else {
          y += lineHeight / 2; // Empty line
        }
      });

      // Clean up
      document.body.removeChild(tempDiv);
      
      // Download
      const fileName = `${appName?.replace(/[^a-z0-9]/gi, '-') || 'prd'}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('PDF generation error:', error);
      // Fallback to simple PDF
      const pdf = new jsPDF();
      pdf.text(content.substring(0, 1000), 10, 10); // Simple fallback
      pdf.save(`${appName?.replace(/[^a-z0-9]/gi, '-') || 'prd'}.pdf`);
    }
  },

  md: (content, appName) => {
    const formattedContent = formatters.md(content, appName);
    const blob = new Blob([formattedContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${appName?.replace(/[^a-z0-9]/gi, '-') || 'prd'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  txt: (content, appName) => {
    const formattedContent = formatters.txt(content, appName);
    const blob = new Blob([formattedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${appName?.replace(/[^a-z0-9]/gi, '-') || 'prd'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};

// Extract app name from content or use fallback
export const extractAppName = (content) => {
  // Try to find app name in the first few lines
  const lines = content.split('\n');
  for (let line of lines.slice(0, 10)) {
    if (line.includes('App Name:') || line.includes('Product:') || line.includes('Application:')) {
      return line.split(':')[1]?.trim() || 'My App';
    }
    if (line.startsWith('# ') && !line.includes('Product Requirements')) {
      return line.substring(2).trim();
    }
  }
  return 'My App';
}; 