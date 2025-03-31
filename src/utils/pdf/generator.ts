
import { PDFDocument, StandardFonts } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { ContractData, ContractTemplate, PdfDocumentContext } from './types';
import { renderTemplate } from './templates';

/**
 * Function to generate a PDF contract
 */
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
  
  // Set up context for rendering the template
  const context: PdfDocumentContext = {
    pdfDoc,
    page,
    fonts: {
      regular: timesRoman,
      bold: timesBold
    },
    dimensions: {
      width,
      height,
      margin: 50
    }
  };
  
  // Render the appropriate template
  renderTemplate(data, context, templateType);
  
  // Serialize the PDF to bytes
  return await pdfDoc.save();
};
