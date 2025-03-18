
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TimeTableHeader from './TimeTableHeader';
import TimeTableFooter from './TimeTableFooter';
import TimeTableTabContent from './TimeTableTabContent';

interface DogTimeTabsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  isLoading: boolean;
  onRefresh: () => void;
  isMobile: boolean;
  sortedDogs: any[];
  timeSlots: string[];
  hasPottyBreak: (dogId: string, timeSlot: string) => boolean;
  hasCareLogged: (dogId: string, timeSlot: string, category: string) => boolean;
  onCellClick: (dogId: string, dogName: string, timeSlot: string, category: string) => void;
  currentHour: number;
  hasObservation: (dogId: string) => boolean;
  onAddObservation: (dogId: string, observation: string, observationType: 'accident' | 'heat' | 'behavior' | 'other') => Promise<void>;
  observations: Record<string, Array<{
    observation: string;
    observation_type: 'accident' | 'heat' | 'behavior' | 'other';
    created_at: string;
  }>>;
}

const DogTimeTabs: React.FC<DogTimeTabsProps> = ({ 
  activeCategory,
  onCategoryChange,
  isLoading,
  onRefresh,
  isMobile,
  sortedDogs,
  timeSlots,
  hasPottyBreak,
  hasCareLogged,
  onCellClick,
  currentHour,
  hasObservation,
  onAddObservation,
  observations
}) => {
  const categories = ['pottybreaks', 'feeding', 'medications', 'exercise'];
  
  return (
    <Tabs
      value={activeCategory}
      onValueChange={onCategoryChange}
      className="w-full"
    >
      <div className="p-3 bg-white dark:bg-slate-950/60 border-b border-gray-200 dark:border-gray-800">
        <TimeTableHeader 
          activeCategory={activeCategory} 
          onCategoryChange={onCategoryChange}
          isLoading={isLoading}
          onRefresh={onRefresh} 
          isMobile={isMobile}
        />
      </div>
      
      {categories.map((category) => (
        <TimeTableTabContent
          key={category}
          activeCategory={activeCategory}
          tabValue={category}
          sortedDogs={sortedDogs}
          timeSlots={timeSlots}
          hasPottyBreak={hasPottyBreak}
          hasCareLogged={hasCareLogged}
          onCellClick={onCellClick}
          onRefresh={onRefresh}
          currentHour={currentHour}
          hasObservation={hasObservation}
          onAddObservation={onAddObservation}
          observations={observations}
          isMobile={isMobile}
        />
      ))}
      
      <div className="p-2 bg-gray-50 dark:bg-slate-900/60 border-t border-gray-200 dark:border-gray-800">
        <TimeTableFooter
          isLoading={isLoading}
          onRefresh={onRefresh}
          lastUpdateTime={new Date().toLocaleTimeString()}
        />
      </div>
    </Tabs>
  );
};

export default DogTimeTabs;
