
import { ContractData } from './types';
import { generatePdfContract, downloadPdf, ContractTemplate } from '@/utils/pdfGenerator';

/**
 * Generates a PDF contract using the PDF generator module
 * This provides an integration between the HTML contract generator and the PDF generator
 */
export const generateContractPdf = async (
  data: ContractData, 
  template: ContractTemplate = 'standard'
): Promise<Uint8Array> => {
  // Convert our contract data to the format expected by the PDF generator
  const pdfContractData = {
    ...data,
    template,
  };
  
  return await generatePdfContract(pdfContractData, template);
};

/**
 * Downloads a PDF contract
 */
export const downloadContractPdf = async (
  data: ContractData,
  filename: string,
  template: ContractTemplate = 'standard'
): Promise<void> => {
  const pdfBytes = await generateContractPdf(data, template);
  downloadPdf(pdfBytes, filename);
};
