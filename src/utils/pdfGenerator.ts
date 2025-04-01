
import { ContractData, ContractTemplate } from './pdf/types';
import { generatePdfContract } from './pdf/generator';
import { downloadPdf, generatePdfPreviewUrl } from './pdf/utils';
import { renderAkcRegistrationTemplate, AkcRegistrationData } from './pdf/templates/akcRegistration';

// Re-export for backward compatibility
export type { ContractData, ContractTemplate, AkcRegistrationData };
export { generatePdfContract, downloadPdf, generatePdfPreviewUrl, renderAkcRegistrationTemplate };
