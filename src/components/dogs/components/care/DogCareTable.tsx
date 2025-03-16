
import React, { useState, useEffect } from 'react';
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
import CategoryTabs from './form/task-selection/CategoryTabs';
import { useDailyCare } from '@/contexts/dailyCare';

interface DogCareTableProps {
  dogsStatus: DogCareStatus[];
  onLogCare: (dogId: string) => void;
  selectedDogId: string | null;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  onCareLogSuccess: () => void;
}

const DogCareTable: React.FC<DogCareTableProps> = ({
  dogsStatus,
  onLogCare,
  selectedDogId,
  dialogOpen,
  setDialogOpen,
  onCareLogSuccess
}) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Record<string, string>>({});
  const { fetchCareTaskPresets } = useDailyCare();

  // Fetch categories when the component mounts
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const presets = await fetchCareTaskPresets();
        const uniqueCategories = Array.from(new Set(presets.map(preset => preset.category)));
        setCategories(uniqueCategories);
        
        // Initialize selected categories for each dog
        const initialSelectedCategories: Record<string, string> = {};
        dogsStatus.forEach(dog => {
          initialSelectedCategories[dog.dog_id] = uniqueCategories[0] || '';
        });
        setSelectedCategories(initialSelectedCategories);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };
    
    loadCategories();
  }, [fetchCareTaskPresets, dogsStatus]);

  const handleCategoryChange = (dogId: string, category: string) => {
    setSelectedCategories(prev => ({
      ...prev,
      [dogId]: category
    }));
  };

  const handleCareClick = (dogId: string) => {
    onLogCare(dogId);
  };

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
                <TableHead>Categories</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dogsStatus.map((dog) => (
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
                  <TableCell className="max-w-xs">
                    {categories.length > 0 && (
                      <CategoryTabs 
                        categories={categories} 
                        selectedCategory={selectedCategories[dog.dog_id] || categories[0]} 
                        handleCategoryChange={(category) => handleCategoryChange(dog.dog_id, category)}
                        compact={true}
                      />
                    )}
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
                            initialCategory={selectedCategories[dog.dog_id]}
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default DogCareTable;
