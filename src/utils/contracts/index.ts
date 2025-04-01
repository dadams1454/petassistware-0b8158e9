
// Import everything from htmlGenerator - note we're using type safety
import * as HtmlGeneratorImports from './htmlGenerator';

// Create fallback implementations to avoid errors
const htmlGenerator = {
  generateHtml: HtmlGeneratorImports.generateHtml || (() => ''),
  renderTemplate: HtmlGeneratorImports.renderTemplate || (() => ''),
  applyCustomStyles: HtmlGeneratorImports.applyCustomStyles || (() => '')
};

// Export functions from htmlGenerator with fallbacks
export const generateHtml = htmlGenerator.generateHtml;
export const renderTemplate = htmlGenerator.renderTemplate;
export const applyCustomStyles = htmlGenerator.applyCustomStyles;

// Export specific functions from pdfIntegration
export * from './pdfIntegration';

// Create a simple contractTemplates implementation if it doesn't exist
export const generateContractHTML = (templateName: string, data: any) => {
  console.warn('Contract template generator not fully implemented');
  return `<h1>${templateName}</h1><pre>${JSON.stringify(data, null, 2)}</pre>`;
};

// Add other contract template exports
export const SALES_CONTRACT_TEMPLATE = 'sales_contract';
export const HEALTH_GUARANTEE_TEMPLATE = 'health_guarantee';
export const SPAY_NEUTER_TEMPLATE = 'spay_neuter_agreement';
