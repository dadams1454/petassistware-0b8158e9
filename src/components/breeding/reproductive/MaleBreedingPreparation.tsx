
import React from 'react';
import { format } from 'date-fns';
import { Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dog } from '@/types/dog';
import { BreedingRecord } from '@/types/reproductive';

interface MaleBreedingPreparationProps {
  dog: Dog;
  breedingData?: {
    breedingRecords?: BreedingRecord[];
    recentSuccessfulBreedings?: number;
    totalBreedings?: number;
    successRate?: number;
    lastBreedingDate?: string;
    isReadyForBreeding?: boolean;
  };
}

const MaleBreedingPreparation: React.FC<MaleBreedingPreparationProps> = ({ dog, breedingData }) => {
  const totalBreedings = breedingData?.totalBreedings || breedingData?.breedingRecords?.length || 0;
  const successfulBreedings = breedingData?.recentSuccessfulBreedings || 
    breedingData?.breedingRecords?.filter(r => r.success).length || 0;
  const successRate = breedingData?.successRate || 
    (totalBreedings > 0 ? Math.round((successfulBreedings / totalBreedings) * 100) : 0);
  const lastBreedingDate = breedingData?.lastBreedingDate || 
    (breedingData?.breedingRecords?.[0]?.breeding_date || null);
  const isReadyForBreeding = breedingData?.isReadyForBreeding !== false;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-500" />
          Breeding Preparation
          {isReadyForBreeding && <Badge className="ml-2 bg-green-500">Ready for Breeding</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Breeding preparation details for {dog.name}.
        </p>
        
        <div className="space-y-4">
          {isReadyForBreeding && (
            <div className="flex items-start space-x-2 p-3 bg-green-50 rounded-md border border-green-200">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <p className="text-sm text-green-800">
                {dog.name} is ready for breeding. All health clearances and requirements are met.
              </p>
            </div>
          )}
          
          {!isReadyForBreeding && (
            <div className="flex items-start space-x-2 p-3 bg-amber-50 rounded-md border border-amber-200">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
              <p className="text-sm text-amber-800">
                {dog.name} may need additional health checks or testing before breeding.
              </p>
            </div>
          )}
          
          <div>
            <h3 className="font-medium">Breeding History</h3>
            <div className="ml-6 mt-2 grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-3 rounded-md text-center">
                <p className="text-2xl font-semibold">{totalBreedings}</p>
                <p className="text-xs text-gray-500">Total Breedings</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-md text-center">
                <p className="text-2xl font-semibold">{successfulBreedings}</p>
                <p className="text-xs text-gray-500">Successful</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-md text-center">
                <p className="text-2xl font-semibold">{successRate}%</p>
                <p className="text-xs text-gray-500">Success Rate</p>
              </div>
            </div>
          </div>
          
          {lastBreedingDate && (
            <div>
              <h3 className="font-medium">Last Breeding</h3>
              <p className="text-sm ml-6 mt-1">
                {format(new Date(lastBreedingDate), 'MMMM d, yyyy')}
              </p>
            </div>
          )}
          
          {breedingData?.breedingRecords && breedingData.breedingRecords.length > 0 && (
            <div>
              <h3 className="font-medium">Recent Breeding Records</h3>
              <ul className="ml-6 mt-1 space-y-2">
                {breedingData.breedingRecords.slice(0, 3).map(record => (
                  <li key={record.id} className="text-sm">
                    {format(new Date(record.breeding_date), 'MMM d, yyyy')} - 
                    Bred with {record.dam?.name || 'Unknown dam'}
                    {record.success && ' (Successful)'}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {(!breedingData?.breedingRecords || breedingData.breedingRecords.length === 0) && (
            <div>
              <h3 className="font-medium">Recent Breeding Records</h3>
              <p className="text-sm text-gray-500 ml-6 mt-1">No recent breeding records found.</p>
            </div>
          )}
          
          <div>
            <h3 className="font-medium">Health Certifications</h3>
            <p className="text-sm ml-6 mt-1">
              {dog.pedigree ? 'Pedigree verified ✓' : 'Pedigree not verified'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MaleBreedingPreparation;
