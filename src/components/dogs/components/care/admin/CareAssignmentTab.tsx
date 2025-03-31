
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { UserRound, Search, Save, RefreshCw } from 'lucide-react';
import { DogCareStatus } from '@/types/dailyCare';
import { useToast } from '@/components/ui/use-toast';

interface StaffMember {
  id: string;
  name: string;
  role: string;
}

// Mock staff data - in a real app, this would come from your database
const mockStaffMembers: StaffMember[] = [
  { id: '1', name: 'John Smith', role: 'Caretaker' },
  { id: '2', name: 'Emma Johnson', role: 'Veterinarian' },
  { id: '3', name: 'Michael Brown', role: 'Trainer' },
  { id: '4', name: 'Sarah Davis', role: 'Groomer' },
  { id: '5', name: 'David Wilson', role: 'Assistant' },
];

interface CareAssignmentTabProps {
  dogStatuses: DogCareStatus[];
  isLoading: boolean;
  onRefresh: () => void;
}

const CareAssignmentTab: React.FC<CareAssignmentTabProps> = ({ 
  dogStatuses,
  isLoading,
  onRefresh
}) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [assignments, setAssignments] = useState<Record<string, string[]>>({
    feeding: [],
    medications: [],
    exercise: [],
    grooming: []
  });
  const [selectedStaff, setSelectedStaff] = useState<string>('');

  // Filter dogs based on search query
  const filteredDogs = dogStatuses.filter(dog => 
    dog.dog_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle assignment for a specific dog and care category
  const toggleAssignment = (dogId: string, category: string) => {
    setAssignments(prev => {
      const currentAssignments = {...prev};
      if (!currentAssignments[category]) {
        currentAssignments[category] = [];
      }
      
      if (currentAssignments[category].includes(dogId)) {
        currentAssignments[category] = currentAssignments[category].filter(id => id !== dogId);
      } else {
        currentAssignments[category].push(dogId);
      }
      
      return currentAssignments;
    });
  };

  // Save assignments
  const handleSaveAssignments = () => {
    if (!selectedStaff) {
      toast({
        title: "Error",
        description: "Please select a staff member first",
        variant: "destructive"
      });
      return;
    }

    // Here you would save to your database
    console.log('Saving assignments:', { staffId: selectedStaff, assignments });
    
    toast({
      title: "Assignments Saved",
      description: `Care tasks assigned to ${mockStaffMembers.find(s => s.id === selectedStaff)?.name}`,
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center">
            <UserRound className="mr-2 h-5 w-5" />
            Staff Care Assignments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 space-y-4">
            <div className="flex justify-between items-end">
              <div className="space-y-2 w-full max-w-xs">
                <label className="text-sm font-medium">Assign Tasks To:</label>
                <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockStaffMembers.map(staff => (
                      <SelectItem key={staff.id} value={staff.id}>
                        {staff.name} ({staff.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={onRefresh} disabled={isLoading} className="gap-2">
                  <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
                <Button onClick={handleSaveAssignments} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Assignments
                </Button>
              </div>
            </div>
            
            <div className="relative w-full md:w-[320px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                placeholder="Search dogs..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dog</TableHead>
                <TableHead>Feeding</TableHead>
                <TableHead>Medications</TableHead>
                <TableHead>Exercise</TableHead>
                <TableHead>Grooming</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDogs.length > 0 ? (
                filteredDogs.map(dog => (
                  <TableRow key={dog.dog_id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                          {dog.dog_name.charAt(0)}
                        </div>
                        <div>
                          {dog.dog_name}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Checkbox 
                        checked={assignments.feeding?.includes(dog.dog_id)}
                        onCheckedChange={() => toggleAssignment(dog.dog_id, 'feeding')}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox 
                        checked={assignments.medications?.includes(dog.dog_id)}
                        onCheckedChange={() => toggleAssignment(dog.dog_id, 'medications')}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox 
                        checked={assignments.exercise?.includes(dog.dog_id)}
                        onCheckedChange={() => toggleAssignment(dog.dog_id, 'exercise')}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox 
                        checked={assignments.grooming?.includes(dog.dog_id)}
                        onCheckedChange={() => toggleAssignment(dog.dog_id, 'grooming')}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No dogs found matching your search
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CareAssignmentTab;
