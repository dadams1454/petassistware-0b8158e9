
import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { FollowUpItem } from '../types/followUp';
import { Mail, Check, MoreHorizontal } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface FollowUpTableProps {
  followUps: FollowUpItem[];
  onSendEmail: (item: FollowUpItem) => void;
  onMarkCompleted: (item: FollowUpItem) => void;
  showOnlyPending?: boolean;
}

export const FollowUpTable: React.FC<FollowUpTableProps> = ({
  followUps,
  onSendEmail,
  onMarkCompleted,
  showOnlyPending = false,
}) => {
  const filteredFollowUps = showOnlyPending
    ? followUps.filter(item => item.status === 'pending')
    : followUps;

  if (filteredFollowUps.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No follow-ups to display
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Notes</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredFollowUps.map((item) => (
          <TableRow key={item.id}>
            <TableCell>
              <div className="font-medium">
                {item.customer.first_name} {item.customer.last_name}
              </div>
              <div className="text-xs text-muted-foreground">
                {item.customer.email || 'No email provided'}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline" className="capitalize">
                {item.type}
              </Badge>
            </TableCell>
            <TableCell>
              {item.due_date ? format(new Date(item.due_date), 'MMM d, yyyy') : 'No date set'}
            </TableCell>
            <TableCell>
              <Badge
                className={
                  item.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : item.status === 'cancelled'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }
              >
                {item.status}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="max-w-[200px] truncate">{item.notes}</div>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSendEmail(item)}
                  disabled={item.status === 'completed'}
                >
                  <Mail className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onMarkCompleted(item)}
                  disabled={item.status === 'completed'}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onSendEmail(item)}>
                      Send Email
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onMarkCompleted(item)}>
                      Mark as Completed
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
