
// This file maintains backwards compatibility with existing code
// but delegates to the new modular structure

import { ContractData } from './contracts/types';
import { generateContractHTML } from './contracts/htmlGenerator';
import { downloadContract } from './contracts/download';

// Re-export for backwards compatibility
export { generateContractHTML, downloadContract };

// Note: This legacy interface is maintained for backward compatibility
// but we recommend using the new ContractData type from @/utils/contracts/types
export interface LegacyContractData {
  breederName: string;
  breederBusinessName: string;
  customerName: string;
  puppyName: string | null;
  puppyDob: string | null;
  salePrice: number | null;
  contractDate: string;
  microchipNumber: string | null;
}
