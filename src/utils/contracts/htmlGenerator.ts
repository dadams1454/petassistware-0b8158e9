
// HTML Generator for Contracts

/**
 * Generates HTML for a contract based on template and data
 */
export const generateHtml = (
  templateContent: string, 
  contractData: Record<string, any>
): string => {
  // Basic implementation that replaces variables in the template
  let html = templateContent;
  
  // Replace template variables
  Object.entries(contractData).forEach(([key, value]) => {
    const variablePattern = new RegExp(`{{${key}}}`, 'g');
    html = html.replace(variablePattern, String(value));
  });
  
  return html;
};

/**
 * Renders a template with provided data
 */
export const renderTemplate = (
  template: string, 
  data: Record<string, any>
): string => {
  return generateHtml(template, data);
};

/**
 * Applies custom styles to the contract HTML
 */
export const applyCustomStyles = (
  html: string, 
  styles: string
): string => {
  // Simple implementation that inserts CSS into the head
  if (!html.includes('<head>')) {
    return `<html><head><style>${styles}</style></head><body>${html}</body></html>`;
  }
  
  return html.replace('<head>', `<head><style>${styles}</style>`);
};

// Helper function for contract generation
export const generateContractHTML = (
  templateContent: string,
  contractData: Record<string, any>,
  customStyles?: string
): string => {
  let html = generateHtml(templateContent, contractData);
  
  if (customStyles) {
    html = applyCustomStyles(html, customStyles);
  }
  
  return html;
};
