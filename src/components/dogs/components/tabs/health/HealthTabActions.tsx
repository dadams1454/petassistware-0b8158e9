
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Activity, Syringe, Stethoscope, Pill } from 'lucide-react';
import { useHealthTabContext } from './HealthTabContext';

const HealthTabActions: React.FC = () => {
  const { 
    openAddVaccinationDialog, 
    openAddExaminationDialog, 
    openAddMedicationDialog,
    openAddWeightDialog,
    openAddHealthIndicatorDialog,
    activeTab
  } = useHealthTabContext();
  
  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={openAddVaccinationDialog} variant="outline" size="sm">
        <Syringe className="h-4 w-4 mr-2" />
        Add Vaccination
      </Button>
      
      <Button onClick={openAddExaminationDialog} variant="outline" size="sm">
        <Stethoscope className="h-4 w-4 mr-2" />
        Add Examination
      </Button>
      
      <Button onClick={openAddMedicationDialog} variant="outline" size="sm">
        <Pill className="h-4 w-4 mr-2" />
        Add Medication
      </Button>
      
      <Button onClick={openAddWeightDialog} variant="outline" size="sm">
        <PlusCircle className="h-4 w-4 mr-2" />
        Add Weight
      </Button>
      
      <Button onClick={openAddHealthIndicatorDialog} variant="outline" size="sm">
        <Activity className="h-4 w-4 mr-2" />
        Record Health Indicators
      </Button>
    </div>
  );
};

export default HealthTabActions;
