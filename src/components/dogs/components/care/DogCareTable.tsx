
import React from 'react';
import { format, parseISO } from 'date-fns';
import { Dog } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import CareLogForm from './CareLogForm';
import { DogFlagsList } from './DogFlagsList';
import { DogCareStatus } from '@/types/dailyCare';

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
  const handleCareClick = (dogId: string) => {
    onLogCare(dogId);
  };

  // Display all dogs, regardless of category filter
  // The category will only be used when logging care for a specific dog
  console.log(`DogCareTable rendering ${dogsStatus.length} dogs with category "${selectedCategory}"`);
  console.log('Dog names in table:', dogsStatus.map(dog => dog.dog_name).join(', '));

  return (
    <Card>
      <CardContent className="p-0">
        <ScrollArea className="h-[60vh]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dog</TableHead>
                <TableHead>Breed</TableHead>
                <TableHead>Last Care</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Flags</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dogsStatus.length > 0 ? (
                dogsStatus.map((dog) => (
                  <TableRow key={dog.dog_id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {dog.dog_photo ? (
                          <img
                            src={dog.dog_photo}
                            alt={dog.dog_name}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Dog className="h-4 w-4 text-primary" />
                          </div>
                        )}
                        <span>{dog.dog_name}</span>
                      </div>
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
                        <DogFlagsList flags={dog.flags} />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog open={dialogOpen && selectedDogId === dog.dog_id} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            variant={dog.last_care ? "ghost" : "secondary"} 
                            size="sm"
                            onClick={() => handleCareClick(dog.dog_id)}
                          >
                            {dog.last_care ? "Update" : "Log Care"}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          {selectedDogId === dog.dog_id && (
                            <CareLogForm 
                              dogId={dog.dog_id} 
                              onSuccess={onCareLogSuccess}
                              initialCategory={selectedCategory}
                            />
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <p className="text-gray-500">No dogs found</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default DogCareTable;
