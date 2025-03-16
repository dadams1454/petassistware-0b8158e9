
import React, { useState } from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Clock, Dog } from 'lucide-react';
import EmptyTableRow from './EmptyTableRow';
import TableDebugger from './TableDebugger';
import { format } from 'date-fns';

interface DogTimeTableProps {
  dogsStatus: DogCareStatus[];
  onRefresh?: () => void;
}

// Define time slots for the table columns
const timeSlots = [
  '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM',
  '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM',
  '8 PM', '9 PM', '10 PM', '11 PM', '12 AM'
];

// Dog group colors for the rotation schedule
const dogGroupColors = {
  groupA: 'bg-blue-100 hover:bg-blue-200',
  groupB: 'bg-cyan-100 hover:bg-cyan-200',
  groupC: 'bg-amber-100 hover:bg-amber-200',
  groupD: 'bg-red-100 hover:bg-red-200',
  groupE: 'bg-green-100 hover:bg-green-200',
  groupF: 'bg-purple-100 hover:bg-purple-200',
};

// Function to get color for a dog based on its position in the list
const getDogRowColor = (index: number) => {
  if (index < 3) return dogGroupColors.groupA;
  if (index < 6) return dogGroupColors.groupB;
  if (index < 9) return dogGroupColors.groupC;
  if (index < 12) return dogGroupColors.groupD;
  if (index < 15) return dogGroupColors.groupE;
  return dogGroupColors.groupF;
};

const DogTimeTable: React.FC<DogTimeTableProps> = ({ dogsStatus, onRefresh }) => {
  const [currentDate] = useState(new Date());
  
  // Filter out duplicate dog names to avoid confusion in the table
  const uniqueDogs = dogsStatus.reduce((acc: DogCareStatus[], current) => {
    const isDuplicate = acc.find((dog) => dog.dog_name.toLowerCase() === current.dog_name.toLowerCase());
    if (!isDuplicate) {
      acc.push(current);
    }
    return acc;
  }, []);
  
  // Sort dogs alphabetically by name
  const sortedDogs = [...uniqueDogs].sort((a, b) => 
    a.dog_name.toLowerCase().localeCompare(b.dog_name.toLowerCase())
  );

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center">
            <Dog className="h-5 w-5 mr-2" />
            Dog Rotation
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({sortedDogs.length} dogs)
            </span>
          </CardTitle>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">
              Date: {format(currentDate, 'MM/dd/yyyy')}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        {sortedDogs.length > 0 ? (
          <div className="min-w-max">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-100">
                  <TableHead className="w-32 sticky left-0 z-10 bg-slate-100">Dog Name</TableHead>
                  {timeSlots.map((timeSlot) => (
                    <TableHead key={timeSlot} className="text-center px-2 py-1 w-12 border-x border-slate-200">
                      {timeSlot}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedDogs.map((dog, index) => (
                  <TableRow key={dog.dog_id} className={getDogRowColor(index)}>
                    <TableCell className="font-medium sticky left-0 z-10 border-r border-slate-200 bg-white dark:bg-slate-900">
                      <div className="flex items-center space-x-2">
                        {dog.dog_photo ? (
                          <img 
                            src={dog.dog_photo} 
                            alt={dog.dog_name} 
                            className="w-6 h-6 rounded-full object-cover" 
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                            <Dog className="h-3 w-3 text-primary" />
                          </div>
                        )}
                        <span>{dog.dog_name}</span>
                      </div>
                    </TableCell>
                    {timeSlots.map((timeSlot) => (
                      <TableCell 
                        key={`${dog.dog_id}-${timeSlot}`} 
                        className="text-center p-0 h-10 border border-slate-200 cursor-pointer"
                      >
                        {/* This cell could be filled with care data if it exists */}
                        {/* For now, just show an empty cell */}
                        &nbsp;
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <EmptyTableRow onRefresh={onRefresh} />
        )}
      </CardContent>
      
      {/* Hidden debugging component */}
      <TableDebugger dogsStatus={dogsStatus} selectedCategory="" />
    </Card>
  );
};

export default DogTimeTable;
