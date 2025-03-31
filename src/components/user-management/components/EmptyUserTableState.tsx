
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

export function EmptyUserTableState() {
  return (
    <TableRow>
      <TableCell colSpan={5} className="h-[200px] text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="rounded-full bg-muted p-3">
            <UserPlus className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-medium">No users yet</h3>
            <p className="text-sm text-muted-foreground">
              Start by creating your first user to test different roles
            </p>
          </div>
          <div className="py-2">
            <p className="text-sm text-muted-foreground">
              You'll need to create users with different roles to test out your permissions system.
            </p>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}
