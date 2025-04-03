
export interface ContractData {
  breederName: string;
  breederBusinessName: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  puppyName: string | null;
  puppyId?: string;
  puppyDob: string | null;
  puppyBreed?: string;
  puppyColor?: string;
  puppyGender?: string;
  microchipNumber?: string | null;
  salePrice: number | null;
  contractDate: string;
  contractType: 'pet' | 'breeding' | 'co-ownership' | 'other';
  healthGuarantee?: string;
  returnPolicy?: string;
  specialConditions?: string;
  signatureUrl?: string;
}

export interface ContractTemplate {
  id: string;
  name: string;
  description?: string;
  content: string;
  contractType: 'pet' | 'breeding' | 'co-ownership' | 'other';
  isDefault?: boolean;
}
