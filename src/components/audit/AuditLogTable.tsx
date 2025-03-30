
import React from 'react';
import { formatDistance, format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AuditLogEntry } from '@/hooks/useAuditLogs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AuditLogTableProps {
  logs: AuditLogEntry[];
  isLoading: boolean;
  page: number;
  setPage: (page: number) => void;
  onViewDetails: (log: AuditLogEntry) => void;
}

export function AuditLogTable({ logs, isLoading, page, setPage, onViewDetails }: AuditLogTableProps) {
  const getActionColor = (action: string) => {
    switch (action) {
      case 'INSERT':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'UPDATE':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'DELETE':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (isLoading) {
    return <div className="py-10 text-center">Loading audit logs...</div>;
  }

  if (logs.length === 0) {
    return <div className="py-10 text-center">No audit logs found.</div>;
  }

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Entity Type</TableHead>
              <TableHead>Details</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-medium">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          {formatDistance(new Date(log.timestamp), new Date(), { addSuffix: true })}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        {format(new Date(log.timestamp), 'PPpp')}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>{log.user_name || 'Unknown'}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`${getActionColor(log.action)} font-semibold`}
                  >
                    {log.action}
                  </Badge>
                </TableCell>
                <TableCell className="capitalize">
                  {log.entity_type.replace(/_/g, ' ')}
                </TableCell>
                <TableCell>
                  {log.formatted_message ? (
                    <span className="text-sm text-gray-600">{log.formatted_message}</span>
                  ) : (
                    <span className="text-sm text-gray-500">
                      {log.action === 'INSERT'
                        ? 'Created new record'
                        : log.action === 'UPDATE'
                        ? 'Updated record'
                        : 'Deleted record'}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(log)}
                  >
                    <Info className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(page > 1 ? page - 1 : 1)}
          disabled={page <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(page + 1)}
          disabled={logs.length === 0}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
