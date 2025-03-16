
import React from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Clock } from 'lucide-react';

interface DogTimeTableProps {
  dogsStatus: DogCareStatus[];
}

// Define time slots for the table rows
const timeSlots = [
  '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM',
  '8:00 PM', '9:00 PM', '10:00 PM'
];

const DogTimeTable: React.FC<DogTimeTableProps> = ({ dogsStatus }) => {
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Daily Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        <div className="min-w-max">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24 bg-slate-100">Time</TableHead>
                {dogsStatus.map((dog) => (
                  <TableHead key={dog.dog_id} className="text-center">
                    <div className="flex flex-col items-center">
                      {dog.dog_photo ? (
                        <img 
                          src={dog.dog_photo} 
                          alt={dog.dog_name} 
                          className="w-8 h-8 rounded-full object-cover mb-1" 
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-1">
                          <span className="text-xs">{dog.dog_name.charAt(0)}</span>
                        </div>
                      )}
                      <span>{dog.dog_name}</span>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {timeSlots.map((timeSlot) => (
                <TableRow key={timeSlot}>
                  <TableCell className="font-medium bg-slate-50">{timeSlot}</TableCell>
                  {dogsStatus.map((dog) => (
                    <TableCell 
                      key={`${timeSlot}-${dog.dog_id}`} 
                      className="text-center hover:bg-slate-100 cursor-pointer"
                    >
                      {/* This cell could be filled with care data if it exists */}
                      &nbsp;
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DogTimeTable;
