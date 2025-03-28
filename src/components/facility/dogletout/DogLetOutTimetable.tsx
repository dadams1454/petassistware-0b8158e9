
import React, { useState, useMemo, useCallback } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { DogCareStatus } from '@/types/dailyCare';
import { useDogGroups } from './hooks/useDogGroups';
import { usePottyBreakTimetable } from './hooks/usePottyBreakTimetable';
import { CheckCircle, XCircle, Dog, AlertCircle, RefreshCw } from 'lucide-react';

interface DogLetOutTimetableProps {
  dogsData: DogCareStatus[];
  date: Date;
  onRefresh?: () => void;
}

const DogLetOutTimetable: React.FC<DogLetOutTimetableProps> = ({ 
  dogsData, 
  date,
  onRefresh 
}) => {
  const { toast } = useToast();
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  
  // Get dog groups
  const { 
    groups, 
    isLoading: groupsLoading,
    addGroup
  } = useDogGroups();
  
  // Get time slots for the timetable
  const timeSlots = useMemo(() => {
    const slots: string[] = [];
    for (let hour = 6; hour < 21; hour++) {
      const formattedHour = hour > 12 ? hour - 12 : hour;
      const amPm = hour >= 12 ? 'PM' : 'AM';
      slots.push(`${formattedHour}:00 ${amPm}`);
    }
    return slots;
  }, []);
  
  // Get current hour for highlighting
  const currentHour = useMemo(() => {
    const now = new Date();
    return now.getHours();
  }, []);
  
  // Get potty break data using our hook
  const {
    pottyBreaks,
    hasPottyBreak,
    getPottyBreakStatus,
    handleCellClick,
    handleGroupPottyBreak,
    isLoading: pottyBreaksLoading,
    refreshPottyBreaks,
    isDogOutside,
    getOutsideTime,
    incompatibilityWarning,
    clearIncompatibilityWarning
  } = usePottyBreakTimetable(dogsData, date);
  
  // Dialog states for warnings and group management
  const [showAddGroupDialog, setShowAddGroupDialog] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupColor, setNewGroupColor] = useState('#1890ff');
  
  // Filter dogs based on selected group
  const filteredDogs = useMemo(() => {
    if (selectedGroup === 'all') return dogsData;
    
    if (selectedGroup === 'outside') {
      return dogsData.filter(dog => isDogOutside(dog.dog_id));
    }
    
    const group = groups.find(g => g.id === selectedGroup);
    if (!group) return dogsData;
    
    return dogsData.filter(dog => 
      group.dogIds.includes(dog.dog_id)
    );
  }, [dogsData, selectedGroup, groups, isDogOutside]);
  
  // Handle manual refresh
  const handleRefresh = useCallback(() => {
    refreshPottyBreaks();
    if (onRefresh) onRefresh();
    toast({
      title: 'Refreshed',
      description: 'Dog let out data has been refreshed',
    });
  }, [refreshPottyBreaks, onRefresh, toast]);
  
  // Handle creating a new group
  const handleAddGroup = useCallback(async () => {
    if (!newGroupName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a group name',
        variant: 'destructive'
      });
      return;
    }
    
    const groupId = await addGroup(newGroupName, newGroupColor);
    if (groupId) {
      setShowAddGroupDialog(false);
      setNewGroupName('');
      setNewGroupColor('#1890ff');
      setSelectedGroup(groupId);
    }
  }, [newGroupName, newGroupColor, addGroup, toast]);
  
  // Handle group potty break actions
  const handleGroupAction = useCallback((timeSlot: string, status: 'out' | 'in') => {
    if (selectedGroup === 'all' || selectedGroup === 'outside') {
      toast({
        title: 'Select a group',
        description: 'Please select a specific group to perform this action',
        variant: 'destructive'
      });
      return;
    }
    
    handleGroupPottyBreak(selectedGroup, timeSlot, status);
  }, [selectedGroup, handleGroupPottyBreak, toast]);
  
  const isLoading = groupsLoading || pottyBreaksLoading;
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Select
            value={selectedGroup}
            onValueChange={setSelectedGroup}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Dogs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dogs</SelectItem>
              <SelectItem value="outside">Currently Outside</SelectItem>
              {groups.map(group => (
                <SelectItem key={group.id} value={group.id}>
                  <div className="flex items-center">
                    <div 
                      className="w-2 h-2 rounded-full mr-2" 
                      style={{backgroundColor: group.color || '#1890ff'}}
                    />
                    {group.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowAddGroupDialog(true)}
          >
            Add Group
          </Button>
          
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            size="sm"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <Badge variant="outline" className="bg-green-100 dark:bg-green-900/20 mr-2">
              <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
              In
            </Badge>
            <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900/20 mr-2">
              <AlertCircle className="h-3 w-3 mr-1 text-yellow-600" />
              Out
            </Badge>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : filteredDogs.length === 0 ? (
        <div className="text-center p-8 border rounded-md bg-muted/20">
          <Dog className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
          <h3 className="text-lg font-medium">No dogs found</h3>
          <p className="text-muted-foreground">Try selecting a different group or add dogs to your kennel.</p>
        </div>
      ) : (
        <div className="border rounded-md overflow-auto">
          <Table>
            <TableHeader className="bg-muted/20 sticky top-0">
              <TableRow>
                <TableHead className="w-[220px]">Dog</TableHead>
                <TableHead className="w-[100px] text-center">Status</TableHead>
                {timeSlots.map((slot) => (
                  <TableHead 
                    key={slot} 
                    className={`text-center min-w-[80px] ${
                      // Highlight current time slot
                      slot.includes(`${currentHour > 12 ? currentHour - 12 : currentHour}:00 ${currentHour >= 12 ? 'PM' : 'AM'}`)
                        ? 'bg-blue-50 dark:bg-blue-900/10 font-medium'
                        : ''
                    }`}
                  >
                    <div>
                      {slot}
                    </div>
                    {selectedGroup !== 'all' && selectedGroup !== 'outside' && (
                      <div className="flex gap-1 mt-1 justify-center">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-6 px-2 py-0 text-xs"
                          onClick={() => handleGroupAction(slot, 'out')}
                        >
                          Group Out
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-6 px-2 py-0 text-xs"
                          onClick={() => handleGroupAction(slot, 'in')}
                        >
                          Group In
                        </Button>
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDogs.map((dog) => (
                <TableRow 
                  key={dog.dog_id}
                  className={isDogOutside(dog.dog_id) ? 'bg-yellow-50 dark:bg-yellow-900/5' : ''}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <span className="mr-2">{dog.dog_name}</span>
                      {isDogOutside(dog.dog_id) && (
                        <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900/20">
                          <span>Outside {getOutsideTime(dog.dog_id)}</span>
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {isDogOutside(dog.dog_id) ? (
                      <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900/20">
                        <AlertCircle className="h-3 w-3 mr-1 text-yellow-600" />
                        Out
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-green-100 dark:bg-green-900/20">
                        <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                        In
                      </Badge>
                    )}
                  </TableCell>
                  {timeSlots.map((slot) => {
                    const status = getPottyBreakStatus(dog.dog_id, slot);
                    
                    return (
                      <TableCell 
                        key={`${dog.dog_id}-${slot}`} 
                        className={`text-center cursor-pointer transition-colors p-0 h-10 ${
                          slot.includes(`${currentHour > 12 ? currentHour - 12 : currentHour}:00 ${currentHour >= 12 ? 'PM' : 'AM'}`)
                            ? 'bg-blue-50 dark:bg-blue-900/10'
                            : ''
                        } ${
                          status
                            ? status === 'out'
                              ? 'bg-yellow-100 dark:bg-yellow-900/20 hover:bg-yellow-200 dark:hover:bg-yellow-900/30'
                              : 'bg-green-100 dark:bg-green-900/20 hover:bg-green-200 dark:hover:bg-green-900/30'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800/50'
                        }`}
                        onClick={() => handleCellClick(dog.dog_id, dog.dog_name, slot)}
                      >
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="w-full h-full flex items-center justify-center">
                                {status && (
                                  <>
                                    {status === 'out' ? (
                                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                                    ) : (
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                    )}
                                  </>
                                )}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {status 
                                  ? status === 'out'
                                    ? `${dog.dog_name} went out at ${slot}`
                                    : `${dog.dog_name} came in at ${slot}`
                                  : `Click to mark ${dog.dog_name} as out/in at ${slot}`
                                }
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Incompatibility warning dialog */}
      <Dialog 
        open={!!incompatibilityWarning} 
        onOpenChange={(open) => !open && clearIncompatibilityWarning()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-amber-500 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Dog Incompatibility Warning
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Alert variant="warning" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Incompatible Dogs</AlertTitle>
              <AlertDescription>
                {incompatibilityWarning?.dogName} should not interact with the following dogs currently outside:
              </AlertDescription>
            </Alert>
            <ul className="list-disc pl-5 space-y-1">
              {incompatibilityWarning?.incompatibleDogs.map(dog => (
                <li key={dog.id}>{dog.name}</li>
              ))}
            </ul>
          </div>
          <DialogDescription>
            Please ensure these dogs don't interact when outside. Do you still want to proceed?
          </DialogDescription>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={clearIncompatibilityWarning}
            >
              Cancel
            </Button>
            <Button 
              variant="default"
              onClick={() => {
                if (incompatibilityWarning) {
                  // Force let the dog out anyway
                  const timeSlot = timeSlots[currentHour - 6]; // Approximate current time slot
                  handleCellClick(incompatibilityWarning.dogId, incompatibilityWarning.dogName, timeSlot);
                  clearIncompatibilityWarning();
                }
              }}
            >
              Let Dog Out Anyway
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Group Dialog */}
      <Dialog open={showAddGroupDialog} onOpenChange={setShowAddGroupDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Dog Group</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="group-name" className="text-right">
                Group Name
              </label>
              <input
                id="group-name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="group-color" className="text-right">
                Group Color
              </label>
              <div className="col-span-3 flex items-center gap-2">
                <div 
                  className="w-6 h-6 rounded-full border" 
                  style={{ backgroundColor: newGroupColor }}
                />
                <input
                  id="group-color"
                  type="color"
                  value={newGroupColor}
                  onChange={(e) => setNewGroupColor(e.target.value)}
                  className="w-full h-10"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddGroupDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddGroup}>
              Create Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DogLetOutTimetable;
