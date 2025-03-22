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
import { Dog } from '@/types';
import { fetchActiveDogs } from '@/lib/api/dogs';
import { DogTimeTableRow } from './DogTimeTableRow';
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
} from "@/components/ui/dialog"
import DogTimeTableForm from './DogTimeTableForm';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useDogGroups } from '@/components/dogs/hooks/useDogGroups';
import DogGroupFilter from './DogGroupFilter';

interface DogTimeTableProps {
  date: Date;
  onObservationCreated: () => void;
}

const MAX_DOGS_PER_GROUP = 8;

const DogTimeTable: React.FC<DogTimeTableProps> = ({ date, onObservationCreated }) => {
  const { toast } = useToast();
  const [activeDogs, setActiveDogs] = useState<Dog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null);
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);

  const { groups, isLoading: isGroupsLoading, createGroup, updateGroup, deleteGroup } = useDogGroups();

  const formSchema = z.object({
    name: z.string().min(2, {
      message: "Group name must be at least 2 characters.",
    }),
    color: z.string().optional(),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      color: undefined,
    },
  })

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  const handleDogSelect = (dog: Dog) => {
    setSelectedDog(dog);
    openDialog();
  };

  const handleGroupChange = (groupId: string | null) => {
    setActiveGroupId(groupId);
  };

  const filteredDogs = activeGroupId
    ? activeDogs.filter(dog => dog.group_id === activeGroupId)
    : activeDogs;

  const fetchActiveDogsData = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedDogs = await fetchActiveDogs();
      setActiveDogs(fetchedDogs || []);
    } catch (error) {
      console.error('Error fetching active dogs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch active dogs.",
        variant: "destructive",
      });
      setActiveDogs([]);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchActiveDogsData();
  }, [fetchActiveDogsData]);

  const refreshActiveDogs = async () => {
    setIsLoading(true);
    try {
      const fetchedDogs = await fetchActiveDogs();
      setActiveDogs(fetchedDogs || []);
    } catch (error) {
      console.error('Error refreshing active dogs:', error);
      toast({
        title: "Error",
        description: "Failed to refresh active dogs.",
        variant: "destructive",
      });
      setActiveDogs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAndProcessActiveDogs = async () => {
    try {
      const result = await fetchActiveDogs();
      const processedDogs = result || [];
      setActiveDogs(processedDogs); // Fix the type issue by resolving the Promise
    } catch (error) {
      console.error('Error fetching active dogs:', error);
      setActiveDogs([]); // Provide a fallback empty array
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Here, you would handle the submission of the form.
      // For example, you could call an API to save the data to a database.
      console.log(values)
      toast({
        title: "Success!",
        description: "You have successfully created a group.",
      })
    } catch (error) {
      toast({
        title: "Error.",
        description: "There was an error creating the group.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Dog Time Table</h2>
        <CustomButton onClick={openDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Group
        </CustomButton>
      </div>

      <DogGroupFilter
        groups={groups}
        activeGroupId={activeGroupId}
        onGroupChange={handleGroupChange}
      />

      <Table>
        <TableCaption>A list of dogs that are currently active.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Breed</TableHead>
            <TableHead>Group</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <>
              {Array(5).fill(null).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                </TableRow>
              ))}
            </>
          ) : filteredDogs.length > 0 ? (
            filteredDogs.map((dog) => (
              <DogTimeTableRow
                key={dog.id}
                dog={dog}
                date={date}
                onDogSelect={handleDogSelect}
                onObservationCreated={onObservationCreated}
                refreshActiveDogs={refreshActiveDogs}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">No active dogs found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Group</DialogTitle>
            <DialogDescription>
              Make changes to your group here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <DogTimeTableForm form={form} onSubmit={onSubmit} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DogTimeTable;
