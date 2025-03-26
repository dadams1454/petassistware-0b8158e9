
import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Droplet, 
  Award,
  Utensils, 
  AlertCircle, 
  Check, 
  X,
  Clipboard, 
  PlusCircle, 
  Edit, 
  Trash2,
  ChevronDown,
  ChevronRight,
  Search,
  Activity
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DogCareStatus } from '@/types/dailyCare';
import { useDailyCare } from '@/contexts/dailyCare';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getCareTypeColor, getCareStatusColor, getCareOutcomeLabel } from './utils/careUtils';
import { EmptyState } from '@/components/ui/standardized';

interface EnhancedDailyCareTabProps {
  dogId: string;
  dogName?: string;
}

// Define default care types with their icons
const careTypes = [
  { id: 'potty', label: 'Potty Break', icon: <Droplet className="w-5 h-5" /> },
  { id: 'feeding', label: 'Feeding', icon: <Utensils className="w-5 h-5" /> },
  { id: 'medication', label: 'Medication', icon: <AlertCircle className="w-5 h-5" /> },
  { id: 'grooming', label: 'Grooming', icon: <Award className="w-5 h-5" /> },
  { id: 'health', label: 'Health Check', icon: <Activity className="w-5 h-5" /> }
];

const EnhancedDailyCareTab: React.FC<EnhancedDailyCareTabProps> = ({ dogId, dogName = 'Dog' }) => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [careDate, setCareDate] = useState(new Date());
  const [showAddCareModal, setShowAddCareModal] = useState(false);
  const { fetchDogCareLogs } = useDailyCare();

  // Example care logs (in a real implementation, these would come from the fetchDogCareLogs function)
  const [careLogs, setCareLogs] = useState([
    { id: "1", dog_id: dogId, category: 'potty', task_name: 'Morning Walk', outcome: 'success', notes: 'Quick walk outside', timestamp: new Date(new Date().setHours(8, 30)).toISOString(), created_at: new Date().toISOString(), created_by: '' },
    { id: "2", dog_id: dogId, category: 'feeding', task_name: 'Breakfast', outcome: 'partial', notes: 'Ate about half the food', timestamp: new Date(new Date().setHours(7, 15)).toISOString(), created_at: new Date().toISOString(), created_by: '' },
    { id: "3", dog_id: dogId, category: 'medication', task_name: 'Heartworm Prevention', outcome: 'success', notes: 'Monthly dose', timestamp: new Date(new Date().setHours(18, 0, 0, 0)).toISOString(), created_at: new Date().toISOString(), created_by: '' }
  ]);

  // Filter logs by selected date
  const filteredLogs = careLogs.filter(log => 
    new Date(log.timestamp).toDateString() === careDate.toDateString()
  );

  // Sort logs by most recent
  const sortedLogs = [...filteredLogs].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Calculate care completion stats
  const totalExpectedCare = 8; // This would come from scheduled care items
  const completedCare = sortedLogs.filter(log => log.outcome === 'success').length;
  const completionPercentage = Math.round((completedCare / totalExpectedCare) * 100) || 0;

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
      {/* Control bar */}
      <div className="bg-white dark:bg-gray-800 p-4 border-b flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold hidden sm:block">Daily Care for {dogName}</h2>
        </div>

        <div className="flex items-center space-x-2">
          {/* Date selector */}
          <div className="flex items-center border rounded px-3 py-2 bg-white dark:bg-gray-800 shadow-sm">
            <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
            <input
              type="date"
              className="text-sm border-none focus:outline-none p-0 bg-transparent"
              value={careDate.toISOString().split('T')[0]}
              onChange={(e) => setCareDate(new Date(e.target.value))}
            />
          </div>

          {/* Add care button */}
          <Button 
            onClick={() => setShowAddCareModal(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Record Care
          </Button>
        </div>
      </div>

      {/* Tab navigation */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <div className="bg-white dark:bg-gray-800 border-b">
          <TabsList className="w-full justify-start h-auto p-0 bg-transparent">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-4 py-3"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-4 py-3"
            >
              Care History
            </TabsTrigger>
            <TabsTrigger 
              value="schedule" 
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-4 py-3"
            >
              Care Schedule
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab content */}
        <div className="p-4 overflow-auto">
          <TabsContent value="overview" className="mt-0">
            <DailyCareOverview 
              dogName={dogName}
              careLogs={sortedLogs} 
              careTypes={careTypes}
              onAddCare={() => setShowAddCareModal(true)}
              completionPercentage={completionPercentage}
              completedCare={completedCare}
              totalExpectedCare={totalExpectedCare}
            />
          </TabsContent>

          <TabsContent value="history" className="mt-0">
            <CareHistory 
              dogName={dogName}
              careLogs={careLogs}
              careTypes={careTypes}
            />
          </TabsContent>

          <TabsContent value="schedule" className="mt-0">
            <CareSchedule 
              dogName={dogName}
              careDate={careDate}
            />
          </TabsContent>
        </div>
      </Tabs>

      {/* Add care modal */}
      {showAddCareModal && (
        <AddCareModal 
          onClose={() => setShowAddCareModal(false)}
          dogName={dogName}
          dogId={dogId}
          careDate={careDate}
          careTypes={careTypes}
          onSuccess={(newCareLog) => {
            setCareLogs([...careLogs, newCareLog]);
            setShowAddCareModal(false);
          }}
        />
      )}
    </div>
  );
};

