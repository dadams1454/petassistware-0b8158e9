
import React from 'react';
import { DogCareStatus } from '@/types/dailyCare';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { getRowColor } from '../utils/tableUtils';

interface TimeTableContentProps {
  sortedDogs: DogCareStatus[];
  timeSlots: string[];
  hasPottyBreak: (dogId: string, timeSlot: string) => boolean;
  onCellClick: (dogId: string, dogName: string, timeSlot: string) => void;
}

const TimeTableContent: React.FC<TimeTableContentProps> = ({ 
  sortedDogs, 
  timeSlots, 
  hasPottyBreak, 
  onCellClick 
}) => {
  return (
    <div className="relative overflow-auto">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden border border-gray-200 dark:border-gray-700 shadow sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-slate-800/60">
              <tr>
                <th className="sticky left-0 z-10 bg-gray-100 dark:bg-slate-800/60 px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider min-w-[150px]">
                  Dog
                </th>
                {timeSlots.map((slot) => (
                  <th key={slot} className="px-3 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {slot}
                  </th>
                ))}
              </tr>
            </thead>
            
            <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-gray-700">
              {sortedDogs.length > 0 ? (
                sortedDogs.map((dog, index) => (
                  <tr key={dog.dog_id} className={getRowColor(index)}>
                    <td className="sticky left-0 z-10 px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700 min-w-[150px]"
                        style={{ backgroundColor: index % 2 === 0 ? 'var(--bg-white, white)' : 'var(--bg-gray-50, #f9fafb)' }}>
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 mr-2">
                          {dog.dog_photo ? (
                            <AspectRatio ratio={1/1} className="rounded-full overflow-hidden">
                              <img src={dog.dog_photo} alt={dog.dog_name} className="h-full w-full object-cover" />
                            </AspectRatio>
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                              <span className="text-blue-500 dark:text-blue-300 font-semibold">
                                {dog.dog_name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {dog.dog_name}
                          </div>
                          {dog.breed && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {dog.breed}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    {timeSlots.map((slot) => {
                      const hasBreak = hasPottyBreak(dog.dog_id, slot);
                      return (
                        <td 
                          key={`${dog.dog_id}-${slot}`}
                          onClick={() => onCellClick(dog.dog_id, dog.dog_name, slot)}
                          className={`text-center px-3 py-2 whitespace-nowrap text-sm ${hasBreak ? 'bg-green-100 dark:bg-green-900/30' : 'hover:bg-blue-50 dark:hover:bg-blue-900/20'} cursor-pointer transition-colors`}
                        >
                          {hasBreak ? (
                            <span className="inline-flex items-center justify-center h-6 w-6 text-green-600 dark:text-green-400 font-bold text-lg">
                              X
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center h-6 w-6"></span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={timeSlots.length + 1} className="px-6 py-8 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center">
                    No dogs available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TimeTableContent;
