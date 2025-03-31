
import { rgb } from 'pdf-lib';
import { format } from 'date-fns';
import { ContractData, PdfDocumentContext } from '../types';

export function renderSimpleTemplate(
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
  
  // Add contract title
  page.drawText('SIMPLE PUPPY SALE AGREEMENT', {
    x: width / 2 - 120,
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
  
  page.drawText(`Agreement Date: ${formattedDate}`, {
    x: margin,
    y: yPos,
    size: fontSize,
    font: timesRoman,
    color: rgb(0, 0, 0),
  });
  
  yPos -= lineHeight * 1.5;
  
  // Seller and Buyer information in simple format
  page.drawText(`Seller: ${data.breederName}`, {
    x: margin,
    y: yPos,
    size: fontSize,
    font: timesRoman,
    color: rgb(0, 0, 0),
  });
  
  yPos -= lineHeight;
  
  page.drawText(`Buyer: ${data.customerName}`, {
    x: margin,
    y: yPos,
    size: fontSize,
    font: timesRoman,
    color: rgb(0, 0, 0),
  });
  
  yPos -= lineHeight * 2;
  
  // Puppy details in simple format
  page.drawText(`Puppy Name: ${data.puppyName || 'Not named'}`, {
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
  
  // Simple agreement text
  page.drawText('Agreement:', {
    x: margin,
    y: yPos,
    size: fontSize,
    font: timesBold,
    color: rgb(0, 0, 0),
  });
  
  yPos -= lineHeight;
  
  const simpleClauses = [
    'The puppy is sold in good health at the time of sale.',
    'No guarantee is made regarding future size, temperament, or breeding ability.',
    'This puppy is sold as a companion animal only.'
  ];
  
  // Add additional custom clauses if provided
  const clauses = [...simpleClauses, ...(data.additionalClauses || [])];
  
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
