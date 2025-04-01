
// Export all from the htmlGenerator except the already exported generateContractHTML
export * from './htmlGenerator';
export * from './pdfIntegration';

// Import contractTemplates if it exists, otherwise we'll create it
try {
  // @ts-ignore - This is a dynamic import that will be resolved at runtime
  import('./contractTemplates').then(module => {
    // Export all from contractTemplates
    Object.keys(module).forEach(key => {
      exports[key] = module[key];
    });
  }).catch(error => {
    console.warn('contractTemplates module not found:', error);
  });
} catch (error) {
  console.warn('Error importing contractTemplates:', error);
}
