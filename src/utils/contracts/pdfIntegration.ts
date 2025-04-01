
import { ContractData, ContractTemplate } from './types';

interface GeneratePDFOptions {
  template: ContractTemplate;
  data: ContractData;
}

export const generateContractPDF = (options: GeneratePDFOptions): Promise<Blob> => {
  // This is a stub implementation - in a real app, this would use PDF generation libraries
  return new Promise((resolve) => {
    // Mock implementation for PDF generation
    setTimeout(() => {
      // Create a simple blob to represent the PDF
      const blob = new Blob(['PDF content would be here'], { type: 'application/pdf' });
      resolve(blob);
    }, 500);
  });
};

export const generateContractHTML = (data: {
  template: ContractTemplate;
  breederName: string;
  breederBusinessName: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  puppyName: string;
  puppyId?: string;
  puppyDob: string;
  puppyBreed?: string;
  puppyColor?: string;
  puppyGender?: string;
  microchipNumber?: string;
  salePrice: number;
  contractDate: string;
  contractType: 'pet' | 'breeding' | 'co-ownership' | 'other';
  healthGuarantee?: string;
  returnPolicy?: string;
  specialConditions?: string;
  signatureUrl?: string;
}): string => {
  // This is a stub implementation for generating HTML
  // In a real app, this would use a templating engine
  
  const htmlContent = `
    <div class="contract">
      <h1>Sales Agreement</h1>
      <p>This agreement is made between ${data.breederName} (Breeder) and ${data.customerName} (Buyer).</p>
      <p>For the purchase of a ${data.puppyGender || ''} ${data.puppyBreed || ''} puppy named ${data.puppyName}.</p>
      <p>Date of Birth: ${new Date(data.puppyDob).toLocaleDateString()}</p>
      <p>Microchip: ${data.microchipNumber || 'N/A'}</p>
      <p>Sale Price: $${data.salePrice.toFixed(2)}</p>
      
      <h2>Health Guarantee</h2>
      <p>${data.healthGuarantee || 'No specific health guarantee provided.'}</p>
      
      <h2>Return Policy</h2>
      <p>${data.returnPolicy || 'No specific return policy provided.'}</p>
      
      <h2>Special Conditions</h2>
      <p>${data.specialConditions || 'No special conditions.'}</p>
      
      <div class="signatures">
        <div>
          <p>Breeder: ${data.breederName}</p>
          <p>Date: ${new Date(data.contractDate).toLocaleDateString()}</p>
        </div>
        <div>
          <p>Buyer: ${data.customerName}</p>
          <p>Date: ${new Date(data.contractDate).toLocaleDateString()}</p>
          ${data.signatureUrl ? `<img src="${data.signatureUrl}" alt="Buyer Signature" />` : ''}
        </div>
      </div>
    </div>
  `;
  
  return htmlContent;
};

export const getContractTemplatePlaceholders = (): string[] => {
  return [
    '{{breederName}}',
    '{{breederBusinessName}}',
    '{{customerName}}',
    '{{puppyName}}',
    '{{puppyDob}}',
    '{{puppyBreed}}',
    '{{microchipNumber}}',
    '{{salePrice}}',
    '{{contractDate}}'
  ];
};
