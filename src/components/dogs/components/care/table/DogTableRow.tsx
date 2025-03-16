
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { DogCareStatus } from '@/types/dailyCare';
import DogAvatar from './DogAvatar';
import { DogFlagsList } from '../DogFlagsList';
import { format, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import LogCareButton from './LogCareButton';
import LastCareStatus from './LastCareStatus';

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
        <LastCareStatus lastCare={dog.last_care} />
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
