
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';

const EmptyTableRow: React.FC = () => {
  return (
    <TableRow>
      <TableCell colSpan={6} className="text-center py-8">
        <p className="text-gray-500">No dogs found</p>
        <p className="text-xs text-gray-400 mt-2">Check your Supabase connection and ensure dogs are added to the system</p>
      </TableCell>
    </TableRow>
  );
};

export default EmptyTableRow;
