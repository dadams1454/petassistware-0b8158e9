
import { ContractData } from './types';

/**
 * Generates HTML content for a contract
 * 
 * @param templateHtml - The HTML template
 * @param contractData - The contract data to inject
 * @returns Completed HTML content
 */
export const generateContractHTML = (templateHtml: string, contractData: ContractData): string => {
  // Replace template variables with actual values
  let processedHTML = templateHtml;
  
  // Process all contractData properties
  for (const [key, value] of Object.entries(contractData)) {
    // Skip undefined or null values
    if (value === undefined || value === null) continue;
    
    // Format price with 2 decimal places
    if (key === 'salePrice' && typeof value === 'number') {
      processedHTML = processedHTML.replace(new RegExp(`{{${key}}}`, 'g'), value.toFixed(2));
    } else {
      // Replace all occurrences of the variable
      processedHTML = processedHTML.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
    }
  }
  
  // Remove any remaining template variables
  processedHTML = processedHTML.replace(/{{[^}]+}}/g, 'N/A');
  
  return processedHTML;
};
