
import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { WeightRecord } from '@/types/health';
import { WeightUnit } from '@/types/common';
import { convertWeight } from './weightUnits';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface WeightTableViewProps {
  puppyId: string;
  displayUnit?: WeightUnit;
  weightRecords?: WeightRecord[];
  onDelete?: (id: string) => void;
}

const WeightTableView: React.FC<WeightTableViewProps> = ({
  puppyId,
  displayUnit = 'oz',
  weightRecords = [],
  onDelete
}) => {
  if (weightRecords.length === 0) {
    return (
      <Alert variant="default" className="bg-muted/40">
        <AlertCircle className="h-4 w-4 mr-2" />
        <AlertDescription>No weight records found for this puppy.</AlertDescription>
      </Alert>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-full divide-y divide-gray-200">
        <thead className="bg-muted/40">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age (days)</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight ({displayUnit})</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
            {onDelete && <th className="px-4 py-2 w-10"></th>}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {[...weightRecords]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((record) => {
              // Convert weight to display unit
              const convertedWeight = convertWeight(
                record.weight, 
                record.weight_unit, 
                displayUnit
              );

              return (
                <tr key={record.id} className="hover:bg-muted/30">
                  <td className="px-4 py-2 whitespace-nowrap">{formatDate(record.date)}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{record.age_days || '-'}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{convertedWeight.toFixed(2)}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {record.percent_change !== undefined ? (
                      <span className={
                        record.percent_change > 0 
                          ? 'text-green-600' 
                          : record.percent_change < 0 
                            ? 'text-red-600' 
                            : 'text-gray-500'
                      }>
                        {record.percent_change > 0 ? '+' : ''}
                        {record.percent_change.toFixed(1)}%
                      </span>
                    ) : '-'}
                  </td>
                  <td className="px-4 py-2">{record.notes || '-'}</td>
                  {onDelete && (
                    <td className="px-4 py-2 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(record.id)}
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  )}
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default WeightTableView;
