
import { rgb } from 'pdf-lib';
import { format } from 'date-fns';
import { ContractData, PdfDocumentContext } from '../types';

export function renderPremiumTemplate(
  data: ContractData,
  context: PdfDocumentContext
): void {
  const { pdfDoc, page, fonts, dimensions } = context;
  const { width, height, margin } = dimensions;
  const { regular: timesRoman, bold: timesBold } = fonts;
  
  // Set some starting positions
  let yPos = height - margin;
  const fontSize = 12;
  const headerSize = 18;
  const subHeaderSize = 14;
  const lineHeight = fontSize * 1.5;
  
  // Add contract title with premium styling
  page.drawText('PREMIUM PUPPY SALE CONTRACT', {
    x: width / 2 - 130,
    y: yPos,
    size: headerSize,
    font: timesBold,
    color: rgb(0.1, 0.3, 0.5),
  });
  
  yPos -= headerSize * 2;
  
  // Add breeder business name
  page.drawText(data.breederBusinessName, {
    x: width / 2 - (data.breederBusinessName.length * 4),
    y: yPos,
    size: subHeaderSize,
    font: timesBold,
    color: rgb(0.1, 0.3, 0.5),
  });
  
  yPos -= lineHeight * 2;
  
  // Agreement date
  const formattedDate = format(new Date(data.contractDate), 'MMMM d, yyyy');
  
  page.drawText(`This premium agreement is made on ${formattedDate} between:`, {
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
    color: rgb(0.1, 0.3, 0.5),
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
  page.drawText('Premium Terms and Conditions', {
    x: margin,
    y: yPos,
    size: subHeaderSize,
    font: timesBold,
    color: rgb(0.1, 0.3, 0.5),
  });
  
  yPos -= lineHeight;
  
  // Add premium clauses
  const premiumClauses = [
    'The Seller guarantees that the puppy is in good health at the time of sale.',
    'The Buyer agrees to provide proper care, including regular veterinary checkups.',
    'The Seller provides a health guarantee for genetic defects for 36 months from the date of birth.',
    'This puppy is being sold as a pet/companion animal.',
    'The Seller agrees to provide lifetime support and advice regarding the care of the puppy.',
    'The puppy has undergone initial training and socialization by the Seller.',
    'The Buyer agrees to notify the Seller of any change in address or contact information.'
  ];
  
  // Add additional custom clauses if provided
  const clauses = [...premiumClauses, ...(data.additionalClauses || [])];
  
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
}
