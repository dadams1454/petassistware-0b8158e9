
import React from 'react';
import { Plus } from 'lucide-react';
import { ActionButton } from '@/components/ui/standardized';
import { useHealthTabContext } from './HealthTabContext';

const HealthTabActions = () => {
  const { 
    activeTab, 
    openAddVaccinationDialog, 
    openAddExaminationDialog,
    openAddMedicationDialog,
    openAddWeightDialog 
  } = useHealthTabContext();

  const getButtonProps = () => {
    switch (activeTab) {
      case 'vaccinations':
        return {
          label: 'Add Vaccination',
          onClick: openAddVaccinationDialog
        };
      case 'examinations':
        return {
          label: 'Add Examination',
          onClick: openAddExaminationDialog
        };
      case 'medications':
        return {
          label: 'Add Medication',
          onClick: openAddMedicationDialog
        };
      case 'weight':
        return {
          label: 'Add Weight',
          onClick: openAddWeightDialog
        };
      default:
        return null;
    }
  };

  const buttonProps = getButtonProps();

  if (!buttonProps || activeTab === 'summary') {
    return null;
  }

  return (
    <ActionButton
      onClick={buttonProps.onClick}
      icon={<Plus className="w-4 h-4 mr-2" />}
    >
      {buttonProps.label}
    </ActionButton>
  );
};

export default HealthTabActions;
