
import { PDFDocument } from 'pdf-lib';

/**
 * Function to create a download for the PDF bytes
 */
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

/**
 * Function to generate a preview URL for the PDF
 */
export const generatePdfPreviewUrl = async (pdfBytes: Uint8Array): Promise<string> => {
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  return URL.createObjectURL(blob);
};
