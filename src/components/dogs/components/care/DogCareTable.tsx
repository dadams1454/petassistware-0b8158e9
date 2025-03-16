
import React from 'react';
import { format, parseISO } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DogCareStatus } from '@/types/dailyCare';

// Import refactored components
import DogCareTableHeader from './table/TableHeader';
import DogTableRow from './table/DogTableRow';
import EmptyTableRow from './table/EmptyTableRow';
import TableDebugger from './table/TableDebugger';

interface DogCareTableProps {
  dogsStatus: DogCareStatus[];
  onLogCare: (dogId: string) => void;
  selectedDogId: string | null;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  onCareLogSuccess: () => void;
  selectedCategory: string;
}

const DogCareTable: React.FC<DogCareTableProps> = ({
  dogsStatus,
  onLogCare,
  selectedDogId,
  dialogOpen,
  setDialogOpen,
  onCareLogSuccess,
  selectedCategory
}) => {
  return (
    <Card>
      <CardContent className="p-0">
        {/* Debug information */}
        <TableDebugger dogsStatus={dogsStatus} selectedCategory={selectedCategory} />
        
        <ScrollArea className="h-[60vh]">
          <Table>
            <DogCareTableHeader />
            <TableBody>
              {dogsStatus && dogsStatus.length > 0 ? (
                dogsStatus.map((dog) => (
                  <DogTableRow 
                    key={dog.dog_id}
                    dog={dog}
                    selectedDogId={selectedDogId}
                    dialogOpen={dialogOpen}
                    setDialogOpen={setDialogOpen}
                    onLogCare={onLogCare}
                    onCareLogSuccess={onCareLogSuccess}
                    selectedCategory={selectedCategory}
                  />
                ))
              ) : (
                <EmptyTableRow />
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default DogCareTable;
