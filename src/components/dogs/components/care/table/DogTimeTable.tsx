
import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DogCareStatus } from '@/types/dailyCare';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { CustomButton } from '@/components/ui/custom-button';
import { Plus, Coffee, UtensilsCrossed, Activity, Calendar } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import TimeTableContent from './components/TimeTableContent';
import usePottyBreakTable from './hooks/usePottyBreakTable';
import ActiveTabContent from './components/ActiveTabContent';
import CareCategories from './CareCategories';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useTimeManager from './components/TimeManager';
import { format } from 'date-fns';

interface DogTimeTableProps {
  dogsStatus: DogCareStatus[];
  onRefresh: () => void;
  isRefreshing: boolean;
  currentDate: Date;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Group name must be at least 2 characters.",
  }),
  color: z.string().optional(),
});

const DogTimeTable: React.FC<DogTimeTableProps> = ({ 
  dogsStatus, 
  onRefresh,
  isRefreshing,
  currentDate 
}) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('pottybreaks');
  
  // Use the time manager hook to get time slots and current hour
  const { timeSlots, currentHour } = useTimeManager(activeCategory);
  
  // Use the potty break table hook to get all the necessary data and handlers
  const {
    sortedDogs,
    hasPottyBreak,
    hasCareLogged,
    hasObservation,
    getObservationDetails,
    handleCellClick,
    handleRefresh,
    handleDogClick,
    isLoading
  } = usePottyBreakTable(dogsStatus, onRefresh, activeCategory, currentDate);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      color: undefined,
    },
  });

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);
  
  // Handle cell right-click for observations/notes
  const handleCellContextMenu = (dogId: string, dogName: string, timeSlot: string, category: string) => {
    // Display a context menu or add observation
    console.log('Right-clicked on cell:', dogId, dogName, timeSlot, category);
    toast({
      title: "Add Observation",
      description: `Add observation for ${dogName} at ${timeSlot}`,
    });
  };
  
  // Handle care log click
  const handleCareLogClick = (dogId: string, dogName: string) => {
    // Navigate to care log page or open care log dialog
    console.log('Care log clicked for:', dogId, dogName);
    toast({
      title: "View Care Logs",
      description: `Viewing care logs for ${dogName}`,
    });
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log(values);
      toast({
        title: "Success!",
        description: "You have successfully created a group.",
      });
      closeDialog();
    } catch (error) {
      toast({
        title: "Error.",
        description: "There was an error creating the group.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Dog Time Table</h2>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4" /> {format(currentDate, 'MMMM d, yyyy')}
          </p>
        </div>
        <CustomButton onClick={openDialog} disabled={isRefreshing}>
          <Plus className="h-4 w-4 mr-2" />
          Add Group
        </CustomButton>
      </div>

      {/* Category Tabs */}
      <Tabs 
        defaultValue="pottybreaks" 
        value={activeCategory} 
        onValueChange={setActiveCategory}
        className="w-full"
      >
        <TabsList>
          {CareCategories.map(category => (
            <TabsTrigger key={category.id} value={category.id} className="flex items-center">
              {category.icon}
              <span className="ml-2">{category.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {dogsStatus.length > 0 ? (
        <ActiveTabContent
          activeCategory={activeCategory}
          sortedDogs={sortedDogs}
          timeSlots={timeSlots}
          hasPottyBreak={hasPottyBreak}
          hasCareLogged={hasCareLogged}
          hasObservation={hasObservation}
          getObservationDetails={getObservationDetails}
          onCellClick={handleCellClick}
          onCellContextMenu={handleCellContextMenu}
          onCareLogClick={handleCareLogClick}
          onDogClick={handleDogClick}
          onRefresh={handleRefresh}
          currentHour={currentHour}
          isMobile={false}
        />
      ) : (
        <div className="p-8 text-center border rounded-md bg-slate-50 dark:bg-slate-800/50">
          <p className="text-muted-foreground">No dogs found. Please refresh or add dogs to the system.</p>
          <CustomButton 
            onClick={onRefresh} 
            className="mt-4"
            disabled={isRefreshing}
          >
            {isRefreshing ? "Refreshing..." : "Refresh Dogs"}
          </CustomButton>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Group</DialogTitle>
            <DialogDescription>
              Make changes to your group here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Group Name</label>
              <input
                {...form.register("name")}
                id="name"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="color" className="text-sm font-medium">Color (optional)</label>
              <select
                {...form.register("color")}
                id="color"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select a color</option>
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="red">Red</option>
                <option value="purple">Purple</option>
                <option value="yellow">Yellow</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <CustomButton type="button" variant="outline" onClick={closeDialog}>
                Cancel
              </CustomButton>
              <CustomButton type="submit">
                Save Group
              </CustomButton>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DogTimeTable;
