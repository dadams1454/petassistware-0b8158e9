import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Pill, Clock } from 'lucide-react';
import { format, isValid } from 'date-fns';
import { MedicationInfo } from '../types/medicationTypes';
import { DogCareStatus } from '@/types/dailyCare';
import { getMedicationStatus, isComplexStatus, getStatusValue, getStatusColor } from '@/utils/medicationUtils';
import MedicationStatusDisplay from './MedicationStatus';
import { Button } from '@/components/ui/button';

interface MedicationTableViewProps {
  dogs: DogCareStatus[];
  preventativeMeds: Record<string, MedicationInfo[]>;
  otherMeds: Record<string, MedicationInfo[]>;
  onLogMedication: (dogId: string) => void;
}

const MedicationTableView: React.FC<MedicationTableViewProps> = ({
  dogs,
  preventativeMeds,
  otherMeds,
  onLogMedication
}) => {
  const formatDate = (date: string | Date | null): string => {
    if (!date) return 'Never';
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return isValid(dateObj) ? format(dateObj, 'MMM d, yyyy') : 'Invalid date';
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Dog</TableHead>
            <TableHead>Heartworm</TableHead>
            <TableHead>Flea/Tick</TableHead>
            <TableHead>Other Medications</TableHead>
            <TableHead>Last Administered</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dogs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No dogs found. Add dogs to track their medications.
              </TableCell>
            </TableRow>
          ) : (
            dogs.map((dog) => {
              // Get preventative medications
              const dogPreventativeMeds = preventativeMeds[dog.dog_id] || [];
              const dogOtherMeds = otherMeds[dog.dog_id] || [];
              
              // Look for specific preventative medications
              const heartwormMed = Array.isArray(dogPreventativeMeds) ? 
                dogPreventativeMeds.find(med => 
                  med.name.toLowerCase().includes('heartworm')
                ) : null;
              
              const fleaTickMed = Array.isArray(dogPreventativeMeds) ? 
                dogPreventativeMeds.find(med => 
                  med.name.toLowerCase().includes('flea') || 
                  med.name.toLowerCase().includes('tick')
                ) : null;
              
              // Get status for display
              const heartwormStatus = heartwormMed 
                ? getMedicationStatus(heartwormMed)
                : { status: 'incomplete', statusColor: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300', statusLabel: 'Not Started' };
                
              const fleaTickStatus = fleaTickMed
                ? getMedicationStatus(fleaTickMed)
                : { status: 'incomplete', statusColor: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300', statusLabel: 'Not Started' };
              
              // Get most recent medication for last administered column
              const allMeds = [...(Array.isArray(dogPreventativeMeds) ? dogPreventativeMeds : []), ...(Array.isArray(dogOtherMeds) ? dogOtherMeds : [])];
              const mostRecentMed = allMeds.length > 0 
                ? allMeds.sort((a, b) => {
                    const dateA = a.lastAdministered ? new Date(a.lastAdministered).getTime() : 0;
                    const dateB = b.lastAdministered ? new Date(b.lastAdministered).getTime() : 0;
                    return dateB - dateA;
                  })[0]
                : null;
              
              return (
                <TableRow key={dog.dog_id}>
                  {/* Dog */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {dog.dog_photo ? (
                        <img 
                          src={dog.dog_photo} 
                          alt={dog.dog_name} 
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                          <Pill className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{dog.dog_name}</div>
                        <div className="text-xs text-muted-foreground">{dog.breed}</div>
                      </div>
                    </div>
                  </TableCell>
                  
                  {/* Heartworm Status */}
                  <TableCell>
                    <MedicationStatusDisplay
                      status={heartwormStatus}
                      statusColor={isComplexStatus(heartwormStatus) ? heartwormStatus.statusColor : getStatusColor(heartwormStatus)}
                    />
                  </TableCell>
                  
                  {/* Flea/Tick Status */}
                  <TableCell>
                    <MedicationStatusDisplay
                      status={fleaTickStatus}
                      statusColor={isComplexStatus(fleaTickStatus) ? fleaTickStatus.statusColor : getStatusColor(fleaTickStatus)}
                    />
                  </TableCell>
                  
                  {/* Other Medications */}
                  <TableCell>
                    <Badge className={Array.isArray(dogOtherMeds) && dogOtherMeds.length > 0 ? 
                      'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' : 
                      'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'}>
                      {Array.isArray(dogOtherMeds) && dogOtherMeds.length > 0 ? `${dogOtherMeds.length} Active` : 'None'}
                    </Badge>
                  </TableCell>
                  
                  {/* Last Administered */}
                  <TableCell>
                    {mostRecentMed ? (
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{mostRecentMed.name}: {formatDate(mostRecentMed.lastAdministered)}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">No records</span>
                    )}
                  </TableCell>
                  
                  {/* Actions */}
                  <TableCell className="text-right">
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => onLogMedication(dog.dog_id)}
                    >
                      Log Medication
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default MedicationTableView;
