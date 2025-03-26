
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DogCareStatus } from '@/types/dailyCare';
import MedicationsLog from '@/components/dogs/components/care/medications/MedicationsLog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MedicationFrequency } from '@/utils/medicationUtils';

interface MedicationsTabProps {
  dogStatuses: DogCareStatus[] | null;
  onRefreshDogs: () => void;
}

const MedicationsTab: React.FC<MedicationsTabProps> = ({ dogStatuses, onRefreshDogs }) => {
  const [filterFrequency, setFilterFrequency] = useState<string>("all");
  
  return (
    <>
      {dogStatuses && dogStatuses.length > 0 ? (
        <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-200 dark:border-purple-800 mb-4">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
            <div>
              <h3 className="text-lg font-medium text-purple-800 dark:text-purple-300">Medication Tracking</h3>
              <p className="text-sm text-purple-600 dark:text-purple-400">
                Track preventative medications and treatments for all dogs.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-purple-700 dark:text-purple-300">
                Filter by:
              </span>
              <Select 
                value={filterFrequency} 
                onValueChange={setFilterFrequency}
              >
                <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Frequencies</SelectItem>
                  <SelectItem value={MedicationFrequency.DAILY}>Daily</SelectItem>
                  <SelectItem value={MedicationFrequency.WEEKLY}>Weekly</SelectItem>
                  <SelectItem value={MedicationFrequency.MONTHLY}>Monthly</SelectItem>
                  <SelectItem value={MedicationFrequency.QUARTERLY}>Quarterly</SelectItem>
                  <SelectItem value={MedicationFrequency.ANNUAL}>Annual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      ) : null}
      
      {dogStatuses && dogStatuses.length > 0 ? (
        <MedicationsLog
          dogs={dogStatuses}
          onRefresh={onRefreshDogs}
        />
      ) : (
        <div className="p-8 text-center border rounded-lg">
          <p className="text-muted-foreground">No dogs found. Please refresh or add dogs to the system.</p>
          <Button onClick={onRefreshDogs} className="mt-4">Refresh Dogs</Button>
        </div>
      )}
    </>
  );
};

export default MedicationsTab;
