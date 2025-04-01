
// Import everything from htmlGenerator
import * as HtmlGenerator from './htmlGenerator';

// Export specific functions from htmlGenerator
export const { 
  generateHtml = () => {},
  renderTemplate = () => {}, 
  applyCustomStyles = () => {}
} = HtmlGenerator;

// Export specific functions from pdfIntegration
export * from './pdfIntegration';

// Try to import contractTemplates dynamically
try {
  // We'll use a dynamic import that will be resolved at runtime
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
