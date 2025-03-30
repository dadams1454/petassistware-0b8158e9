
import React from 'react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { AuditLogEntry } from '@/hooks/useAuditLogs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface AuditLogDetailsProps {
  log: AuditLogEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuditLogDetails({ log, open, onOpenChange }: AuditLogDetailsProps) {
  if (!log) return null;

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

  // Function to find and highlight differences between old and new state
  const renderDiff = (oldState: any, newState: any) => {
    if (!oldState || !newState) return null;

    const allKeys = new Set([
      ...Object.keys(oldState || {}),
      ...Object.keys(newState || {}),
    ]);

    // Sort keys alphabetically for consistent display
    const sortedKeys = Array.from(allKeys).sort();

    return sortedKeys.map((key) => {
      const oldValue = oldState[key];
      const newValue = newState[key];
      const hasChanged = JSON.stringify(oldValue) !== JSON.stringify(newValue);

      return (
        <div 
          key={key}
          className={`py-1 border-b ${hasChanged ? 'bg-yellow-50' : ''}`}
        >
          <div className="font-medium">{key}</div>
          <div className="grid grid-cols-2 gap-4">
            <div className={hasChanged ? 'text-red-600 line-through' : ''}>
              {oldValue === null || oldValue === undefined
                ? <span className="text-gray-400">null</span>
                : typeof oldValue === 'object'
                  ? JSON.stringify(oldValue)
                  : String(oldValue)}
            </div>
            <div className={hasChanged ? 'text-green-600' : ''}>
              {newValue === null || newValue === undefined
                ? <span className="text-gray-400">null</span>
                : typeof newValue === 'object'
                  ? JSON.stringify(newValue)
                  : String(newValue)}
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`${getActionColor(log.action)} font-semibold`}
            >
              {log.action}
            </Badge>
            <span className="capitalize">{log.entity_type.replace(/_/g, ' ')}</span>
            <span className="text-gray-400">({log.entity_id})</span>
          </DialogTitle>
          <DialogDescription>
            <div className="flex items-center justify-between">
              <span>
                By <strong>{log.user_name}</strong> on{' '}
                {format(new Date(log.timestamp), 'PPpp')}
              </span>
            </div>
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="changes" className="flex-1 overflow-hidden">
          <TabsList>
            <TabsTrigger value="changes">Changes</TabsTrigger>
            <TabsTrigger value="raw">Raw Data</TabsTrigger>
          </TabsList>
          
          <TabsContent value="changes" className="flex-1 overflow-hidden">
            <ScrollArea className="h-[400px] rounded-md border p-4">
              {log.action === 'UPDATE' ? (
                <>
                  <div className="grid grid-cols-2 gap-4 pb-2 font-semibold border-b mb-2">
                    <div>Previous Value</div>
                    <div>New Value</div>
                  </div>
                  {renderDiff(log.previous_state, log.new_state)}
                </>
              ) : log.action === 'INSERT' ? (
                <div className="space-y-2">
                  <div className="font-semibold pb-2 border-b">New Record</div>
                  <pre className="text-sm bg-gray-50 p-2 rounded">
                    {JSON.stringify(log.new_state, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="font-semibold pb-2 border-b">Deleted Record</div>
                  <pre className="text-sm bg-gray-50 p-2 rounded">
                    {JSON.stringify(log.previous_state, null, 2)}
                  </pre>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="raw" className="flex-1 overflow-hidden">
            <ScrollArea className="h-[400px] rounded-md border p-4">
              <pre className="text-sm">{JSON.stringify(log, null, 2)}</pre>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
