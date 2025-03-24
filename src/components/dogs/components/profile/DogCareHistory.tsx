
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Bath, Brush, MilkOff, PawPrint, PlusCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DogCareHistoryProps {
  dogId: string;
}

interface CareLog {
  id: string;
  dog_id: string;
  timestamp: string;
  category: string;
  task_name: string;
  notes?: string;
  created_at: string;
  created_by: string;
}

const DogCareHistory: React.FC<DogCareHistoryProps> = ({ dogId }) => {
  const [careLogs, setCareLogs] = useState<CareLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchCareLogs = async () => {
      if (!dogId) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('daily_care_logs')
          .select('*')
          .eq('dog_id', dogId)
          .order('timestamp', { ascending: false }) as { data: CareLog[] | null, error: any };
        
        if (error) throw error;
        
        setCareLogs(data || []);
      } catch (error) {
        console.error('Error fetching care logs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCareLogs();
  }, [dogId]);
  
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'potty':
        return <PawPrint className="h-4 w-4" />;
      case 'feeding':
        return <MilkOff className="h-4 w-4" />;
      case 'grooming':
        return <Brush className="h-4 w-4" />;
      case 'bathing':
        return <Bath className="h-4 w-4" />;
      case 'exercise':
        return <Activity className="h-4 w-4" />;
      default:
        return <PawPrint className="h-4 w-4" />;
    }
  };
  
  // Group logs by date
  const logsByDate = careLogs.reduce<Record<string, CareLog[]>>((groups, log) => {
    const date = format(new Date(log.timestamp), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(log);
    return groups;
  }, {});
  
  // Group logs by category
  const logsByCategory = careLogs.reduce<Record<string, CareLog[]>>((groups, log) => {
    if (!groups[log.category]) {
      groups[log.category] = [];
    }
    groups[log.category].push(log);
    return groups;
  }, {});
  
  // List of all categories
  const categories = Object.keys(logsByCategory);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Care History</h2>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          Log Care Activity
        </Button>
      </div>
      
      <Tabs defaultValue="timeline">
        <TabsList>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="timeline" className="space-y-6 pt-4">
          {careLogs.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No care history found</p>
                  <Button variant="outline" className="mt-2">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Log Care Activity
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            Object.entries(logsByDate).map(([date, logs]) => (
              <div key={date}>
                <h3 className="font-medium text-muted-foreground mb-2">{format(new Date(date), 'EEEE, MMMM d, yyyy')}</h3>
                <Card>
                  <CardContent className="p-0">
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {logs.map((log) => (
                        <div key={log.id} className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="bg-primary/10 p-3 rounded-full">
                              {getCategoryIcon(log.category)}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">{log.task_name}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {log.category} • {format(new Date(log.timestamp), 'h:mm a')}
                                  </p>
                                </div>
                              </div>
                              {log.notes && (
                                <p className="mt-2 text-sm">{log.notes}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))
          )}
        </TabsContent>
        
        <TabsContent value="categories" className="space-y-6 pt-4">
          {categories.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No care history found</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categories.map((category) => (
                <Card key={category}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <div className="bg-primary/10 p-2 rounded-full">
                        {getCategoryIcon(category)}
                      </div>
                      <CardTitle className="text-lg capitalize">{category}</CardTitle>
                    </div>
                    <CardDescription>
                      {logsByCategory[category].length} {logsByCategory[category].length === 1 ? 'record' : 'records'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {logsByCategory[category].slice(0, 5).map((log) => (
                        <li key={log.id} className="text-sm">
                          <div className="flex justify-between">
                            <span>{log.task_name}</span>
                            <span className="text-muted-foreground">
                              {format(new Date(log.timestamp), 'MMM d, h:mm a')}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                    {logsByCategory[category].length > 5 && (
                      <Button variant="ghost" size="sm" className="mt-2 w-full">
                        View all {logsByCategory[category].length} records
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="stats" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Care Statistics</CardTitle>
              <CardDescription>Summary of care activities</CardDescription>
            </CardHeader>
            <CardContent>
              {careLogs.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No data available for statistics</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Activities by Category</h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div key={category} className="flex items-center">
                          <div className="w-24 capitalize">{category}</div>
                          <div className="flex-1 h-4 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden">
                            <div 
                              className="h-full bg-primary" 
                              style={{ width: `${(logsByCategory[category].length / careLogs.length) * 100}%` }}
                            ></div>
                          </div>
                          <div className="w-12 text-right">
                            {logsByCategory[category].length}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Recent Activity</h3>
                    <p className="text-sm text-muted-foreground">
                      Last activity: {format(new Date(careLogs[0].timestamp), 'MMMM d, yyyy h:mm a')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Total activities in the last 7 days: {
                        careLogs.filter(log => {
                          const logDate = new Date(log.timestamp);
                          const sevenDaysAgo = new Date();
                          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                          return logDate >= sevenDaysAgo;
                        }).length
                      }
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DogCareHistory;
