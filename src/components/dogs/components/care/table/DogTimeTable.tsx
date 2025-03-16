
import React from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Clock, Dog } from 'lucide-react';
import DogAvatar from './DogAvatar';
import EmptyTableRow from './EmptyTableRow';
import TableDebugger from './TableDebugger';

interface DogTimeTableProps {
  dogsStatus: DogCareStatus[];
  onRefresh?: () => void;
}

// Define time slots for the table rows
const timeSlots = [
  '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM',
  '8:00 PM', '9:00 PM', '10:00 PM'
];

const DogTimeTable: React.FC<DogTimeTableProps> = ({ dogsStatus, onRefresh }) => {
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
        <CardTitle className="text-xl flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Daily Care Schedule
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            ({sortedDogs.length} dogs)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        {sortedDogs.length > 0 ? (
          <div className="min-w-max">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24 bg-slate-100 sticky left-0 z-10">Time</TableHead>
                  {sortedDogs.map((dog) => (
                    <TableHead key={dog.dog_id} className="text-center min-w-32">
                      <div className="flex flex-col items-center gap-1">
                        {dog.dog_photo ? (
                          <img 
                            src={dog.dog_photo} 
                            alt={dog.dog_name} 
                            className="w-8 h-8 rounded-full object-cover" 
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Dog className="h-4 w-4 text-primary" />
                          </div>
                        )}
                        <span className="font-medium text-sm">{dog.dog_name}</span>
                        <span className="text-xs text-muted-foreground">{dog.breed}</span>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {timeSlots.map((timeSlot) => (
                  <TableRow key={timeSlot}>
                    <TableCell className="font-medium bg-slate-50 sticky left-0 z-10">{timeSlot}</TableCell>
                    {sortedDogs.map((dog) => (
                      <TableCell 
                        key={`${timeSlot}-${dog.dog_id}`} 
                        className="text-center hover:bg-slate-100 cursor-pointer"
                      >
                        {/* This cell could be filled with care data if it exists */}
                        {/* For now, just show a placeholder */}
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
