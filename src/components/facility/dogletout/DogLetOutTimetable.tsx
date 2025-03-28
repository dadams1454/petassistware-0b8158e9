import React, { useState, useMemo, useCallback } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/components/ui/use-toast';
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
    isLoading: groupsLoading 
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
    handleCellClick,
    isLoading: pottyBreaksLoading,
    refreshPottyBreaks
  } = usePottyBreakTimetable(dogsData, date);
  
  // Filter dogs based on selected group
  const filteredDogs = useMemo(() => {
    if (selectedGroup === 'all') return dogsData;
    
    if (selectedGroup === 'outside') {
      return dogsData.filter(dog => {
        // Check if dog has any active potty breaks
        return timeSlots.some(timeSlot => {
          const status = pottyBreaks[dog.dog_id]?.find(brk => brk.timeSlot === timeSlot);
          return status && status.status === 'out';
        });
      });
    }
    
    const group = groups.find(g => g.id === selectedGroup);
    if (!group) return dogsData;
    
    return dogsData.filter(dog => 
      group.dogIds.includes(dog.dog_id)
    );
  }, [dogsData, selectedGroup, groups, pottyBreaks, timeSlots]);
  
  // Handle manual refresh
  const handleRefresh = useCallback(() => {
    refreshPottyBreaks();
    if (onRefresh) onRefresh();
    toast({
      title: 'Refreshed',
      description: 'Dog let out data has been refreshed',
    });
  }, [refreshPottyBreaks, onRefresh, toast]);
  
  // Handle cell click to mark dog as out/in
  const onCellClick = useCallback((dogId: string, dogName: string, timeSlot: string) => {
    handleCellClick(dogId, dogName, timeSlot);
  }, [handleCellClick]);
  
  // Check if a dog is currently out
  const isDogOutside = useCallback((dogId: string) => {
    return timeSlots.some(timeSlot => {
      const breaks = pottyBreaks[dogId] || [];
      return breaks.some(brk => brk.status === 'out');
    });
  }, [timeSlots, pottyBreaks]);
  
  // Get time since dog was let out (for outside dogs)
  const getOutsideTime = useCallback((dogId: string) => {
    const now = new Date();
    const dogBreaks = pottyBreaks[dogId] || [];
    
    const latestBreak = dogBreaks
      .filter(brk => brk.status === 'out')
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
    
    if (!latestBreak) return null;
    
    const outTime = new Date(latestBreak.timestamp);
    const diffMs = now.getTime() - outTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins}m`;
    } else {
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return `${hours}h ${mins}m`;
    }
  }, [pottyBreaks]);
  
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
                <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
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
                    {slot}
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
                    const hasBreak = hasPottyBreak(dog.dog_id, slot);
                    const breakStatus = pottyBreaks[dog.dog_id]?.find(brk => brk.timeSlot === slot)?.status;
                    
                    return (
                      <TableCell 
                        key={`${dog.dog_id}-${slot}`} 
                        className={`text-center cursor-pointer transition-colors p-0 h-10 ${
                          slot.includes(`${currentHour > 12 ? currentHour - 12 : currentHour}:00 ${currentHour >= 12 ? 'PM' : 'AM'}`)
                            ? 'bg-blue-50 dark:bg-blue-900/10'
                            : ''
                        } ${
                          hasBreak
                            ? breakStatus === 'out'
                              ? 'bg-yellow-100 dark:bg-yellow-900/20 hover:bg-yellow-200 dark:hover:bg-yellow-900/30'
                              : 'bg-green-100 dark:bg-green-900/20 hover:bg-green-200 dark:hover:bg-green-900/30'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800/50'
                        }`}
                        onClick={() => onCellClick(dog.dog_id, dog.dog_name, slot)}
                      >
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="w-full h-full flex items-center justify-center">
                                {hasBreak && (
                                  <>
                                    {breakStatus === 'out' ? (
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
                                {hasBreak 
                                  ? breakStatus === 'out'
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
    </div>
  );
};

export default DogLetOutTimetable;
