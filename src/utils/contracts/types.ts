
export interface ContractData {
  breederName: string;
  breederBusinessName: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  puppyName: string;
  puppyId?: string;
  puppyDob: string;
  puppyBreed?: string;
  puppyColor?: string;
  puppyGender?: string;
  microchipNumber?: string;
  salePrice: number;
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
