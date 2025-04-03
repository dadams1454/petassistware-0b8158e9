
import React from 'react';
import { FileText, Thermometer, Syringe, Pill, Scissors, Eye } from 'lucide-react';
import { HealthRecordTypeEnum } from '@/types/health';

export const getRecordTypeIcon = (recordType: string) => {
  switch (recordType) {
    case HealthRecordTypeEnum.Vaccination:
      return <Syringe className="h-4 w-4" />;
    
    case HealthRecordTypeEnum.Examination:
      return <Thermometer className="h-4 w-4" />;
    
    case HealthRecordTypeEnum.Medication:
      return <Pill className="h-4 w-4" />;
    
    case HealthRecordTypeEnum.Surgery:
      return <Scissors className="h-4 w-4" />;
    
    case HealthRecordTypeEnum.Observation:
      return <Eye className="h-4 w-4" />;
    
    default:
      return <FileText className="h-4 w-4" />;
  }
};

export const getRecordTypeLabel = (recordType: string) => {
  switch (recordType) {
    case HealthRecordTypeEnum.Vaccination:
      return 'Vaccination';
    
    case HealthRecordTypeEnum.Examination:
      return 'Examination';
    
    case HealthRecordTypeEnum.Medication:
      return 'Medication';
    
    case HealthRecordTypeEnum.Surgery:
      return 'Surgery';
    
    case HealthRecordTypeEnum.Observation:
      return 'Observation';
    
    default:
      return recordType.charAt(0).toUpperCase() + recordType.slice(1);
  }
};

export const recordTypeOptions = [
  { value: HealthRecordTypeEnum.Examination, label: 'Examination' },
  { value: HealthRecordTypeEnum.Vaccination, label: 'Vaccination' },
  { value: HealthRecordTypeEnum.Medication, label: 'Medication' },
  { value: HealthRecordTypeEnum.Surgery, label: 'Surgery' },
  { value: HealthRecordTypeEnum.Dental, label: 'Dental' },
  { value: HealthRecordTypeEnum.Allergy, label: 'Allergy' },
  { value: HealthRecordTypeEnum.Test, label: 'Test' },
  { value: HealthRecordTypeEnum.Observation, label: 'Observation' },
  { value: HealthRecordTypeEnum.Deworming, label: 'Deworming' },
  { value: HealthRecordTypeEnum.Grooming, label: 'Grooming' },
  { value: HealthRecordTypeEnum.Other, label: 'Other' }
];
