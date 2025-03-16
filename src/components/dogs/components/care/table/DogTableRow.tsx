
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { DogCareStatus } from '@/types/dailyCare';
import DogAvatar from './DogAvatar';
import { DogFlagsList } from '../DogFlagsList';
import { format, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface DogTableRowProps {
  dog: DogCareStatus;
  selectedDogId: string | null;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  onLogCare: (dogId: string) => void;
  onCareLogSuccess: () => void;
  selectedCategory: string;
}

const DogTableRow: React.FC<DogTableRowProps> = ({
  dog,
  selectedDogId,
  dialogOpen,
  setDialogOpen,
  onLogCare,
  onCareLogSuccess,
  selectedCategory
}) => {
  return (
    <TableRow>
      <TableCell>
        <DogAvatar photoUrl={dog.dog_photo} name={dog.dog_name} />
      </TableCell>
      <TableCell>{dog.breed}</TableCell>
      <TableCell>
        {dog.last_care ? (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            {dog.last_care.category}: {dog.last_care.task_name}
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
            Needs care
          </Badge>
        )}
      </TableCell>
      <TableCell>
        {dog.last_care ? format(parseISO(dog.last_care.timestamp), 'h:mm a') : '-'}
      </TableCell>
      <TableCell>
        <div className="flex">
          <DogFlagsList flags={dog.flags || []} />
        </div>
      </TableCell>
      <TableCell className="text-right">
        <LogCareButton 
          dogId={dog.dog_id}
          hasLastCare={!!dog.last_care}
          isSelected={selectedDogId === dog.dog_id}
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          onLogCare={onLogCare}
          onCareLogSuccess={onCareLogSuccess}
          selectedCategory={selectedCategory}
        />
      </TableCell>
    </TableRow>
  );
};

export default DogTableRow;
