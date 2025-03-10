
import { format } from 'date-fns';

export const generateContractHTML = (data: {
  breederName: string;
  breederBusinessName: string;
  customerName: string;
  puppyName: string | null;
  puppyDob: string | null;
  salePrice: number | null;
  contractDate: string;
  microchipNumber: string | null;
  breederSignature?: string | null;
  customerSignature?: string | null;
  signed?: boolean;
}) => {
  const {
    breederName,
    breederBusinessName,
    customerName,
    puppyName,
    puppyDob,
    salePrice,
    contractDate,
    microchipNumber,
    breederSignature,
    customerSignature,
    signed,
  } = data;

  const signatureSection = signed ? `
    <div style="margin: 40px 0; display: flex; justify-content: space-between;">
      <div style="flex: 1; border-top: 1px solid #333; margin-right: 20px;">
        <p>Seller's Signature:</p>
        ${breederSignature ? `<img src="${breederSignature}" alt="Breeder Signature" style="max-height: 60px;" />` : ''}
        <p style="margin-top: 0;">Date: ${format(new Date(), 'MM/dd/yyyy')}</p>
      </div>
      <div style="flex: 1; border-top: 1px solid #333;">
        <p>Buyer's Signature:</p>
        ${customerSignature ? `<img src="${customerSignature}" alt="Customer Signature" style="max-height: 60px;" />` : ''}
        <p style="margin-top: 0;">Date: ${format(new Date(), 'MM/dd/yyyy')}</p>
      </div>
    </div>
  ` : `
    <div style="margin: 40px 0; display: flex; justify-content: space-between;">
      <div style="flex: 1;">
        <p>Seller's Signature: _________________________</p>
        <p>Date: _________________________</p>
      </div>
      <div style="flex: 1;">
        <p>Buyer's Signature: _________________________</p>
        <p>Date: _________________________</p>
      </div>
    </div>
  `;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
      <h1 style="text-align: center; color: #333;">Puppy Sale Contract</h1>
      <p style="text-align: center;">${breederBusinessName}</p>
      
      <div style="margin: 20px 0;">
        <p>This agreement is made on ${format(new Date(contractDate), 'MMMM d, yyyy')} between:</p>
        <p><strong>Seller:</strong> ${breederName} of ${breederBusinessName}</p>
        <p><strong>Buyer:</strong> ${customerName}</p>
      </div>

      <div style="margin: 20px 0;">
        <h2>Puppy Information</h2>
        <p><strong>Name:</strong> ${puppyName || 'Not named'}</p>
        <p><strong>Date of Birth:</strong> ${puppyDob ? format(new Date(puppyDob), 'MMMM d, yyyy') : 'Not specified'}</p>
        <p><strong>Microchip Number:</strong> ${microchipNumber || 'Not specified'}</p>
        <p><strong>Purchase Price:</strong> $${salePrice?.toFixed(2) || 'Not specified'}</p>
      </div>

      <div style="margin: 20px 0;">
        <h2>Terms and Conditions</h2>
        <ol>
          <li>The Seller guarantees that the puppy is in good health at the time of sale.</li>
          <li>The Buyer agrees to provide proper care, including regular veterinary checkups.</li>
          <li>The Seller provides a health guarantee for genetic defects for 24 months from the date of birth.</li>
          <li>This puppy is being sold as a pet/companion animal.</li>
        </ol>
      </div>

      ${signatureSection}
      
      ${signed ? '<div style="text-align: center; margin-top: 30px;"><p style="color: green; font-weight: bold;">This contract has been signed electronically</p></div>' : ''}
    </div>
  `;
};

export const downloadContract = (html: string, filename: string) => {
  const element = document.createElement('a');
  const file = new Blob([html], { type: 'text/html' });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};
