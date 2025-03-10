
import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { renderGenderIcon } from '../litters/puppies/utils/puppyUtils';
import { WaitlistEntry } from './types';

interface WaitlistTableProps {
  entries: WaitlistEntry[];
  onUpdateStatus: (entry: WaitlistEntry, newStatus: WaitlistEntry['status']) => void;
  onUpdatePosition: (entry: WaitlistEntry, direction: 'up' | 'down') => void;
  onEditEntry: (entry: WaitlistEntry) => void;
  showPositionControls?: boolean;
}

const WaitlistTable: React.FC<WaitlistTableProps> = ({
  entries,
  onUpdateStatus,
  onUpdatePosition,
  onEditEntry,
  showPositionControls = true
}) => {
  if (entries.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No entries in this category
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">#</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Preferences</TableHead>
          <TableHead>Requested</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {entries.map((entry, index) => (
          <TableRow key={entry.id}>
            <TableCell className="font-medium">
              <div className="flex items-center gap-1">
                {entry.position || index + 1}
                {showPositionControls && (
                  <div className="flex flex-col gap-1 ml-1">
                    <Button
                      variant="ghost" 
                      size="icon" 
                      className="h-5 w-5"
                      onClick={() => onUpdatePosition(entry, 'up')}
                      disabled={index === 0}
                    >
                      ▲
                    </Button>
                    <Button
                      variant="ghost" 
                      size="icon" 
                      className="h-5 w-5"
                      onClick={() => onUpdatePosition(entry, 'down')}
                      disabled={index === entries.length - 1}
                    >
                      ▼
                    </Button>
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell>
              <div className="font-medium">
                {entry.customers?.first_name} {entry.customers?.last_name}
              </div>
              <div className="text-sm text-muted-foreground">
                {entry.customers?.email || "No email"} | {entry.customers?.phone || "No phone"}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-col gap-1">
                {entry.preferences?.gender_preference && (
                  <div className="flex items-center text-sm">
                    {renderGenderIcon(entry.preferences.gender_preference)}
                    Prefers {entry.preferences.gender_preference}
                  </div>
                )}
                {entry.preferences?.color_preference && (
                  <div className="text-sm">
                    Color: {entry.preferences.color_preference}
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell>
              {format(new Date(entry.requested_at), 'MMM d, yyyy')}
            </TableCell>
            <TableCell>
              <div className="flex items-center">
                <span className={`
                  inline-flex h-2 w-2 rounded-full mr-2
                  ${entry.status === 'pending' ? 'bg-yellow-500' : ''}
                  ${entry.status === 'contacted' ? 'bg-blue-500' : ''}
                  ${entry.status === 'approved' ? 'bg-green-500' : ''}
                  ${entry.status === 'declined' ? 'bg-red-500' : ''}
                `}></span>
                <span className="capitalize">{entry.status}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                {entry.status === 'pending' && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onUpdateStatus(entry, 'contacted')}
                  >
                    Contact
                  </Button>
                )}
                
                {(entry.status === 'pending' || entry.status === 'contacted') && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onUpdateStatus(entry, 'approved')}
                  >
                    Approve
                  </Button>
                )}
                
                {entry.status === 'contacted' && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onUpdateStatus(entry, 'declined')}
                  >
                    Decline
                  </Button>
                )}
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onEditEntry(entry)}
                >
                  Edit
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default WaitlistTable;
