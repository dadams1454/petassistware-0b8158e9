
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { format } from 'date-fns';

// Template types
export type ContractTemplate = 'standard' | 'premium' | 'simple';

export interface ContractData {
  breederName: string;
  breederBusinessName: string;
  customerName: string;
  puppyName: string | null;
  puppyDob: string | null;
  salePrice: number | null;
  contractDate: string;
  microchipNumber: string | null;
  additionalClauses?: string[];
  template?: ContractTemplate;
}

// Function to generate and download a PDF contract
export const generatePdfContract = async (
  data: ContractData,
  templateType: ContractTemplate = 'standard'
): Promise<Uint8Array> => {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  
  // Register fontkit to support custom fonts
  pdfDoc.registerFontkit(fontkit);
  
  // Embed the standard fonts
  const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  
  // Add a page to the document
  const page = pdfDoc.addPage([612, 792]); // Letter size
  const { width, height } = page.getSize();
  
  // Set some starting positions
  const margin = 50;
  let yPos = height - margin;
  const fontSize = 12;
  const headerSize = 18;
  const subHeaderSize = 14;
  const lineHeight = fontSize * 1.5;
  
  // Add contract title
  page.drawText('PUPPY SALE CONTRACT', {
    x: width / 2 - 100,
    y: yPos,
    size: headerSize,
    font: timesBold,
    color: rgb(0, 0, 0),
  });
  
  yPos -= headerSize * 2;
  
  // Add breeder business name
  page.drawText(data.breederBusinessName, {
    x: width / 2 - (data.breederBusinessName.length * 4),
    y: yPos,
    size: subHeaderSize,
    font: timesBold,
    color: rgb(0, 0, 0),
  });
  
  yPos -= lineHeight * 2;
  
  // Agreement date
  const formattedDate = format(new Date(data.contractDate), 'MMMM d, yyyy');
  
  page.drawText(`This agreement is made on ${formattedDate} between:`, {
    x: margin,
    y: yPos,
    size: fontSize,
    font: timesRoman,
    color: rgb(0, 0, 0),
  });
  
  yPos -= lineHeight;
  
  // Seller information
  page.drawText(`Seller: ${data.breederName} of ${data.breederBusinessName}`, {
    x: margin,
    y: yPos,
    size: fontSize,
    font: timesRoman,
    color: rgb(0, 0, 0),
  });
  
  yPos -= lineHeight;
  
  // Buyer information
  page.drawText(`Buyer: ${data.customerName}`, {
    x: margin,
    y: yPos,
    size: fontSize,
    font: timesRoman,
    color: rgb(0, 0, 0),
  });
  
  yPos -= lineHeight * 2;
  
  // Puppy Information Section
  page.drawText('Puppy Information', {
    x: margin,
    y: yPos,
    size: subHeaderSize,
    font: timesBold,
    color: rgb(0, 0, 0),
  });
  
  yPos -= lineHeight;
  
  // Puppy details
  page.drawText(`Name: ${data.puppyName || 'Not named'}`, {
    x: margin,
    y: yPos,
    size: fontSize,
    font: timesRoman,
    color: rgb(0, 0, 0),
  });
  
  yPos -= lineHeight;
  
  const formattedDob = data.puppyDob 
    ? format(new Date(data.puppyDob), 'MMMM d, yyyy') 
    : 'Not specified';
  
  page.drawText(`Date of Birth: ${formattedDob}`, {
    x: margin,
    y: yPos,
    size: fontSize,
    font: timesRoman,
    color: rgb(0, 0, 0),
  });
  
  yPos -= lineHeight;
  
  page.drawText(`Microchip Number: ${data.microchipNumber || 'Not specified'}`, {
    x: margin,
    y: yPos,
    size: fontSize,
    font: timesRoman,
    color: rgb(0, 0, 0),
  });
  
  yPos -= lineHeight;
  
  const price = data.salePrice 
    ? `$${data.salePrice.toFixed(2)}` 
    : 'Not specified';
  
  page.drawText(`Purchase Price: ${price}`, {
    x: margin,
    y: yPos,
    size: fontSize,
    font: timesRoman,
    color: rgb(0, 0, 0),
  });
  
  yPos -= lineHeight * 2;
  
  // Terms and Conditions
  page.drawText('Terms and Conditions', {
    x: margin,
    y: yPos,
    size: subHeaderSize,
    font: timesBold,
    color: rgb(0, 0, 0),
  });
  
  yPos -= lineHeight;
  
  // Add standard clauses based on template
  const standardClauses = [
    'The Seller guarantees that the puppy is in good health at the time of sale.',
    'The Buyer agrees to provide proper care, including regular veterinary checkups.',
    'The Seller provides a health guarantee for genetic defects for 24 months from the date of birth.',
    'This puppy is being sold as a pet/companion animal.'
  ];
  
  // Add premium clauses if premium template
  if (templateType === 'premium') {
    standardClauses.push(
      'The Seller agrees to provide lifetime support and advice regarding the care of the puppy.',
      'The puppy has undergone initial training and socialization by the Seller.',
      'The Buyer agrees to notify the Seller of any change in address or contact information.'
    );
  }
  
  // Add additional custom clauses if provided
  const clauses = [...standardClauses, ...(data.additionalClauses || [])];
  
  // Add clauses with numbers
  clauses.forEach((clause, index) => {
    page.drawText(`${index + 1}. ${clause}`, {
      x: margin,
      y: yPos,
      size: fontSize,
      font: timesRoman,
      color: rgb(0, 0, 0),
      maxWidth: width - margin * 2,
      lineHeight,
    });
    yPos -= lineHeight * 1.5;
  });
  
  yPos -= lineHeight * 2;
  
  // Signature lines
  page.drawText('Seller\'s Signature: _________________________', {
    x: margin,
    y: yPos,
    size: fontSize,
    font: timesRoman,
    color: rgb(0, 0, 0),
  });
  
  page.drawText('Date: _________________________', {
    x: margin,
    y: yPos - lineHeight,
    size: fontSize,
    font: timesRoman,
    color: rgb(0, 0, 0),
  });
  
  page.drawText('Buyer\'s Signature: _________________________', {
    x: width / 2,
    y: yPos,
    size: fontSize,
    font: timesRoman,
    color: rgb(0, 0, 0),
  });
  
  page.drawText('Date: _________________________', {
    x: width / 2,
    y: yPos - lineHeight,
    size: fontSize,
    font: timesRoman,
    color: rgb(0, 0, 0),
  });
  
  // Serialize the PDF to bytes
  return await pdfDoc.save();
};

// Function to create a download for the PDF bytes
export const downloadPdf = (pdfBytes: Uint8Array, filename: string): void => {
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Function to generate a preview URL for the PDF
export const generatePdfPreviewUrl = async (pdfBytes: Uint8Array): Promise<string> => {
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  return URL.createObjectURL(blob);
};
