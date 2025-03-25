
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';

export const EmptyUserTableState: React.FC = () => {
  return (
    <TableRow>
      <TableCell colSpan={5} className="h-24 text-center">
        No users found.
      </TableCell>
    </TableRow>
  );
};
