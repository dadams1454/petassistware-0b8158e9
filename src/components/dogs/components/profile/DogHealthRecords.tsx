
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { PlusCircle, Pill, Stethoscope, Syringe, AlertCircle, Activity, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { HealthRecord, HealthRecordType } from '@/types/dog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useDogHealthVaccinations } from '../../hooks/useDogHealthVaccinations';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DogHealthRecordsProps {
  dogId: string;
}

const DogHealthRecords: React.FC<DogHealthRecordsProps> = ({ dogId }) => {
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { vaccinations, latestVaccinations, isLoading: isLoadingVaccinations } = useDogHealthVaccinations(dogId);
  
  useEffect(() => {
    const fetchHealthRecords = async () => {
      if (!dogId) return;
      
      setIsLoading(true);
      try {
        // This is a placeholder. In a real application, you would fetch from the health_records table
        // For now, we'll create some sample data based on the existing vaccinations
        const records: HealthRecord[] = vaccinations.map(vax => ({
          id: vax.id,
          dog_id: dogId,
          date: vax.date.toISOString(),
          record_type: 'vaccination',
          title: `${vax.type} Vaccination`,
          description: vax.notes || `${vax.type} vaccination administered`,
          performed_by: 'Dr. Smith',
          created_at: vax.date.toISOString(),
        }));
        
        setHealthRecords(records);
      } catch (error) {
        console.error('Error fetching health records:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHealthRecords();
  }, [dogId, vaccinations]);
  
  const getHealthRecordIcon = (recordType: HealthRecordType) => {
    switch (recordType) {
      case 'vaccination':
        return <Syringe className="h-5 w-5" />;
      case 'examination':
        return <Stethoscope className="h-5 w-5" />;
      case 'medication':
        return <Pill className="h-5 w-5" />;
      case 'surgery':
        return <Activity className="h-5 w-5" />;
      case 'observation':
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };
  
  const getHealthRecordColor = (recordType: HealthRecordType) => {
    switch (recordType) {
      case 'vaccination':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'examination':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'medication':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'surgery':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'observation':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  if (isLoading && isLoadingVaccinations) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Health Records</h2>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Health Record
        </Button>
      </div>
      
      <Tabs defaultValue="vaccinations">
        <TabsList>
          <TabsTrigger value="vaccinations">Vaccinations</TabsTrigger>
          <TabsTrigger value="all-records">All Records</TabsTrigger>
        </TabsList>
        
        <TabsContent value="vaccinations" className="space-y-4 pt-4">
          {vaccinations.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No vaccination records found</p>
                  <Button variant="outline" className="mt-2">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Vaccination
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {latestVaccinations.map((vax) => (
                  <Card key={vax.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">{vax.type}</CardTitle>
                        <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300">
                          Current
                        </Badge>
                      </div>
                      <CardDescription>
                        Last vaccination: {format(vax.date, 'MMM d, yyyy')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      {vax.notes && <p className="text-sm text-muted-foreground">{vax.notes}</p>}
                    </CardContent>
                    <CardFooter className="pt-2 flex justify-between">
                      <Button variant="ghost" size="sm">View History</Button>
                      <Button size="sm">Update</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Vaccination History</h3>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Notes
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {vaccinations.map((vax) => (
                        <tr key={vax.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {vax.type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {format(vax.date, 'MMM d, yyyy')}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {vax.notes || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="all-records" className="space-y-4 pt-4">
          {healthRecords.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No health records found</p>
                  <Button variant="outline" className="mt-2">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Health Record
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {healthRecords.map((record) => (
                    <tr key={record.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`p-1.5 rounded-full mr-2 ${getHealthRecordColor(record.record_type)}`}>
                            {getHealthRecordIcon(record.record_type)}
                          </div>
                          <span className="text-sm font-medium capitalize">
                            {record.record_type}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {format(new Date(record.date), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {record.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {record.description || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DogHealthRecords;
