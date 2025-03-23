
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { FollowUpItem } from '../types/followUp';
import { format, isBefore } from 'date-fns';
import { Check, Mail } from 'lucide-react';
import FollowUpStatusIcon from './FollowUpStatusIcon';

interface FollowUpTableProps {
  followUps: FollowUpItem[];
  onSendEmail: (item: FollowUpItem) => void;
  onMarkCompleted: (item: FollowUpItem) => void;
  showOnlyPending?: boolean;
  customTableBody?: React.ReactNode;
}

export const FollowUpTable: React.FC<FollowUpTableProps> = ({ 
  followUps, 
  onSendEmail, 
  onMarkCompleted, 
  showOnlyPending = false,
  customTableBody = null
}) => {
  const filteredItems = showOnlyPending 
    ? followUps.filter(item => item.status === 'pending')
    : followUps;

  const isOverdue = (dueDate: string) => {
    return isBefore(new Date(dueDate), new Date());
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Due Date</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Notes</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customTableBody ? (
          customTableBody
        ) : filteredItems.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
              No follow-ups to display
            </TableCell>
          </TableRow>
        ) : (
          filteredItems.map((item) => (
            <TableRow key={item.id} className={isOverdue(item.due_date) && item.status === 'pending' ? 'bg-red-50 dark:bg-red-950/10' : ''}>
              <TableCell className={isOverdue(item.due_date) && item.status === 'pending' ? 'text-red-600 dark:text-red-400 font-medium' : ''}>
                {format(new Date(item.due_date), 'MMM d, yyyy')}
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <FollowUpStatusIcon status={item.status} />
                  <span className="ml-2">{item.customer.first_name} {item.customer.last_name}</span>
                </div>
              </TableCell>
              <TableCell className="max-w-[300px] truncate">{item.notes}</TableCell>
              <TableCell>
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium
                  ${item.status === 'pending' 
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200' 
                    : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                  }`}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSendEmail(item)}
                >
                  <Mail className="h-4 w-4" />
                </Button>
                {item.status === 'pending' && (
                  <Button
                    variant="ghost" 
                    size="sm"
                    onClick={() => onMarkCompleted(item)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
