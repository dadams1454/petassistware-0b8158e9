
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

export interface AuditLog {
  id: string;
  timestamp: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  previous_state?: Record<string, any>;
  new_state?: Record<string, any>;
  notes?: string;
}

export interface AuditLogTableProps {
  logs: AuditLog[];
  isLoading: boolean;
  page: number;
  setPage: (page: number) => void;
  onViewDetails: (log: AuditLog) => void;
}

export const AuditLogTable: React.FC<AuditLogTableProps> = ({
  logs = [],
  isLoading = false,
  page = 1,
  setPage = () => {},
  onViewDetails = () => {}
}) => {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Entity Type</TableHead>
              <TableHead>Entity ID</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  Loading audit logs...
                </TableCell>
              </TableRow>
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  No audit logs found
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    {format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss')}
                  </TableCell>
                  <TableCell>
                    <span className={
                      log.action === 'INSERT' ? 'text-green-500' :
                      log.action === 'UPDATE' ? 'text-amber-500' :
                      log.action === 'DELETE' ? 'text-red-500' : ''
                    }>
                      {log.action}
                    </span>
                  </TableCell>
                  <TableCell>{log.entity_type}</TableCell>
                  <TableCell>{log.entity_id.substring(0, 8)}...</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onViewDetails(log)}
                    >
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        {/* Pagination controls */}
        <div className="flex justify-between items-center p-4 border-t">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1 || isLoading}
          >
            Previous
          </Button>
          
          <span className="text-muted-foreground">
            Page {page}
          </span>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={logs.length === 0 || isLoading}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
