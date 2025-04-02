
import React from 'react';
import { VaccinationRecord } from '@/types/puppyTracking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, FileText, Trash } from 'lucide-react';

interface VaccinationRecordsProps {
  records: VaccinationRecord[];
  onDelete?: (id: string) => Promise<void>;
}

const VaccinationRecords: React.FC<VaccinationRecordsProps> = ({
  records,
  onDelete
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
        <h2 className="text-lg font-semibold">Vaccination History</h2>
      </div>

      {records.length === 0 ? (
        <Card>
          <CardContent className="py-6">
            <div className="text-center text-gray-500">
              <p>No vaccination records found.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {records.map((record) => (
            <Card key={record.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{record.vaccination_type}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      {formatDate(record.vaccination_date)}
                    </div>
                    {record.notes && (
                      <p className="text-sm text-gray-600 mt-2">{record.notes}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {record.lot_number && (
                      <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        Lot# {record.lot_number}
                      </div>
                    )}
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4" />
                    </Button>
                    {onDelete && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => onDelete(record.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
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

export default VaccinationRecords;
