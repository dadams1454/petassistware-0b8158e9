
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
import { Plus } from 'lucide-react';
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
  const [timeSlots, setTimeSlots] = useState<string[]>([
    '6:00 AM', '8:00 AM', '10:00 AM', '12:00 PM', 
    '2:00 PM', '4:00 PM', '6:00 PM', '8:00 PM', '10:00 PM'
  ]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      color: undefined,
    },
  });

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);
  
  // Placeholder functions for the TimeTableContent component
  const hasPottyBreak = (dogId: string, timeSlot: string) => false;
  const hasCareLogged = (dogId: string, timeSlot: string, category: string) => false;
  const hasObservation = (dogId: string, timeSlot: string) => false;
  const getObservationDetails = (dogId: string) => null;
  const onCellClick = (dogId: string, dogName: string, timeSlot: string, category: string) => {};
  const onCellContextMenu = (dogId: string, dogName: string, timeSlot: string, category: string) => {};
  const onCareLogClick = (dogId: string, dogName: string) => {};
  const onDogClick = (dogId: string) => {};
  
  // Get current hour for highlighting the current time slot
  const currentHour = new Date().getHours();

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
        <h2 className="text-lg font-semibold">Dog Time Table</h2>
        <CustomButton onClick={openDialog} disabled={isRefreshing}>
          <Plus className="h-4 w-4 mr-2" />
          Add Group
        </CustomButton>
      </div>

      {dogsStatus.length > 0 ? (
        <TimeTableContent
          sortedDogs={dogsStatus}
          timeSlots={timeSlots}
          activeCategory={activeCategory}
          hasPottyBreak={hasPottyBreak}
          hasCareLogged={hasCareLogged}
          hasObservation={hasObservation}
          getObservationDetails={getObservationDetails}
          onCellClick={onCellClick}
          onCellContextMenu={onCellContextMenu}
          onCareLogClick={onCareLogClick}
          onDogClick={onDogClick}
          currentHour={currentHour}
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
