
import React from 'react';
import { FileText, Thermometer, Syringe, Pill, Scissors, Eye, Stethoscope, AlertTriangle, Tooth } from 'lucide-react';
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
      
    case HealthRecordTypeEnum.Dental:
      return <Tooth className="h-4 w-4" />;
      
    case HealthRecordTypeEnum.Test:
      return <Stethoscope className="h-4 w-4" />;
      
    case HealthRecordTypeEnum.Allergy:
      return <AlertTriangle className="h-4 w-4" />;
    
    default:
      return <FileText className="h-4 w-4" />;
  }
};

export const getRecordTypeColor = (recordType: string): string => {
  switch (recordType) {
    case HealthRecordTypeEnum.Vaccination:
      return 'text-blue-500';
    
    case HealthRecordTypeEnum.Examination:
      return 'text-green-500';
    
    case HealthRecordTypeEnum.Medication:
      return 'text-purple-500';
    
    case HealthRecordTypeEnum.Surgery:
      return 'text-red-500';
    
    case HealthRecordTypeEnum.Dental:
      return 'text-amber-500';
      
    case HealthRecordTypeEnum.Allergy:
      return 'text-yellow-500';
      
    case HealthRecordTypeEnum.Test:
      return 'text-cyan-500';
      
    case HealthRecordTypeEnum.Observation:
      return 'text-gray-500';
    
    default:
      return 'text-gray-500';
  }
};

export const getHealthRecordIcon = getRecordTypeIcon;
export const getHealthRecordColor = getRecordTypeColor;

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
      
    case HealthRecordTypeEnum.Dental:
      return 'Dental';
      
    case HealthRecordTypeEnum.Allergy:
      return 'Allergy';
      
    case HealthRecordTypeEnum.Test:
      return 'Test';
      
    case HealthRecordTypeEnum.Deworming:
      return 'Deworming';
      
    case HealthRecordTypeEnum.Grooming:
      return 'Grooming';
    
    default:
      return recordType.charAt(0).toUpperCase() + recordType.slice(1);
  }
};
