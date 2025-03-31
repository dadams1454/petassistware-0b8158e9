
import React, { useState } from 'react';
import { format } from 'date-fns';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  AlertCircle,
  Activity, 
  BarChart3, 
  Clock, 
  Calendar as CalendarIcon,
  MapPin, 
  CloudRain,
  Timer,
  Check
} from 'lucide-react';
import { ExerciseRecord } from '@/services/exerciseService';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ExerciseHistoryProps {
  exercises: ExerciseRecord[];
  summary: any;
  isLoading: boolean;
  onFilterChange: (days: number) => void;
}

const ExerciseHistory: React.FC<ExerciseHistoryProps> = ({ 
  exercises, 
  summary, 
  isLoading, 
  onFilterChange 
}) => {
  const [activeFilter, setActiveFilter] = useState<number>(30);
  
  // Get intensity color
  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'low':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
    }
  };
  
  // Handle filter click
  const handleFilterClick = (days: number) => {
    setActiveFilter(days);
    onFilterChange(days);
  };
  
  // Format exercise data for charts
  const dailyExerciseData = exercises.reduce<Record<string, { date: string, minutes: number }>>((acc, ex) => {
    const date = format(new Date(ex.timestamp), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = { 
        date: format(new Date(ex.timestamp), 'MMM dd'),
        minutes: 0 
      };
    }
    acc[date].minutes += ex.duration;
    return acc;
  }, {});
  
  const chartData = Object.values(dailyExerciseData).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  ).slice(-14); // Last 14 days with data
  
  // Format exercise types for chart
  const typeData = summary?.byType ? 
    Object.entries(summary.byType)
      .map(([type, minutes]) => ({ 
        name: type, 
        minutes: Number(minutes) 
      }))
      .sort((a, b) => b.minutes - a.minutes)
    : [];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          {[7, 30, 90].map(days => (
            <Button 
              key={days}
              variant={activeFilter === days ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterClick(days)}
            >
              {days} Days
            </Button>
          ))}
        </div>
      </div>
      
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Total Exercise Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Timer className="h-5 w-5 mr-2 text-primary" />
                <span className="text-2xl font-bold">
                  {summary.totalDuration} minutes
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Over the last {activeFilter} days
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Exercise Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Activity className="h-5 w-5 mr-2 text-primary" />
                <span className="text-2xl font-bold">
                  {summary.exerciseCount}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Average: {Math.round(summary.averageDuration)} min per session
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Most Common Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {typeData.length > 0 ? (
                <div className="flex items-center">
                  <Check className="h-5 w-5 mr-2 text-primary" />
                  <span className="text-2xl font-bold">
                    {typeData[0].name}
                  </span>
                </div>
              ) : (
                <span className="text-muted-foreground">No data available</span>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {typeData.length > 0 ? `${typeData[0].minutes} minutes total` : ''}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
      
      <Tabs defaultValue="table">
        <TabsList>
          <TabsTrigger value="table">
            <Activity className="h-4 w-4 mr-2" />
            Activity Log
          </TabsTrigger>
          <TabsTrigger value="trends">
            <BarChart3 className="h-4 w-4 mr-2" />
            Trends
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="table" className="pt-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : exercises.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No exercise records found</AlertTitle>
              <AlertDescription>
                Log your first exercise activity to start tracking.
              </AlertDescription>
            </Alert>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Intensity</TableHead>
                  <TableHead className="hidden md:table-cell">Location</TableHead>
                  <TableHead className="hidden md:table-cell">Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exercises.map((exercise) => (
                  <TableRow key={exercise.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{format(new Date(exercise.timestamp), 'MMM d, yyyy')}</span>
                        <span className="text-xs text-muted-foreground">{format(new Date(exercise.timestamp), 'h:mm a')}</span>
                      </div>
                    </TableCell>
                    <TableCell>{exercise.exercise_type}</TableCell>
                    <TableCell>{exercise.duration} min</TableCell>
                    <TableCell>
                      <Badge className={getIntensityColor(exercise.intensity)}>
                        {exercise.intensity.charAt(0).toUpperCase() + exercise.intensity.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{exercise.location}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="line-clamp-1">{exercise.notes || '-'}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>
        
        <TabsContent value="trends" className="pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Daily Exercise Duration</CardTitle>
                <CardDescription>Minutes of exercise per day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={chartData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis 
                          label={{ 
                            value: 'Minutes', 
                            angle: -90, 
                            position: 'insideLeft',
                            style: { textAnchor: 'middle', fontSize: 12 }
                          }}
                        />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="minutes"
                          name="Exercise Duration"
                          stroke="#8884d8"
                          activeDot={{ r: 8 }}
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex justify-center items-center h-full">
                      <p className="text-muted-foreground">Not enough data to show trends</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Exercise by Type</CardTitle>
                <CardDescription>Distribution of exercise activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {typeData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={typeData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} horizontal={true} vertical={false} />
                        <XAxis type="number" />
                        <YAxis 
                          dataKey="name" 
                          type="category" 
                          tick={{ fontSize: 12 }}
                          width={100}
                        />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="minutes"
                          name="Minutes"
                          fill="#82ca9d"
                          radius={[0, 4, 4, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex justify-center items-center h-full">
                      <p className="text-muted-foreground">Not enough data to show distribution</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExerciseHistory;
