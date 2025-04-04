
import React from 'react';
import { 
  Stethoscope, 
  Syringe, 
  Pill, 
  Scalpel, 
  FileText, 
  Microscope, 
  Camera, 
  Tooth, 
  AlertTriangle, 
  ShieldAlert, 
  Eye, 
  Droplets, 
  Scissors, 
  TestTube,
  LucideIcon
} from 'lucide-react';
import { HealthRecordTypeEnum } from '@/types/health';

// Function to get the appropriate icon for each health record type
export function getHealthRecordIcon(recordType: HealthRecordTypeEnum): LucideIcon {
  switch(recordType) {
    case HealthRecordTypeEnum.Examination:
      return Stethoscope;
    case HealthRecordTypeEnum.Vaccination:
      return Syringe;
    case HealthRecordTypeEnum.Medication:
      return Pill;
    case HealthRecordTypeEnum.Surgery:
      return Scalpel;
    case HealthRecordTypeEnum.Laboratory:
      return Microscope;
    case HealthRecordTypeEnum.Imaging:
      return Camera;
    case HealthRecordTypeEnum.Dental:
      return Tooth;
    case HealthRecordTypeEnum.Allergy:
      return AlertTriangle;
    case HealthRecordTypeEnum.Emergency:
      return ShieldAlert;
    case HealthRecordTypeEnum.Preventive:
      return Eye;
    case HealthRecordTypeEnum.Observation:
      return Eye;
    case HealthRecordTypeEnum.Deworming:
      return Droplets;
    case HealthRecordTypeEnum.Grooming:
      return Scissors;
    case HealthRecordTypeEnum.Test:
      return TestTube;
    case HealthRecordTypeEnum.Procedure:
      return Scalpel;
    case HealthRecordTypeEnum.Other:
    default:
      return FileText;
  }
}

// Function to get color for health record types
export function getHealthRecordColor(recordType: HealthRecordTypeEnum): string {
  switch(recordType) {
    case HealthRecordTypeEnum.Examination:
      return 'text-blue-500';
    case HealthRecordTypeEnum.Vaccination:
      return 'text-green-500';
    case HealthRecordTypeEnum.Medication:
      return 'text-purple-500';
    case HealthRecordTypeEnum.Surgery:
      return 'text-red-500';
    case HealthRecordTypeEnum.Emergency:
      return 'text-red-600';
    case HealthRecordTypeEnum.Preventive:
      return 'text-sky-500';
    case HealthRecordTypeEnum.Deworming:
      return 'text-teal-500';
    case HealthRecordTypeEnum.Laboratory:
      return 'text-amber-500';
    case HealthRecordTypeEnum.Observation:
      return 'text-amber-600';
    default:
      return 'text-gray-500';
  }
}
