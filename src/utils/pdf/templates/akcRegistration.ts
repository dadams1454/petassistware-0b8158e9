
import { PdfDocumentContext } from '../types';
import { rgb } from 'pdf-lib';

/**
 * Renders an AKC Litter Registration form using puppy and litter data
 */
export function renderAkcRegistrationTemplate(
  data: AkcRegistrationData,
  context: PdfDocumentContext
): void {
  const { pdfDoc, fonts, dimensions } = context;
  let { page } = context; // Changed from const to let
  const { width, height, margin } = dimensions;
  const { regular, bold } = fonts;

  // Set up constants for positioning
  const centerX = width / 2;
  const startY = height - margin;
  let currentY = startY;
  const lineHeight = 24;
  const subLineHeight = 18;
  const columnWidth = (width - margin * 2) / 2 - 10;

  // Draw AKC logo and header
  page.drawText('AKC LITTER REGISTRATION APPLICATION', {
    x: centerX - 210,
    y: currentY,
    size: 16,
    font: bold,
  });

  currentY -= lineHeight * 1.5;

  // Draw form description
  page.drawText('This application is for the purpose of registering a litter of puppies with the American Kennel Club®', {
    x: margin,
    y: currentY,
    size: 10,
    font: regular,
  });

  currentY -= lineHeight;

  // Draw Litter Information section
  page.drawText('LITTER INFORMATION', {
    x: margin,
    y: currentY,
    size: 12,
    font: bold,
  });

  currentY -= lineHeight;

  // Draw form fields
  const drawField = (label: string, value: string, x: number, y: number, width: number) => {
    page.drawText(label, {
      x,
      y,
      size: 9,
      font: bold,
    });

    page.drawRectangle({
      x,
      y: y - 15,
      width: width,
      height: 20,
      borderWidth: 1,
      borderColor: rgb(0, 0, 0),
      opacity: 0.1,
    });

    page.drawText(value || '', {
      x: x + 5,
      y: y - 10,
      size: 10,
      font: regular,
    });
  };

  // Litter details
  drawField('AKC Litter Number:', data.akcLitterNumber || 'Pending', margin, currentY, columnWidth);
  drawField('Breed:', data.breed, margin + columnWidth + 20, currentY, columnWidth);

  currentY -= lineHeight * 1.5;

  drawField('Litter Date of Birth:', data.birthDate, margin, currentY, columnWidth);
  drawField('Number of Puppies:', `Males: ${data.maleCount} Females: ${data.femaleCount}`, margin + columnWidth + 20, currentY, columnWidth);

  currentY -= lineHeight * 1.5;

  // Sire & Dam Information
  page.drawText('SIRE (FATHER) INFORMATION', {
    x: margin,
    y: currentY,
    size: 12,
    font: bold,
  });

  currentY -= lineHeight;

  drawField('Sire Name:', data.sireName, margin, currentY, columnWidth);
  drawField('AKC Registration Number:', data.sireRegistrationNumber || '', margin + columnWidth + 20, currentY, columnWidth);

  currentY -= lineHeight * 1.5;

  page.drawText('DAM (MOTHER) INFORMATION', {
    x: margin,
    y: currentY,
    size: 12,
    font: bold,
  });

  currentY -= lineHeight;

  drawField('Dam Name:', data.damName, margin, currentY, columnWidth);
  drawField('AKC Registration Number:', data.damRegistrationNumber || '', margin + columnWidth + 20, currentY, columnWidth);

  currentY -= lineHeight * 1.5;

  // Breeder Information
  page.drawText('BREEDER INFORMATION', {
    x: margin,
    y: currentY,
    size: 12,
    font: bold,
  });

  currentY -= lineHeight;

  drawField('Breeder Name:', data.breederName, margin, currentY, width - margin * 2);

  currentY -= lineHeight;

  drawField('Kennel Name:', data.kennelName || '', margin, currentY, width - margin * 2);

  currentY -= lineHeight * 1.5;

  // Puppy Information Header
  page.drawText('PUPPY INFORMATION', {
    x: margin,
    y: currentY,
    size: 12,
    font: bold,
  });

  currentY -= lineHeight;

  // Column headers for puppy table
  const tableX = margin;
  const colWidths = [40, 180, 80, 180];
  let tableY = currentY;

  const drawTableHeader = () => {
    page.drawRectangle({
      x: tableX,
      y: tableY - 20,
      width: width - margin * 2,
      height: 20,
      borderWidth: 1,
      borderColor: rgb(0, 0, 0),
      color: rgb(0.9, 0.9, 0.9),
    });

    let colX = tableX;
    ['#', 'Puppy Name', 'Gender', 'Microchip #', 'Color'].forEach((header, index) => {
      page.drawText(header, {
        x: colX + 5,
        y: tableY - 15,
        size: 10,
        font: bold,
      });
      colX += colWidths[index] || 80;
    });

    tableY -= 20;
  };

  drawTableHeader();

  // Puppy rows
  data.puppies.forEach((puppy, index) => {
    // Check if we need a new page
    if (tableY < margin + 50) {
      page = pdfDoc.addPage([612, 792]);
      tableY = height - margin;
      drawTableHeader();
    }

    // Draw alternating row background
    if (index % 2 === 0) {
      page.drawRectangle({
        x: tableX,
        y: tableY - 20,
        width: width - margin * 2,
        height: 20,
        borderWidth: 1,
        borderColor: rgb(0, 0, 0),
        color: rgb(0.95, 0.95, 0.95),
      });
    }

    let colX = tableX;
    
    // Puppy number
    page.drawText((index + 1).toString(), {
      x: colX + 5,
      y: tableY - 15,
      size: 10,
      font: regular,
    });
    colX += colWidths[0];
    
    // Puppy name
    page.drawText(puppy.name || `Puppy ${index + 1}`, {
      x: colX + 5,
      y: tableY - 15,
      size: 10,
      font: regular,
    });
    colX += colWidths[1];
    
    // Gender
    page.drawText(puppy.gender, {
      x: colX + 5,
      y: tableY - 15,
      size: 10,
      font: regular,
    });
    colX += colWidths[2];
    
    // Microchip
    page.drawText(puppy.microchipNumber || 'Not chipped', {
      x: colX + 5,
      y: tableY - 15,
      size: 10,
      font: regular,
    });
    colX += colWidths[3];
    
    // Color
    page.drawText(puppy.color || '', {
      x: colX + 5,
      y: tableY - 15,
      size: 10,
      font: regular,
    });

    tableY -= 20;
  });

  // Add signature section
  tableY -= lineHeight * 2;
  
  if (tableY < margin + 100) {
    page = pdfDoc.addPage([612, 792]);
    tableY = height - margin;
  }

  page.drawText('CERTIFICATION', {
    x: margin,
    y: tableY,
    size: 12,
    font: bold,
  });

  tableY -= lineHeight;

  page.drawText('I (we) certify that I (we) am (are) the owner(s) of the identified dam on the date of birth of the litter.', {
    x: margin,
    y: tableY,
    size: 10,
    font: regular,
  });
  
  tableY -= lineHeight;

  page.drawText('I (we) further certify that the dam was mated only to the identified sire during her season.', {
    x: margin,
    y: tableY,
    size: 10,
    font: regular,
  });

  tableY -= lineHeight * 2;

  page.drawLine({
    start: { x: margin, y: tableY },
    end: { x: margin + 200, y: tableY },
    thickness: 1,
  });

  page.drawText('Signature of Owner of Dam', {
    x: margin,
    y: tableY - 15,
    size: 9,
    font: regular,
  });

  page.drawLine({
    start: { x: width - margin - 200, y: tableY },
    end: { x: width - margin, y: tableY },
    thickness: 1,
  });

  page.drawText('Date', {
    x: width - margin - 200,
    y: tableY - 15,
    size: 9,
    font: regular,
  });

  // AKC disclaimer
  tableY -= lineHeight * 3;
  
  page.drawText('This is not an official AKC form. This document is generated for pre-submission review only.', {
    x: centerX - 220,
    y: tableY,
    size: 8,
    font: regular,
  });
  
  tableY -= lineHeight;
  
  page.drawText('Submit your litter registration through the official AKC website or mail service.', {
    x: centerX - 180,
    y: tableY,
    size: 8,
    font: regular,
  });
}

export interface AkcPuppyData {
  name: string;
  gender: string;
  microchipNumber?: string;
  color?: string;
}

export interface AkcRegistrationData {
  // Litter information
  akcLitterNumber?: string;
  breed: string;
  birthDate: string;
  maleCount: number;
  femaleCount: number;
  
  // Sire information
  sireName: string;
  sireRegistrationNumber?: string;
  
  // Dam information
  damName: string;
  damRegistrationNumber?: string;
  
  // Breeder information
  breederName: string;
  kennelName?: string;
  
  // Puppy information
  puppies: AkcPuppyData[];
}
