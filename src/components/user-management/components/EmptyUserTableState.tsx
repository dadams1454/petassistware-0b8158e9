
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { UsersIcon } from 'lucide-react';

export const EmptyUserTableState: React.FC = () => {
  return (
    <TableRow>
      <TableCell colSpan={5} className="h-24 text-center">
        <div className="flex flex-col items-center justify-center text-muted-foreground">
          <UsersIcon className="h-10 w-10 mb-2" />
          <p>No users found</p>
          <p className="text-sm">Invite users to get started</p>
        </div>
      </TableCell>
    </TableRow>
  );
};
