
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDogStatus } from '@/components/dogs/hooks/useDogStatus';
import { format, addDays, differenceInDays } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Check, Thermometer, HeartPulse, Clock, ArrowDownCircle, Clipboard, ShoppingCart, ScrollText } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SectionHeader } from '@/components/ui/standardized';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface WhelpingPreparationProps {
  dog: any;
}

const WhelpingPreparation: React.FC<WhelpingPreparationProps> = ({ dog }) => {
  const [checklistCompleteDialog, setChecklistCompleteDialog] = useState(false);
  const [temperatureDialog, setTemperatureDialog] = useState(false);
  
  const { isPregnant, tieDate, estimatedDueDate, gestationProgressDays } = useDogStatus(dog);
  
  // Fetch or setup checklists
  const { data: whelpingChecklists = [], isLoading: isLoadingChecklists } = useQuery({
    queryKey: ['whelping-checklists', dog.id],
    queryFn: async () => {
      // This would fetch actual checklist items from your database
      // For now, we'll return mock data
      return getDefaultChecklistItems();
    }
  });
  
  // Track temperature logs
  const { data: temperatureLogs = [], isLoading: isLoadingTemps } = useQuery({
    queryKey: ['temperature-logs', dog.id],
    queryFn: async () => {
      // This would fetch actual temperature logs
      // For now, we'll return mock data
      return getDefaultTemperatureLogs(dog.id, estimatedDueDate);
    }
  });
  
  // Show message if not pregnant
  if (!isPregnant || !tieDate) {
    return (
      <div className="space-y-6">
        <SectionHeader 
          title="Whelping Preparation" 
          description="Prepare for successful whelping with our comprehensive checklists"
        />
        
        <Card className="border-dashed">
          <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <Clipboard className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">Not Currently Pregnant</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              Whelping preparation checklists are available for pregnant dogs. Mark this dog as pregnant to access whelping resources.
            </p>
            <Button variant="outline">
              View Pregnancy Management
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Check if it's too early for whelping prep
  const isTooEarlyForPrep = gestationProgressDays ? gestationProgressDays < 45 : false;
  
  // Calculate days until whelping
  const daysUntilWhelping = estimatedDueDate ? differenceInDays(estimatedDueDate, new Date()) : null;
  
  // Temperature trend analysis
  const getTemperatureTrend = () => {
    if (temperatureLogs.length < 2) return null;
    
    const recentLogs = [...temperatureLogs].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ).slice(0, 3);
    
    if (recentLogs.length < 2) return null;
    
    const latest = recentLogs[0].temperature;
    const previous = recentLogs[1].temperature;
    
    const diff = latest - previous;
    
    if (diff <= -1) {
      return {
        trend: 'dropping',
        message: 'Significant temperature drop detected - whelping may be imminent!',
        alert: true
      };
    } else if (diff < 0) {
      return {
        trend: 'decreasing',
        message: 'Temperature is gradually decreasing - continue monitoring',
        alert: false
      };
    } else if (diff === 0) {
      return {
        trend: 'stable',
        message: 'Temperature is stable',
        alert: false
      };
    } else {
      return {
        trend: 'increasing',
        message: 'Temperature is increasing',
        alert: false
      };
    }
  };
  
  const temperatureTrend = getTemperatureTrend();
  
  // Handle temperature logging
  const handleLogTemperature = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const timestamp = new Date();
    const temperature = parseFloat(formData.get('temperature') as string);
    const notes = formData.get('notes') as string;
    
    // Add temperature log to database
    try {
      // In a real app, you would store this in your database
      console.log('Logging temperature:', { 
        dog_id: dog.id, 
        timestamp, 
        temperature, 
        notes 
      });
      
      setTemperatureDialog(false);
      // You would typically refresh the temperature logs here
    } catch (error) {
      console.error('Error logging temperature:', error);
    }
  };
  
  // Mark checklist complete
  const handleMarkChecklist = async () => {
    try {
      // In a real app, you would update the database
      console.log('Marking checklist complete for dog:', dog.id);
      
      setChecklistCompleteDialog(false);
    } catch (error) {
      console.error('Error updating checklist:', error);
    }
  };
  
  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Whelping Preparation" 
        description="Prepare for successful whelping with our comprehensive checklists"
      />
      
      {isTooEarlyForPrep ? (
        <Card>
          <CardContent className="pt-6 pb-6">
            <div className="flex items-start space-x-4">
              <AlertTriangle className="h-6 w-6 text-amber-500 mt-0.5" />
              <div>
                <h3 className="text-lg font-medium mb-1">Too Early for Whelping Preparation</h3>
                <p className="text-muted-foreground">
                  At {gestationProgressDays} days of gestation, it's still too early for detailed whelping preparation. 
                  Whelping preparation typically begins around day 45-50 of pregnancy.
                </p>
                <p className="mt-2">
                  Continue monitoring the pregnancy and return to this section later. 
                  For now, focus on proper nutrition and regular veterinary check-ups.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Whelping Countdown</CardTitle>
                  <CardDescription>
                    {daysUntilWhelping !== null ? (
                      daysUntilWhelping > 0 ? (
                        `${daysUntilWhelping} days until estimated whelping date`
                      ) : daysUntilWhelping === 0 ? (
                        "Whelping due today!"
                      ) : (
                        `${Math.abs(daysUntilWhelping)} days past estimated whelping date`
                      )
                    ) : (
                      "Counting down to whelping"
                    )}
                  </CardDescription>
                </div>
                <div className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                  {gestationProgressDays ? `Day ${gestationProgressDays} of 63` : 'Preparing for whelping'}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {gestationProgressDays && estimatedDueDate && (
                <div className="space-y-1 mb-6">
                  <div className="flex justify-between text-sm">
                    <span>Day 45</span>
                    <span>Day 63</span>
                  </div>
                  <Progress value={((gestationProgressDays - 45) / 18) * 100} className="h-3" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Start Preparations</span>
                    <span>{format(estimatedDueDate, 'MMM d, yyyy')}</span>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <StatusCard
                  title="Due Date"
                  value={estimatedDueDate ? format(estimatedDueDate, 'MMM d, yyyy') : 'Unknown'}
                  icon={<Clock className="h-5 w-5 text-amber-500" />}
                />
                
                <StatusCard
                  title="Temperature Tracking"
                  value={
                    temperatureLogs.length > 0 
                      ? `${temperatureLogs[0].temperature}°F` 
                      : 'Not started'
                  }
                  icon={<Thermometer className="h-5 w-5 text-blue-500" />}
                  action={
                    <Button size="sm" variant="outline" onClick={() => setTemperatureDialog(true)}>
                      Log
                    </Button>
                  }
                />
                
                <StatusCard
                  title="Checklist Progress"
                  value={`${Math.round((whelpingChecklists.filter(item => item.completed).length / whelpingChecklists.length) * 100)}%`}
                  icon={<Clipboard className="h-5 w-5 text-green-500" />}
                />
              </div>
              
              {temperatureTrend?.alert && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-red-800">Temperature Alert</h3>
                      <p className="text-sm text-red-700 mt-1">
                        {temperatureTrend.message}
                      </p>
                      <div className="flex space-x-2 mt-3">
                        <Button size="sm" variant="outline" className="bg-white">
                          View Temperature Log
                        </Button>
                        <Button size="sm" className="bg-red-600 hover:bg-red-700">
                          Alert Vet
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <Thermometer className="h-4 w-4 mr-2" />
                      Temperature Tracking
                    </CardTitle>
                    <CardDescription>
                      Monitor for the temperature drop that signals imminent whelping
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {temperatureLogs.length === 0 ? (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground mb-4">No temperature logs recorded yet</p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setTemperatureDialog(true)}
                        >
                          Record First Temperature
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {temperatureTrend && (
                          <div className={`rounded p-2 text-sm ${
                            temperatureTrend.trend === 'dropping' 
                              ? 'bg-red-50 text-red-800'
                              : temperatureTrend.trend === 'decreasing'
                                ? 'bg-amber-50 text-amber-800'
                                : 'bg-blue-50 text-blue-800'
                          }`}>
                            {temperatureTrend.message}
                          </div>
                        )}
                        
                        <div className="space-y-2 max-h-40 overflow-auto">
                          {temperatureLogs.map((log, index) => (
                            <div key={index} className="flex justify-between items-center text-sm p-2 border-b">
                              <div>
                                <span className="font-medium">{log.temperature}°F</span>
                                <span className="text-muted-foreground ml-2">
                                  {format(new Date(log.timestamp), 'MMM d, h:mm a')}
                                </span>
                              </div>
                              <ArrowDownCircle 
                                className={`h-4 w-4 ${
                                  index > 0 && log.temperature < temperatureLogs[index-1].temperature
                                    ? 'text-red-500'
                                    : 'text-gray-300'
                                }`} 
                              />
                            </div>
                          ))}
                        </div>
                        
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="w-full"
                          onClick={() => setTemperatureDialog(true)}
                        >
                          Record New Temperature
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <HeartPulse className="h-4 w-4 mr-2" />
                      Whelping Signs
                    </CardTitle>
                    <CardDescription>
                      Key signs that whelping is imminent
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <SignItem 
                        label="Temperature drops below 99°F (37.2°C)" 
                        description="Typically 12-24 hours before whelping"
                        isPresent={
                          temperatureLogs.length > 0 && temperatureLogs[0].temperature < 99
                        }
                        isPrimary
                      />
                      <SignItem 
                        label="Restlessness and nesting behavior" 
                        description="Dog may pace, dig, or arrange bedding"
                      />
                      <SignItem 
                        label="Loss of appetite" 
                        description="Reduced interest in food 24-48 hours before"
                      />
                      <SignItem 
                        label="Vomiting" 
                        description="May occur in early labor stages"
                      />
                      <SignItem 
                        label="Vaginal discharge" 
                        description="Clear or slightly bloody"
                      />
                      <SignItem 
                        label="Visible contractions" 
                        description="Rippling movements in the abdomen"
                      />
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center">
                    <Clipboard className="h-5 w-5 mr-2" />
                    Whelping Preparation Checklist
                  </CardTitle>
                  <CardDescription>
                    Essential items and preparations for whelping
                  </CardDescription>
                </div>
                
                {whelpingChecklists.length > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setChecklistCompleteDialog(true)}
                    disabled={!whelpingChecklists.every(item => item.completed)}
                  >
                    Mark Complete
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingChecklists ? (
                <div className="py-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-sm text-muted-foreground">Loading checklist...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium mb-3 flex items-center">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Essential Supplies
                    </h3>
                    <div className="space-y-3">
                      {whelpingChecklists
                        .filter(item => item.category === 'supplies')
                        .map((item, index) => (
                          <ChecklistItem 
                            key={index}
                            item={item}
                            onChange={() => {
                              // In a real app, you would update the database
                              item.completed = !item.completed;
                              // Force refresh
                            }}
                          />
                        ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-3 flex items-center">
                      <ScrollText className="h-4 w-4 mr-2" />
                      Preparation Tasks
                    </h3>
                    <div className="space-y-3">
                      {whelpingChecklists
                        .filter(item => item.category === 'tasks')
                        .map((item, index) => (
                          <ChecklistItem 
                            key={index}
                            item={item}
                            onChange={() => {
                              // In a real app, you would update the database
                              item.completed = !item.completed;
                              // Force refresh
                            }}
                          />
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
      
      {/* Temperature Dialog */}
      <Dialog open={temperatureDialog} onOpenChange={setTemperatureDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Log Temperature</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleLogTemperature} className="space-y-4 pt-4">
            <div className="space-y-2">
              <label htmlFor="temperature" className="text-sm font-medium">
                Temperature (°F) <span className="text-destructive">*</span>
              </label>
              <input
                id="temperature"
                name="temperature"
                type="number"
                step="0.1"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="99.5"
              />
              <p className="text-xs text-muted-foreground">
                Record rectal temperature twice daily. A drop below 99°F signals whelping within 24 hours.
              </p>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={2}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Any observations or behavior changes"
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setTemperatureDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Complete Checklist Dialog */}
      <Dialog open={checklistCompleteDialog} onOpenChange={setChecklistCompleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Checklist Completion</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            <p>
              Are you sure you want to mark the whelping preparation checklist as complete?
              This indicates that you have all necessary supplies and have completed all preparations.
            </p>
            
            <div className="bg-amber-50 text-amber-800 p-3 rounded-md text-sm">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 mt-0.5" />
                <p>
                  Even with complete preparations, continue monitoring temperature and signs of labor as the due date approaches.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setChecklistCompleteDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleMarkChecklist}>
                Confirm Completion
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Helper components
const StatusCard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
  action?: React.ReactNode;
}> = ({ title, value, icon, action }) => (
  <div className="bg-card rounded-lg border p-4">
    <div className="flex items-start justify-between">
      <div className="flex items-start gap-3">
        <div>{icon}</div>
        <div>
          <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
          <p className="text-base font-semibold">{value}</p>
        </div>
      </div>
      {action}
    </div>
  </div>
);

const ChecklistItem: React.FC<{
  item: { label: string; description?: string; completed: boolean };
  onChange: () => void;
}> = ({ item, onChange }) => (
  <div className="flex space-x-2">
    <Checkbox 
      id={`checklist-${item.label}`}
      checked={item.completed}
      onCheckedChange={onChange}
    />
    <div className="grid gap-1.5 leading-none">
      <label
        htmlFor={`checklist-${item.label}`}
        className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
          item.completed ? 'line-through text-muted-foreground' : ''
        }`}
      >
        {item.label}
      </label>
      {item.description && (
        <p className={`text-xs text-muted-foreground ${
          item.completed ? 'line-through' : ''
        }`}>
          {item.description}
        </p>
      )}
    </div>
  </div>
);

const SignItem: React.FC<{
  label: string;
  description: string;
  isPresent?: boolean;
  isPrimary?: boolean;
}> = ({ label, description, isPresent = false, isPrimary = false }) => (
  <li className={`flex items-start gap-2 p-2 rounded-md ${
    isPresent ? 'bg-amber-50' : ''
  }`}>
    <div className={`mt-0.5 ${isPrimary ? 'text-red-500' : 'text-muted-foreground'}`}>
      {isPresent ? <Check className="h-4 w-4" /> : <div className="h-4 w-4 rounded-full border" />}
    </div>
    <div>
      <p className={`${isPrimary ? 'font-medium' : ''}`}>{label}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  </li>
);

// Helper functions for mock data
const getDefaultChecklistItems = () => [
  { 
    label: 'Whelping box', 
    description: 'Clean, spacious, with low sides for mother but high enough to contain puppies',
    completed: false,
    category: 'supplies'
  },
  { 
    label: 'Heat source', 
    description: 'Heating pad or lamp to keep puppies warm',
    completed: false,
    category: 'supplies'
  },
  { 
    label: 'Clean towels and bedding', 
    description: 'Multiple sets for changing as needed',
    completed: false,
    category: 'supplies'
  },
  { 
    label: 'Digital thermometer', 
    description: 'For monitoring temperature drops before whelping',
    completed: false,
    category: 'supplies'
  },
  { 
    label: 'Surgical scissors', 
    description: 'Clean, blunt-tipped for cutting umbilical cords if needed',
    completed: false,
    category: 'supplies'
  },
  { 
    label: 'Dental floss', 
    description: 'Unwaxed, for tying umbilical cords if needed',
    completed: false,
    category: 'supplies'
  },
  { 
    label: 'Iodine solution', 
    description: 'For umbilical cord disinfection',
    completed: false,
    category: 'supplies'
  },
  { 
    label: 'Kitchen scale', 
    description: 'For weighing puppies at birth and monitoring growth',
    completed: false,
    category: 'supplies'
  },
  { 
    label: 'Contact vet', 
    description: 'Ensure vet is aware of due date and available for emergencies',
    completed: false,
    category: 'tasks'
  },
  { 
    label: 'Prepare quiet whelping area', 
    description: 'Low traffic, warm, draft-free location',
    completed: false,
    category: 'tasks'
  },
  { 
    label: 'Track temperature twice daily', 
    description: 'Monitor for the drop below 99°F signaling imminent whelping',
    completed: false,
    category: 'tasks'
  },
  { 
    label: 'Gather emergency contacts', 
    description: 'Vet, emergency clinic, mentor breeder phone numbers',
    completed: false,
    category: 'tasks'
  },
  { 
    label: 'Research normal whelping process', 
    description: 'Understand stages of labor and when to seek help',
    completed: false,
    category: 'tasks'
  },
  { 
    label: 'Prepare ID system for puppies', 
    description: 'Colored collars or other identification method',
    completed: false,
    category: 'tasks'
  }
];

const getDefaultTemperatureLogs = (dogId: string, dueDate: Date | null) => {
  if (!dueDate) return [];
  
  const today = new Date();
  const daysToDue = differenceInDays(dueDate, today);
  
  // If more than 5 days to due date, return empty or minimal logs
  if (daysToDue > 5) {
    return [];
  }
  
  // Generate realistic temperature logs based on proximity to due date
  const logs = [];
  
  // Starting temperature
  let baseTemp = 101.5;
  
  // If very close to due date, show temperature drop
  if (daysToDue <= 1) {
    // Dramatic drop indicating imminent whelping
    logs.push({
      dog_id: dogId,
      timestamp: new Date(today.setHours(today.getHours() - 2)),
      temperature: 98.6,
      notes: "Temperature dropped significantly"
    });
    
    logs.push({
      dog_id: dogId,
      timestamp: new Date(today.setHours(today.getHours() - 12)),
      temperature: 99.8,
      notes: "Temperature starting to drop"
    });
    
    logs.push({
      dog_id: dogId,
      timestamp: new Date(today.setHours(today.getHours() - 24)),
      temperature: 100.5,
      notes: "Normal temperature"
    });
  } else {
    // Regular logs with slight variations
    for (let i = 0; i < 3; i++) {
      const hoursAgo = i * 12;
      const slight_variation = (Math.random() * 0.6) - 0.3;
      
      logs.push({
        dog_id: dogId,
        timestamp: new Date(today.getTime() - (hoursAgo * 60 * 60 * 1000)),
        temperature: (baseTemp + slight_variation).toFixed(1),
        notes: ""
      });
    }
  }
  
  return logs;
};

export default WhelpingPreparation;
