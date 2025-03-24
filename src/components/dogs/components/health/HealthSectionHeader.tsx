
import React from 'react';
import { addDays } from 'date-fns';

interface HealthSectionHeaderProps {
  gender: string;
  isPregnant: boolean;
  lastHeatDate: Date | null;
  tieDate: Date | null;
  litterNumber: number;
  nextHeatDate: Date | null;
  hasVaccinationConflict: boolean;
}

const HealthSectionHeader: React.FC<HealthSectionHeaderProps> = ({
  gender,
  isPregnant,
  lastHeatDate,
  tieDate,
  litterNumber,
  nextHeatDate,
  hasVaccinationConflict
}) => {
  if (gender !== 'Female') return null;
  
  return (
    <div className="p-4 rounded-lg border-2 border-purple-200 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-semibold text-base text-purple-800 dark:text-purple-300">Breeding Information</h4>
        {isPregnant && (
          <span className="bg-pink-100 text-pink-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300">
            Pregnant
          </span>
        )}
      </div>
      
      <BreedingInfoSection 
        lastHeatDate={lastHeatDate}
        isPregnant={isPregnant}
        tieDate={tieDate}
        litterNumber={litterNumber}
        nextHeatDate={nextHeatDate}
        hasVaccinationConflict={hasVaccinationConflict}
      />
    </div>
  );
};

const BreedingInfoSection = ({
  lastHeatDate,
  isPregnant,
  tieDate,
  litterNumber,
  nextHeatDate,
  hasVaccinationConflict
}: {
  lastHeatDate: Date | null;
  isPregnant: boolean;
  tieDate: Date | null;
  litterNumber: number;
  nextHeatDate: Date | null;
  hasVaccinationConflict: boolean;
}) => {
  return (
    <div className="space-y-1 text-sm">
      {lastHeatDate && (
        <div className="flex justify-between">
          <span className="text-purple-700 dark:text-purple-300">Last Heat:</span>
          <span className="font-medium">{lastHeatDate.toLocaleDateString()}</span>
        </div>
      )}
      
      {nextHeatDate && !isPregnant && (
        <div className="flex justify-between">
          <span className="text-purple-700 dark:text-purple-300">Next Heat (estimated):</span>
          <span className="font-medium">{nextHeatDate.toLocaleDateString()}</span>
        </div>
      )}
      
      {tieDate && (
        <div className="flex justify-between">
          <span className="text-purple-700 dark:text-purple-300">Breeding Date:</span>
          <span className="font-medium">{tieDate.toLocaleDateString()}</span>
        </div>
      )}
      
      {tieDate && isPregnant && (
        <div className="flex justify-between">
          <span className="text-purple-700 dark:text-purple-300">Due Date (estimated):</span>
          <span className="font-medium">{addDays(tieDate, 63).toLocaleDateString()}</span>
        </div>
      )}
      
      {litterNumber > 0 && (
        <div className="flex justify-between">
          <span className="text-purple-700 dark:text-purple-300">Previous Litters:</span>
          <span className="font-medium">{litterNumber}</span>
        </div>
      )}
      
      {hasVaccinationConflict && (
        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300">
          <strong>Note:</strong> Upcoming vaccinations may conflict with the next heat cycle.
        </div>
      )}
    </div>
  );
};

export default HealthSectionHeader;
