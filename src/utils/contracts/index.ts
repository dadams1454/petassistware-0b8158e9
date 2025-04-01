
// Export needed functions from htmlGenerator without duplicate exports
import * as HtmlGenerator from './htmlGenerator';
export const { 
  generateHtml,
  renderTemplate, 
  applyCustomStyles 
} = HtmlGenerator;

// Export specific functions from pdfIntegration
export * from './pdfIntegration';

// Import contractTemplates if it exists, otherwise we'll create it
try {
  // Dynamic import that will be resolved at runtime
  import('./contractTemplates').then(module => {
    // Export all from contractTemplates
    Object.keys(module).forEach(key => {
      if (key !== 'generateContractHTML') {
        exports[key] = module[key];
      }
    });
  }).catch(error => {
    console.warn('contractTemplates module not found:', error);
  });
} catch (error) {
  console.warn('Error importing contractTemplates:', error);
}
