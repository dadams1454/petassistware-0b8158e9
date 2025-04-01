
import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CircleAlert, 
  CalendarClock, 
  ArrowUpRight,
  Pill, 
  Stethoscope, 
  Syringe, 
  Scissors
} from 'lucide-react';
import { useHealthTabContext } from './HealthTabContext';
import { HealthRecord, HealthRecordTypeEnum } from '@/types/health';
import { format, isPast, isFuture, addDays } from 'date-fns';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WeightUnitEnum } from '@/types/health';

const SummaryTabContent: React.FC = () => {
  const { 
    dogId, 
    healthRecords, 
    weightHistory,
    openAddVaccinationDialog,
    openAddExaminationDialog,
    openAddMedicationDialog,
    openAddWeightDialog,
    handleEditRecord,
    isLoading 
  } = useHealthTabContext();
  
  const [summaryTab, setSummaryTab] = useState<string>('upcoming');
  
  // Filter for upcoming records
  const upcomingRecords = healthRecords
    .filter(record => record.next_due_date && isFuture(new Date(record.next_due_date)))
    .sort((a, b) => new Date(a.next_due_date!).getTime() - new Date(b.next_due_date!).getTime())
    .slice(0, 5);
  
  // Filter for overdue records
  const overdueRecords = healthRecords
    .filter(record => record.next_due_date && isPast(new Date(record.next_due_date)))
    .sort((a, b) => new Date(b.next_due_date!).getTime() - new Date(a.next_due_date!).getTime());
  
  // Get recent records
  const recentRecords = [...healthRecords]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  // Get latest weight record
  const latestWeight = weightHistory.length > 0 
    ? weightHistory[0] 
    : null;
  
  // Get previous weight for comparison
  const previousWeight = weightHistory.length > 1 
    ? weightHistory[1] 
    : null;
  
  // Helper to format dates
  const formatDate = (date: string) => {
    return format(new Date(date), 'MMM d, yyyy');
  };
  
  // Helper to get icon for record type
  const getRecordIcon = (type: HealthRecordTypeEnum) => {
    switch (type) {
      case HealthRecordTypeEnum.Vaccination:
        return <Syringe className="h-4 w-4" />;
      case HealthRecordTypeEnum.Examination:
        return <Stethoscope className="h-4 w-4" />;
      case HealthRecordTypeEnum.Medication:
        return <Pill className="h-4 w-4" />;
      case HealthRecordTypeEnum.Surgery:
        return <Scissors className="h-4 w-4" />;
      default:
        return <ArrowUpRight className="h-4 w-4" />;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        {/* Quick Stats Card */}
        <Card className="w-full sm:w-1/2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Total Records</span>
                <div className="text-2xl font-semibold">{healthRecords.length}</div>
              </div>
              
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Latest Weight</span>
                <div className="flex items-baseline gap-1">
                  {latestWeight ? (
                    <>
                      <span className="text-2xl font-semibold">{latestWeight.weight}</span>
                      <span className="text-xs text-muted-foreground">{latestWeight.unit}</span>
                    </>
                  ) : (
                    <span className="text-sm italic text-muted-foreground">No data</span>
                  )}
                </div>
              </div>
              
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Last Examination</span>
                {healthRecords.find(r => r.record_type === HealthRecordTypeEnum.Examination) ? (
                  <div className="text-sm">
                    {formatDate(
                      healthRecords
                        .filter(r => r.record_type === HealthRecordTypeEnum.Examination)
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
                        .date
                    )}
                  </div>
                ) : (
                  <div className="text-sm italic text-muted-foreground">No data</div>
                )}
              </div>
              
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Overdue</span>
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-semibold">{overdueRecords.length}</span>
                  {overdueRecords.length > 0 && <CircleAlert className="h-4 w-4 text-amber-500" />}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Add New
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={openAddVaccinationDialog}>
                    <Syringe className="h-4 w-4 mr-2" />
                    Vaccination
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={openAddExaminationDialog}>
                    <Stethoscope className="h-4 w-4 mr-2" />
                    Examination
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={openAddMedicationDialog}>
                    <Pill className="h-4 w-4 mr-2" />
                    Medication
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={openAddWeightDialog}>
                    <ArrowUpRight className="h-4 w-4 mr-2" />
                    Weight
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
        
        {/* Weight Trend Card */}
        <Card className="w-full sm:w-1/2">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base font-medium">Weight Trend</CardTitle>
              <Button variant="ghost" size="sm" onClick={openAddWeightDialog}>
                <PlusCircle className="h-4 w-4 mr-1" />
                Add Weight
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {weightHistory.length > 0 ? (
              <div className="space-y-4">
                <div className="flex flex-col">
                  <div className="flex justify-between items-baseline">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-semibold">{latestWeight?.weight}</span>
                      <span className="text-sm text-muted-foreground">{latestWeight?.unit}</span>
                    </div>
                    
                    {previousWeight && (
                      <div className={`text-sm ${
                        latestWeight!.weight > previousWeight.weight 
                          ? 'text-green-500' 
                          : latestWeight!.weight < previousWeight.weight 
                            ? 'text-red-500' 
                            : 'text-muted-foreground'
                      }`}>
                        {latestWeight!.weight > previousWeight.weight && '+'}
                        {((latestWeight!.weight - previousWeight.weight) / previousWeight.weight * 100).toFixed(1)}%
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(latestWeight!.date)}
                  </span>
                </div>
                
                <div className="h-20 pt-4">
                  {/* Simple weight chart visualization */}
                  <div className="flex h-full items-end gap-1">
                    {weightHistory.slice(0, 10).reverse().map((record, index) => {
                      const maxWeight = Math.max(...weightHistory.slice(0, 10).map(w => w.weight));
                      const height = (record.weight / maxWeight) * 100;
                      
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div 
                            className="w-full bg-primary/50 hover:bg-primary transition-colors rounded-t"
                            style={{ height: `${height}%` }}
                            title={`${record.weight} ${record.unit} on ${formatDate(record.date)}`}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-24 text-muted-foreground">
                <p className="text-sm mb-2">No weight data available</p>
                <Button size="sm" onClick={openAddWeightDialog}>
                  Add First Weight
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Health Records Summary Tabs */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Health Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upcoming" value={summaryTab} onValueChange={setSummaryTab}>
            <TabsList className="mb-4 grid w-full grid-cols-3">
              <TabsTrigger value="upcoming">
                Upcoming 
                {upcomingRecords.length > 0 && (
                  <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs">
                    {upcomingRecords.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="overdue">
                Overdue
                {overdueRecords.length > 0 && (
                  <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-amber-700 text-xs">
                    {overdueRecords.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming">
              {upcomingRecords.length > 0 ? (
                <div className="space-y-2">
                  {upcomingRecords.map((record) => (
                    <div 
                      key={record.id} 
                      className="p-3 border rounded-md flex justify-between items-center hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => handleEditRecord(record.id)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-primary/10 rounded-full">
                          {getRecordIcon(record.record_type as HealthRecordTypeEnum)}
                        </div>
                        <div>
                          <div className="font-medium">{record.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {record.performed_by}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center text-sm">
                          <CalendarClock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          <span>{formatDate(record.next_due_date!)}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Due in {Math.ceil((new Date(record.next_due_date!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
                  <p className="text-sm mb-2">No upcoming health records</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="overdue">
              {overdueRecords.length > 0 ? (
                <div className="space-y-2">
                  {overdueRecords.map((record) => (
                    <div 
                      key={record.id} 
                      className="p-3 border border-amber-200 bg-amber-50 rounded-md flex justify-between items-center hover:bg-amber-100 cursor-pointer transition-colors"
                      onClick={() => handleEditRecord(record.id)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-amber-200 rounded-full">
                          {getRecordIcon(record.record_type as HealthRecordTypeEnum)}
                        </div>
                        <div>
                          <div className="font-medium">{record.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {record.performed_by}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center text-sm text-amber-700">
                          <CircleAlert className="h-3.5 w-3.5 mr-1" />
                          <span>{formatDate(record.next_due_date!)}</span>
                        </div>
                        <div className="text-xs text-amber-700 font-medium">
                          Overdue by {Math.ceil((new Date().getTime() - new Date(record.next_due_date!).getTime()) / (1000 * 60 * 60 * 24))} days
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
                  <p className="text-sm mb-2">No overdue health records</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="recent">
              {recentRecords.length > 0 ? (
                <div className="space-y-2">
                  {recentRecords.map((record) => (
                    <div 
                      key={record.id} 
                      className="p-3 border rounded-md flex justify-between items-center hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => handleEditRecord(record.id)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-primary/10 rounded-full">
                          {getRecordIcon(record.record_type as HealthRecordTypeEnum)}
                        </div>
                        <div>
                          <div className="font-medium">{record.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {record.performed_by}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(record.date)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
                  <p className="text-sm mb-2">No health records available</p>
                  <Button size="sm" onClick={openAddExaminationDialog}>
                    Add Health Record
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryTabContent;
