
import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MailIcon, CheckCircle } from 'lucide-react';
import { FollowUpItem } from '../types/followUp';
import { FollowUpStatusIcon } from './FollowUpStatusIcon';

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
  showOnlyPending = false
}) => {
  const displayedFollowUps = showOnlyPending 
    ? followUps.filter(item => item.status === 'pending')
    : followUps;

  if (!displayedFollowUps.length) {
    return (
      <TableRow>
        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
          No follow-ups to display
        </TableCell>
      </TableRow>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Status</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Notes</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {displayedFollowUps.map(item => (
          <TableRow key={item.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                <FollowUpStatusIcon status={item.status} />
                <span className="capitalize">{item.status}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="font-medium">
                {item.customer.first_name} {item.customer.last_name}
              </div>
              <div className="text-sm text-muted-foreground">
                {item.customer.email}
              </div>
            </TableCell>
            <TableCell className="capitalize">{item.type}</TableCell>
            <TableCell>{format(new Date(item.due_date), 'MMM d, yyyy')}</TableCell>
            <TableCell className="max-w-[200px] truncate">{item.notes}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onSendEmail(item)}
                >
                  <MailIcon className="h-4 w-4 mr-1" />
                  Email
                </Button>
                {item.status !== 'completed' && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onMarkCompleted(item)}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Complete
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

