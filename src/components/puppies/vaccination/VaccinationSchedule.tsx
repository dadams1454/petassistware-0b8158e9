
import React from 'react';
import { VaccinationScheduleItem } from '@/types/puppyTracking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Check, AlertTriangle } from 'lucide-react';

export interface VaccinationScheduleProps {
  vaccinations: VaccinationScheduleItem[];
  onRefresh: () => Promise<void>;
  status: string;
}

const VaccinationSchedule: React.FC<VaccinationScheduleProps> = ({
  vaccinations,
  onRefresh,
  status
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          {status === 'upcoming' ? 'Upcoming Vaccinations' : 
           status === 'overdue' ? 'Overdue Vaccinations' : 
           'Completed Vaccinations'}
        </h2>
        <Button size="sm" variant="outline" onClick={onRefresh}>
          Refresh
        </Button>
      </div>

      {vaccinations.length === 0 ? (
        <Card>
          <CardContent className="py-6">
            <div className="text-center text-gray-500">
              <p>No {status} vaccinations found.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {vaccinations.map((vaccination) => (
            <Card key={vaccination.id} className="overflow-hidden">
              <div className={`h-1 ${
                status === 'overdue' ? 'bg-red-500' : 
                status === 'upcoming' ? 'bg-amber-500' : 
                'bg-green-500'
              }`}></div>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{vaccination.vaccination_type}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      {formatDate(vaccination.due_date)}
                    </div>
                  </div>
                  <div>
                    {status === 'completed' ? (
                      <span className="inline-flex items-center text-sm bg-green-50 text-green-700 px-2 py-1 rounded">
                        <Check className="h-3.5 w-3.5 mr-1" />
                        Complete
                      </span>
                    ) : status === 'overdue' ? (
                      <span className="inline-flex items-center text-sm bg-red-50 text-red-700 px-2 py-1 rounded">
                        <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                        Overdue
                      </span>
                    ) : (
                      <Button size="sm">Mark Complete</Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default VaccinationSchedule;
