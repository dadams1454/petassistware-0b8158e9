
import { supabase } from '@/integrations/supabase/client';
import { PDFDocument } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { StandardFonts } from 'pdf-lib';
import { renderAkcRegistrationTemplate, AkcRegistrationData } from '@/utils/pdf/templates/akcRegistration';
import { PdfDocumentContext } from '@/utils/pdf/types';
import { Litter, Puppy, SimpleDog } from '@/types/litter';

/**
 * Generates AKC registration data from a litter ID
 */
export const getAkcRegistrationData = async (litterId: string): Promise<AkcRegistrationData | null> => {
  try {
    // Fetch litter data with dam and sire information
    const { data: litter, error: litterError } = await supabase
      .from('litters')
      .select(`
        *,
        dam:dam_id(*),
        sire:sire_id(*)
      `)
      .eq('id', litterId)
      .single();
    
    if (litterError) throw litterError;
    if (!litter) return null;
    
    // Fetch puppies data for this litter
    const { data: puppies, error: puppiesError } = await supabase
      .from('puppies')
      .select('*')
      .eq('litter_id', litterId);
    
    if (puppiesError) throw puppiesError;
    
    // Get breeder information
    const { data: breeder, error: breederError } = await supabase
      .from('breeder_profiles')
      .select('first_name, last_name, business_name')
      .eq('id', litter.breeder_id)
      .single();
    
    if (breederError) throw breederError;

    // Format the data for AKC registration
    return {
      akcLitterNumber: litter.akc_registration_number || undefined,
      breed: (litter.dam as SimpleDog)?.breed || '',
      birthDate: litter.birth_date,
      maleCount: litter.male_count || 0,
      femaleCount: litter.female_count || 0,
      
      sireName: (litter.sire as SimpleDog)?.name || 'Unknown',
      sireRegistrationNumber: (litter.sire as any)?.registration_number,
      
      damName: (litter.dam as SimpleDog)?.name || 'Unknown',
      damRegistrationNumber: (litter.dam as any)?.registration_number,
      
      breederName: `${breeder?.first_name || ''} ${breeder?.last_name || ''}`.trim(),
      kennelName: litter.kennel_name || breeder?.business_name,
      
      puppies: (puppies || []).map(puppy => ({
        name: puppy.name || '',
        gender: puppy.gender || '',
        microchipNumber: puppy.microchip_number,
        color: puppy.color
      }))
    };
  } catch (error) {
    console.error('Error generating AKC registration data:', error);
    return null;
  }
};

/**
 * Generates an AKC registration form PDF for a specific litter
 */
export const generateAkcRegistrationPdf = async (litterId: string): Promise<Uint8Array | null> => {
  try {
    // Get the AKC registration data
    const registrationData = await getAkcRegistrationData(litterId);
    if (!registrationData) {
      throw new Error('Unable to retrieve litter data for AKC registration');
    }
    
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
    
    // Render the AKC registration template
    renderAkcRegistrationTemplate(registrationData, context);
    
    // Serialize the PDF to bytes
    return await pdfDoc.save();
  } catch (error) {
    console.error('Error generating AKC registration PDF:', error);
    return null;
  }
};