// Overview tab content
interface DailyCareOverviewProps {
  dogName: string;
  careLogs: any[];
  careTypes: any[];
  onAddCare: () => void;
  completionPercentage: number;
  completedCare: number;
  totalExpectedCare: number;
}

const DailyCareOverview: React.FC<DailyCareOverviewProps> = ({ 
  dogName,
  careLogs, 
  careTypes, 
  onAddCare,
  completionPercentage,
  completedCare,
  totalExpectedCare
}) => {
  if (!dogName) {
    return (
      <EmptyState
        title="No Dog Selected"
        description="Please select a dog to view their daily care."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left column: Dog info and quick stats */}
      <div className="md:col-span-1">
        <Card className="mb-6">
          <CardContent className="pt-6">
            {/* Care completion card */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Today's Care Progress</h3>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">{completedCare} of {totalExpectedCare} completed</span>
                <span 
                  className="text-sm font-medium" 
                  style={{ 
                    color: completionPercentage >= 70 ? 'var(--color-success)' : 'var(--color-destructive)' 
                  }}
                >
                  {completionPercentage}%
                </span>
              </div>
              <Progress 
                value={completionPercentage} 
                className="h-2" 
                indicatorClassName={completionPercentage >= 70 ? "bg-green-500" : "bg-red-500"}
              />
            </div>

            {/* Quick care buttons */}
            <div>
              <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Quick Care</h3>
              <div className="grid grid-cols-2 gap-2">
                {careTypes.map(type => (
                  <Button
                    key={type.id}
                    variant="outline"
                    className="flex flex-col items-center justify-center p-3 h-auto"
                    onClick={onAddCare}
                  >
                    <div className={`w-8 h-8 flex items-center justify-center text-${getCareTypeColor(type.id)}-500 mb-1`}>
                      {type.icon}
                    </div>
                    <span className="text-xs font-medium">{type.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Next care items card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Upcoming Care</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg">
              <div className="w-8 h-8 flex items-center justify-center text-blue-500 mr-3">
                <Utensils className="w-5 h-5" />
              </div>
              <div className="flex-grow">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Evening Meal</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Due in 2 hours</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Check className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-lg">
              <div className="w-8 h-8 flex items-center justify-center text-purple-500 mr-3">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="flex-grow">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Heartworm Medication</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Due at 8:00 PM</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Check className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg">
              <div className="w-8 h-8 flex items-center justify-center text-blue-500 mr-3">
                <Droplet className="w-5 h-5" />
              </div>
              <div className="flex-grow">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Evening Potty Break</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Due at 9:00 PM</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Check className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Right column: Care logs and analytics */}
      <div className="md:col-span-2">
        {/* Today's care log */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">Today's Care Log</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="text-sm h-8"
                onClick={onAddCare}
              >
                <PlusCircle className="w-4 h-4 mr-1" />
                Add Entry
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {careLogs.length > 0 ? (
              <div className="space-y-3">
                {careLogs.map(log => {
                  const careType = careTypes.find(type => type.id === log.category);
                  return (
                    <div key={log.id} className="flex p-3 bg-gray-50 dark:bg-gray-800/60 rounded-lg">
                      <div 
                        className={`w-10 h-10 rounded-full mr-3 flex items-center justify-center ${
                          log.outcome === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-500' :
                          log.outcome === 'partial' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-500' :
                          'bg-red-100 dark:bg-red-900/30 text-red-500'
                        }`}
                      >
                        {careType?.icon || <Clipboard className="w-5 h-5" />}
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <h4 className="font-medium text-gray-800 dark:text-gray-200">{careType?.label || log.task_name}</h4>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{log.notes}</p>
                        <div className="flex items-center mt-2">
                          <span 
                            className={`text-xs font-medium px-2 py-1 rounded-full ${
                              log.outcome === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                              log.outcome === 'partial' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
                              'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                            }`}
                          >
                            {log.outcome === 'success' ? 'Complete' :
                             log.outcome === 'partial' ? 'Partial' :
                             'Missed'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-start space-x-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>No care logs for today</p>
                <Button
                  className="mt-4"
                  onClick={onAddCare}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Record Care
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Care analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Care Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                <h4 className="text-xs uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">Potty Success</h4>
                <div className="flex items-end">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">85%</span>
                  <span className="text-sm text-green-600 dark:text-green-400 ml-2 flex items-center">
                    +5%
                    <ChevronRight className="w-4 h-4 transform rotate-90" />
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Last 7 days</p>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
                <h4 className="text-xs uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">Feeding Compliance</h4>
                <div className="flex items-end">
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">92%</span>
                  <span className="text-sm text-green-600 dark:text-green-400 ml-2 flex items-center">
                    +3%
                    <ChevronRight className="w-4 h-4 transform rotate-90" />
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Last 7 days</p>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-800">
                <h4 className="text-xs uppercase text-gray-500 dark:text-gray-400 font-medium mb-1">Medication Adherence</h4>
                <div className="flex items-end">
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">100%</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-2 flex items-center">
                    0%
                    <ChevronRight className="w-4 h-4 transform rotate-0" />
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Last 7 days</p>
              </div>
            </div>
            
            {/* Weekly care completion graph - placeholder */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-lg border">
              <h4 className="text-xs uppercase text-gray-500 dark:text-gray-400 font-medium mb-3">Weekly Care Completion</h4>
              <div className="h-40 flex items-end justify-between">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                  <div key={day} className="flex flex-col items-center">
                    <div 
                      className="w-8 bg-blue-500 dark:bg-blue-400 rounded-t"
                      style={{ 
                        height: `${[70, 85, 90, 80, 95, 60, 75][index]}%`,
                        opacity: day === 'Sun' ? 1 : 0.7 + (index * 0.05)
                      }}
                    ></div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{day}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// History tab content
interface CareHistoryProps {
  dogName: string;
  careLogs: any[];
  careTypes: any[];
}

const CareHistory: React.FC<CareHistoryProps> = ({ dogName, careLogs, careTypes }) => {
  if (!dogName) {
    return (
      <EmptyState
        title="No Dog Selected"
        description="Please select a dog to view their care history."
      />
    );
  }
  
  // Sort logs by most recent
  const sortedLogs = [...careLogs].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Care History</CardTitle>
        <p className="text-sm text-muted-foreground">Review past care activities for {dogName}</p>
      </CardHeader>
      <CardContent>
        {sortedLogs.length > 0 ? (
          <div className="space-y-6">
            {sortedLogs.map(log => {
              const careType = careTypes.find(type => type.id === log.category);
              
              return (
                <div key={log.id} className="flex">
                  <div className="mr-4 relative">
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        log.outcome === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-500' :
                        log.outcome === 'partial' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-500' :
                        'bg-red-100 dark:bg-red-900/30 text-red-500'
                      }`}
                    >
                      {careType?.icon || <Clipboard className="w-5 h-5" />}
                    </div>
                    <div className="absolute top-10 bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                  </div>
                  
                  <div className="flex-grow pb-6">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-gray-800 dark:text-gray-200">{careType?.label || log.task_name}</h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(log.timestamp).toLocaleDateString()} at {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{log.notes}</p>
                    
                    <div className="flex items-center mt-2">
                      <span 
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          log.outcome === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                          log.outcome === 'partial' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
                          'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                        }`}
                      >
                        {log.outcome === 'success' ? 'Complete' :
                         log.outcome === 'partial' ? 'Partial' :
                         'Missed'}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                        {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState 
            title="No Care History" 
            description="No care activities have been recorded yet."
            action={{
              label: "Record Care",
              onClick: () => {} // This would need to be passed down from parent
            }}
          />
        )}
      </CardContent>
    </Card>
  );
};

// Schedule tab content
interface CareScheduleProps {
  dogName: string;
  careDate: Date;
}

const CareSchedule: React.FC<CareScheduleProps> = ({ dogName, careDate }) => {
  if (!dogName) {
    return (
      <EmptyState
        title="No Dog Selected"
        description="Please select a dog to view their care schedule."
      />
    );
  }
  
  // Example scheduled care items
  const scheduledCare = [
    { id: 1, type: 'feeding', label: 'Breakfast', time: '7:00 AM', completed: true },
    { id: 2, type: 'potty', label: 'Morning Potty Break', time: '7:30 AM', completed: true },
    { id: 3, type: 'medication', label: 'Morning Medication', time: '8:00 AM', completed: true },
    { id: 4, type: 'feeding', label: 'Lunch', time: '12:00 PM', completed: false },
    { id: 5, type: 'potty', label: 'Afternoon Potty Break', time: '1:00 PM', completed: false },
    { id: 6, type: 'feeding', label: 'Dinner', time: '6:00 PM', completed: false },
    { id: 7, type: 'potty', label: 'Evening Potty Break', time: '7:00 PM', completed: false },
    { id: 8, type: 'medication', label: 'Evening Medication', time: '8:00 PM', completed: false },
  ];
  
  return (
    <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
      {/* Schedule column */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Care Schedule</CardTitle>
              <p className="text-sm text-muted-foreground">
                {careDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            
            <Button variant="secondary" size="sm" className="h-8">
              <PlusCircle className="mr-1 h-4 w-4" />
              Add Schedule
            </Button>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="divide-y">
              {scheduledCare.map(item => (
                <div 
                  key={item.id} 
                  className={`p-4 flex items-center ${
                    item.completed ? 'bg-gray-50 dark:bg-gray-800/40' : 'bg-white dark:bg-gray-800'
                  }`}
                >
                  <div className="mr-4 w-12 text-gray-400 dark:text-gray-500 text-sm font-medium">
                    {item.time}
                  </div>
                  
                  <div 
                    className={`w-5 h-5 rounded-full mr-3 border flex items-center justify-center ${
                      item.completed 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    {item.completed && <Check className="w-3 h-3" />}
                  </div>
                  
                  <div className="flex-grow">
                    <span 
                      className={`font-medium ${
                        item.completed ? 'text-gray-500 dark:text-gray-400 line-through' : 'text-gray-800 dark:text-gray-200'
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                  
                  <div className="flex space-x-1">
                    {!item.completed && (
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Settings column */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Default Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-800 dark:text-gray-200">Feeding Times</h4>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              <ul className="mt-2 space-y-1">
                <li className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                  <Clock className="w-3 h-3 mr-1 text-gray-400 dark:text-gray-500" />
                  Breakfast: 7:00 AM
                </li>
                <li className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                  <Clock className="w-3 h-3 mr-1 text-gray-400 dark:text-gray-500" />
                  Lunch: 12:00 PM
                </li>
                <li className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                  <Clock className="w-3 h-3 mr-1 text-gray-400 dark:text-gray-500" />
                  Dinner: 6:00 PM
                </li>
              </ul>
            </div>
            
            <div className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-800 dark:text-gray-200">Potty Breaks</h4>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              <ul className="mt-2 space-y-1">
                <li className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                  <Clock className="w-3 h-3 mr-1 text-gray-400 dark:text-gray-500" />
                  Morning: 7:30 AM
                </li>
                <li className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                  <Clock className="w-3 h-3 mr-1 text-gray-400 dark:text-gray-500" />
                  Afternoon: 1:00 PM
                </li>
                <li className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                  <Clock className="w-3 h-3 mr-1 text-gray-400 dark:text-gray-500" />
                  Evening: 7:00 PM
                </li>
              </ul>
            </div>
            
            <Button className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Care Type
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Add Care Modal
interface AddCareModalProps {
  onClose: () => void;
  dogName: string;
  dogId: string;
  careDate: Date;
  careTypes: any[];
  onSuccess: (newCareLog: any) => void;
}

const AddCareModal: React.FC<AddCareModalProps> = ({ 
  onClose, 
  dogName, 
  dogId,
  careDate, 
  careTypes,
  onSuccess
}) => {
  const [selectedType, setSelectedType] = useState(careTypes[0].id);
  const [outcome, setOutcome] = useState('success');
  const [notes, setNotes] = useState('');
  const [time, setTime] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a timestamp combining the care date and time
    const [hours, minutes] = time.split(':').map(Number);
    const timestamp = new Date(careDate);
    timestamp.setHours(hours, minutes);
    
    // Create a new care log
    const newCareLog = {
      id: `temp-${Date.now()}`, // In a real implementation this would be generated by the database
      dog_id: dogId,
      category: selectedType,
      task_name: careTypes.find(type => type.id === selectedType)?.label || 'Care Activity',
      outcome,
      notes,
      timestamp: timestamp.toISOString(),
      created_at: new Date().toISOString(),
      created_by: ''
    };
    
    // Call onSuccess with the new care log
    onSuccess(newCareLog);
  };
  
  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Record Care</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Record care activity for {dogName} on {careDate.toLocaleDateString()}
          </p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Care Type</label>
            <div className="grid grid-cols-2 gap-2">
              {careTypes.map(type => (
                <Button
                  key={type.id}
                  type="button"
                  variant={selectedType === type.id ? "default" : "outline"}
                  className="justify-start p-3 h-auto"
                  onClick={() => setSelectedType(type.id)}
                >
                  <div className="mr-2">
                    {type.icon}
                  </div>
                  <span className="font-medium text-sm">{type.label}</span>
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Time</label>
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Outcome</label>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant={outcome === 'success' ? "default" : "outline"}
                className={outcome === 'success' ? "bg-green-600 hover:bg-green-700" : ""}
                onClick={() => setOutcome('success')}
              >
                <Check className="w-4 h-4 mr-1" />
                Complete
              </Button>
              
              <Button
                type="button"
                variant={outcome === 'partial' ? "default" : "outline"}
                className={outcome === 'partial' ? "bg-yellow-600 hover:bg-yellow-700" : ""}
                onClick={() => setOutcome('partial')}
              >
                <AlertCircle className="w-4 h-4 mr-1" />
                Partial
              </Button>
              
              <Button
                type="button"
                variant={outcome === 'missed' ? "default" : "outline"}
                className={outcome === 'missed' ? "bg-red-600 hover:bg-red-700" : ""}
                onClick={() => setOutcome('missed')}
              >
                <X className="w-4 h-4 mr-1" />
                Missed
              </Button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              className="w-full p-2 border rounded-lg min-h-[100px] bg-background resize-none"
              placeholder="Add any notes about this care activity..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
            >
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedDailyCareTab;
