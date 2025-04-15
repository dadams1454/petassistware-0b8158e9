
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Check, X, AlertTriangle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Mock medications data
const mockMedications = [
  {
    id: '1',
    name: 'Heartworm Prevention',
    dog: 'Luna',
    dogId: 'dog1',
    nextDue: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    frequency: 'Monthly',
    status: 'upcoming'
  },
  {
    id: '2',
    name: 'Flea & Tick Treatment',
    dog: 'Bear',
    dogId: 'dog2',
    nextDue: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    frequency: 'Monthly',
    status: 'overdue'
  },
  {
    id: '3',
    name: 'Joint Supplement',
    dog: 'Max',
    dogId: 'dog3',
    nextDue: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    frequency: 'Daily',
    status: 'upcoming'
  },
  {
    id: '4',
    name: 'Antibiotic',
    dog: 'Daisy',
    dogId: 'dog4',
    nextDue: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    frequency: 'Twice Daily',
    status: 'overdue'
  }
];

export interface MedicationTrackerProps {
  filter?: string;
  medications?: any[]; // Using any for simplicity, would normally be typed
}

const MedicationTracker: React.FC<MedicationTrackerProps> = ({ 
  filter = 'all',
  medications = mockMedications 
}) => {
  // Filter medications based on the filter prop
  const filteredMedications = React.useMemo(() => {
    if (filter === 'all') return medications;
    return medications.filter(med => med.status === filter);
  }, [medications, filter]);

  // Format date to display in a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Upcoming</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Overdue</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'overdue':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'completed':
        return <Check className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Medications {filter !== 'all' && `(${filter})`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {filteredMedications.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No {filter} medications found.
          </div>
        ) : (
          <div className="divide-y">
            {filteredMedications.map((med) => (
              <div key={med.id} className="py-3 flex justify-between items-center">
                <div className="flex items-start space-x-3">
                  {getStatusIcon(med.status)}
                  <div>
                    <h4 className="font-medium">{med.name}</h4>
                    <div className="text-sm text-muted-foreground">
                      {med.dog} • {med.frequency}
                    </div>
                    <div className="text-sm mt-1">
                      {med.status === 'overdue' ? (
                        <span className="text-red-600">
                          Due: {formatDate(med.nextDue)}
                        </span>
                      ) : (
                        <span>
                          Due: {formatDate(med.nextDue)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(med.status)}
                  <Button size="sm" variant="outline">
                    {med.status === 'completed' ? 'View' : 'Log'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MedicationTracker;
