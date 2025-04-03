
import { Contract } from '@/services/contractService';
import { generateContractHTML } from './htmlGenerator';
import { ContractData } from './types';

/**
 * Helper function to transform a contract entity into contract data
 */
export const transformContractToData = (contract: Contract): ContractData => {
  return {
    breederName: contract.breeder_id || 'Breeder',
    breederBusinessName: 'PetAssistWare Kennel',
    customerName: contract.customer ? 
      `${contract.customer.first_name} ${contract.customer.last_name}` : 'Customer',
    customerEmail: contract.customer?.email || undefined,
    customerPhone: contract.customer?.phone || undefined,
    puppyName: contract.puppy?.name,
    puppyId: contract.puppy_id || undefined,
    puppyDob: contract.puppy?.birth_date,
    puppyBreed: contract.puppy?.breed || undefined,
    puppyColor: contract.puppy?.color || undefined,
    puppyGender: contract.puppy?.gender || undefined,
    microchipNumber: contract.puppy?.microchip_number || undefined,
    salePrice: contract.price,
    contractDate: contract.contract_date || new Date().toISOString(),
    contractType: (contract.contract_type as 'pet' | 'breeding' | 'co-ownership' | 'other') || 'pet',
    signatureUrl: contract.signature_data
  };
};

/**
 * Downloads a contract as PDF
 */
export const downloadContract = async (contract: Contract) => {
  try {
    const contractData = transformContractToData(contract);
    
    // Generate contract HTML
    const contractHtml = generateContractHTML(`
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          h1 { text-align: center; color: #333; }
          h2 { color: #555; margin-top: 20px; }
          .signature { margin-top: 60px; display: flex; justify-content: space-between; }
          .signature-line { border-top: 1px solid #000; width: 200px; text-align: center; padding-top: 5px; }
        </style>
      </head>
      <body>
        <h1>CONTRACT AGREEMENT</h1>
        <p>This agreement is made between <strong>{{breederName}}</strong> of <strong>{{breederBusinessName}}</strong> and <strong>{{customerName}}</strong>.</p>
        
        <h2>Puppy Information</h2>
        <p>
          Name: {{puppyName}}<br>
          Breed: {{puppyBreed}}<br>
          Color: {{puppyColor}}<br>
          Gender: {{puppyGender}}<br>
          Date of Birth: {{puppyDob}}<br>
          Microchip Number: {{microchipNumber}}
        </p>
        
        <h2>Purchase Price</h2>
        <p>The agreed price is ${{salePrice}} USD.</p>
        
        <div class="signature">
          <div>
            <div class="signature-line">Breeder Signature</div>
          </div>
          <div>
            <div class="signature-line">Customer Signature</div>
          </div>
        </div>
      </body>
      </html>
    `, contractData);
    
    // Create a blob from the HTML content
    const blob = new Blob([contractHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link to download the HTML file
    const link = document.createElement('a');
    link.href = url;
    link.download = `Contract_${contract.id.slice(0, 8)}.html`;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error downloading contract:', error);
    throw error;
  }
};
