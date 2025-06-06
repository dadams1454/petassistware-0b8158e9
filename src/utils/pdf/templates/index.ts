
import { ContractData, ContractTemplate, PdfDocumentContext } from '../types';
import { renderStandardTemplate } from './standard';
import { renderPremiumTemplate } from './premium';
import { renderSimpleTemplate } from './simple';
import { renderAkcRegistrationTemplate, AkcRegistrationData } from './akcRegistration';

export function renderTemplate(
  data: ContractData,
  context: PdfDocumentContext,
  templateType: ContractTemplate = 'standard'
): void {
  switch (templateType) {
    case 'premium':
      renderPremiumTemplate(data, context);
      break;
    case 'simple':
      renderSimpleTemplate(data, context);
      break;
    case 'standard':
    default:
      renderStandardTemplate(data, context);
      break;
  }
}

export { renderAkcRegistrationTemplate };
export type { AkcRegistrationData };
