
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Users2 } from 'lucide-react';

export const EmptyUserTableState: React.FC = () => {
  return (
    <TableRow>
      <TableCell colSpan={5} className="h-48 text-center">
        <div className="flex flex-col items-center justify-center h-full">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Users2 className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No users found</h3>
          <p className="text-sm text-muted-foreground max-w-md mt-2">
            There are no users in the system yet. Use the invite button to add your first user.
          </p>
        </div>
      </TableCell>
    </TableRow>
  );
};
