
import React from 'react';
import { EmptyState } from '@/components/ui/standardized';
import VaccinationSection from '../../health/VaccinationSection';
import { useHealthTabContext } from './HealthTabContext';

const VaccinationsTabContent: React.FC = () => {
  const {
    getRecordsByType,
    getUpcomingVaccinations,
    getOverdueVaccinations,
    handleAddRecord,
    handleEditRecord,
    deleteHealthRecord,
    isLoading
  } = useHealthTabContext();

  const vaccinations = getRecordsByType('vaccination');

  if (vaccinations.length === 0) {
    return (
      <EmptyState
        title="No vaccination records"
        description="Start tracking this dog's vaccinations to ensure they stay up-to-date on important shots."
        action={{
          label: "Add Vaccination",
          onClick: () => handleAddRecord('vaccination')
        }}
      />
    );
  }

  return (
    <VaccinationSection 
      vaccinations={vaccinations}
      upcomingVaccinations={getUpcomingVaccinations()}
      overdueVaccinations={getOverdueVaccinations()}
      onAdd={() => handleAddRecord('vaccination')}
      onEdit={handleEditRecord}
      onDelete={deleteHealthRecord}
      isLoading={isLoading}
    />
  );
};

export default VaccinationsTabContent;
