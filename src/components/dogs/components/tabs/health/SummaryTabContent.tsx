
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { useHealthTabContext } from './HealthTabContext';
import { HealthRecordTypeEnum } from '@/types/health';

const SummaryTabContent: React.FC = () => {
  const { 
    getRecordsByType, 
    handleEditRecord,
    weightHistory,
    growthStats 
  } = useHealthTabContext();
  
  // Get recent records
  const vaccinations = getRecordsByType(HealthRecordTypeEnum.Vaccination);
  const examinations = getRecordsByType(HealthRecordTypeEnum.Examination);
  const medications = getRecordsByType(HealthRecordTypeEnum.Medication);
  
  // Sort by date (newest first) and take the 3 most recent
  const sortByDate = (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime();
  
  const recentVaccinations = [...vaccinations].sort(sortByDate).slice(0, 3);
  const recentExaminations = [...examinations].sort(sortByDate).slice(0, 3);
  const recentMedications = [...medications].sort(sortByDate).slice(0, 3);
  
  // Get the latest weight
  const latestWeight = weightHistory && weightHistory.length > 0
    ? [...weightHistory].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
    : null;
  
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Latest Weight */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Current Weight</CardTitle>
        </CardHeader>
        <CardContent>
          {latestWeight ? (
            <div>
              <div className="text-2xl font-bold">
                {latestWeight.weight} {latestWeight.unit || latestWeight.weight_unit}
              </div>
              <div className="text-sm text-muted-foreground">
                Recorded on {format(new Date(latestWeight.date), 'MMMM d, yyyy')}
              </div>
              
              {growthStats && (
                <div className="mt-2 pt-2 border-t text-sm">
                  <div className="flex justify-between">
                    <span>Growth rate:</span>
                    <span>{growthStats.growthPerDay.toFixed(2)} {latestWeight.unit || latestWeight.weight_unit}/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total gain:</span>
                    <span>{growthStats.totalGain.toFixed(2)} {latestWeight.unit || latestWeight.weight_unit}</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-muted-foreground text-sm">No weight records available</div>
          )}
        </CardContent>
      </Card>
      
      {/* Recent Examinations */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Recent Examinations</CardTitle>
        </CardHeader>
        <CardContent>
          {recentExaminations.length > 0 ? (
            <ul className="space-y-2">
              {recentExaminations.map(exam => (
                <li 
                  key={exam.id} 
                  className="flex justify-between items-start border-b last:border-0 pb-2 last:pb-0"
                  onClick={() => handleEditRecord(exam.id)}
                >
                  <div className="cursor-pointer hover:underline">
                    <div className="font-medium">{exam.title}</div>
                    <div className="text-sm text-muted-foreground line-clamp-1">{exam.description || 'No details'}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(exam.date), 'MMM d, yyyy')}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-muted-foreground text-sm">No examination records available</div>
          )}
        </CardContent>
      </Card>
      
      {/* Recent Vaccinations */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Recent Vaccinations</CardTitle>
        </CardHeader>
        <CardContent>
          {recentVaccinations.length > 0 ? (
            <ul className="space-y-2">
              {recentVaccinations.map(vax => (
                <li 
                  key={vax.id} 
                  className="flex justify-between items-start border-b last:border-0 pb-2 last:pb-0"
                  onClick={() => handleEditRecord(vax.id)}
                >
                  <div className="cursor-pointer hover:underline">
                    <div className="font-medium">{vax.title}</div>
                    {vax.next_due_date && (
                      <div className="text-sm text-muted-foreground">
                        Next due: {format(new Date(vax.next_due_date), 'MMM d, yyyy')}
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(vax.date), 'MMM d, yyyy')}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-muted-foreground text-sm">No vaccination records available</div>
          )}
        </CardContent>
      </Card>
      
      {/* Recent Medications */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Recent Medications</CardTitle>
        </CardHeader>
        <CardContent>
          {recentMedications.length > 0 ? (
            <ul className="space-y-2">
              {recentMedications.map(med => (
                <li 
                  key={med.id} 
                  className="flex justify-between items-start border-b last:border-0 pb-2 last:pb-0"
                  onClick={() => handleEditRecord(med.id)}
                >
                  <div className="cursor-pointer hover:underline">
                    <div className="font-medium">{med.title}</div>
                    <div className="text-sm text-muted-foreground line-clamp-1">{med.description || 'No details'}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(med.date), 'MMM d, yyyy')}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-muted-foreground text-sm">No medication records available</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryTabContent;
