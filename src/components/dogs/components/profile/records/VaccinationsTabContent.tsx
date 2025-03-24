
import React from 'react';
import { format } from 'date-fns';
import { PlusCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import HealthRecordCard from './HealthRecordCard';
import { HealthRecord } from '@/types/health';

interface VaccinationsTabContentProps {
  vaccinations: any[];
  latestVaccinations: any[];
  isLoading: boolean;
  onAddRecord: () => void;
  onEditRecord: (record: HealthRecord) => void;
}

const VaccinationsTabContent: React.FC<VaccinationsTabContentProps> = ({
  vaccinations,
  latestVaccinations,
  isLoading,
  onAddRecord,
  onEditRecord
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (vaccinations.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-6">
            <p className="text-muted-foreground">No vaccination records found</p>
            <Button variant="outline" className="mt-2" onClick={onAddRecord}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Vaccination
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
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
  );
};

export default VaccinationsTabContent;
