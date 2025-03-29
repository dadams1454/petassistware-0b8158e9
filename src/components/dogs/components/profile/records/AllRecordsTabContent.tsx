
import React from 'react';
import { format } from 'date-fns';
import { PlusCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HealthRecord, HealthRecordTypeEnum } from '@/types/health';
import { getHealthRecordIcon, getHealthRecordColor } from '../utils/healthRecordUtils';

interface AllRecordsTabContentProps {
  records: HealthRecord[] | null;
  onAddRecord: () => void;
  onEditRecord: (record: HealthRecord) => void;
}

const AllRecordsTabContent: React.FC<AllRecordsTabContentProps> = ({
  records,
  onAddRecord,
  onEditRecord
}) => {
  if (!records || records.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-6">
            <p className="text-muted-foreground">No health records found</p>
            <Button variant="outline" className="mt-2" onClick={onAddRecord}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Health Record
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
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
          {records.map((record) => (
            <tr key={record.id} onClick={() => onEditRecord(record)} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
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
  );
};

export default AllRecordsTabContent;
