import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';

// Define the types for dog rotation data
interface DogData {
  name: string;
  status?: 'pregnant' | 'normal'; // Optional status flag
  group?: 'blue' | 'teal' | 'yellow' | 'red' | 'green' | 'purple'; // Color group
  schedule?: Record<string, boolean>; // Time slots marked as true when scheduled
}

const timeSlots = [
  '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', 
  '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', 
  '8 PM', '9 PM', '10 PM', '11 PM', '12 AM'
];

// Sample data - in a real app, this would come from the database
const initialDogs: DogData[] = [
  { name: 'Sissa', group: 'blue' },
  { name: 'Luna', group: 'blue' },
  { name: 'Sadie', group: 'blue' },
  { name: 'Izzy preg', status: 'pregnant', group: 'teal' },
  { name: 'Charlie', group: 'teal' },
  { name: 'Stella preg', status: 'pregnant', group: 'teal' },
  { name: 'Gracie', group: 'teal' },
  { name: 'Jane', group: 'teal' },
  { name: 'Bree', group: 'teal' },
  { name: 'Anna', group: 'yellow' },
  { name: 'Xox', group: 'yellow' },
  { name: 'Venus', group: 'yellow' },
  { name: 'Queen', group: 'red' },
  { name: 'Trolli', group: 'red' },
  { name: 'Winni', group: 'red' },
  { name: 'Roxy', group: 'blue' },
  { name: 'Striker', group: 'blue' },
  { name: 'Max', group: 'green' },
  { name: 'Phoebe', group: 'green' },
  { name: 'George', group: 'purple' },
];

const DogRotationSchedule: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dogs, setDogs] = useState<DogData[]>(initialDogs);
  
  // Function to handle cell clicks for scheduling
  const handleCellClick = (dogIndex: number, timeSlot: string) => {
    const updatedDogs = [...dogs];
    if (!updatedDogs[dogIndex].schedule) {
      updatedDogs[dogIndex].schedule = {};
    }
    
    // Toggle the schedule state for this cell
    updatedDogs[dogIndex].schedule![timeSlot] = !updatedDogs[dogIndex].schedule![timeSlot];
    setDogs(updatedDogs);
  };
  
  // Function to get the background color based on dog group
  const getBackgroundColor = (dog: DogData) => {
    switch (dog.group) {
      case 'blue':
        return 'bg-blue-100';
      case 'teal':
        return 'bg-cyan-100';
      case 'yellow':
        return 'bg-amber-100';
      case 'red':
        return 'bg-red-100';
      case 'green':
        return 'bg-green-100';
      case 'purple':
        return 'bg-purple-100';
      default:
        return 'bg-gray-100';
    }
  };
  
  // Function to get cell background color
  const getCellBackground = (dog: DogData, timeSlot: string) => {
    // If this cell is scheduled, highlight it
    if (dog.schedule && dog.schedule[timeSlot]) {
      return 'bg-green-300';
    }
    // Otherwise use the dog's group color
    return getBackgroundColor(dog);
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2 flex flex-row justify-between items-center">
        <CardTitle className="text-xl flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Dog Rotation
        </CardTitle>
        <div className="text-lg font-medium">
          Date: {format(currentDate, 'MM/dd/yyyy')}
        </div>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        <div className="min-w-[1200px]">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-300">
                <th className="p-2 border border-gray-400 w-[140px]"></th>
                {timeSlots.map((slot) => (
                  <th key={slot} className="p-2 border border-gray-400 text-center w-[60px]">
                    {slot}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dogs.map((dog, dogIndex) => (
                <tr key={dog.name}>
                  <td className={`p-2 border border-gray-400 font-medium ${getBackgroundColor(dog)}`}>
                    {dog.name}
                  </td>
                  {timeSlots.map((slot) => (
                    <td 
                      key={`${dog.name}-${slot}`}
                      className={`border border-gray-300 cursor-pointer hover:opacity-80 ${getCellBackground(dog, slot)}`}
                      onClick={() => handleCellClick(dogIndex, slot)}
                    >
                      &nbsp;
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DogRotationSchedule;
