
import { ContractData, ContractTemplate } from './pdf/types';
import { generatePdfContract } from './pdf/generator';
import { downloadPdf, generatePdfPreviewUrl } from './pdf/utils';

// Re-export for backward compatibility
export type { ContractData, ContractTemplate };
export { generatePdfContract, downloadPdf, generatePdfPreviewUrl };
