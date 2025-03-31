
import { PDFDocument } from 'pdf-lib';

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

export interface PdfDocumentContext {
  pdfDoc: PDFDocument;
  page: PDFPage;
  fonts: {
    regular: PDFFont;
    bold: PDFFont;
  };
  dimensions: {
    width: number;
    height: number;
    margin: number;
  };
}

export type PDFPage = ReturnType<PDFDocument['addPage']>;
export type PDFFont = Awaited<ReturnType<PDFDocument['embedFont']>>;
