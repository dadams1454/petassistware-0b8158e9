
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Mail, MessageSquare } from 'lucide-react';

interface ViewCommunicationDialogProps {
  communication: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ViewCommunicationDialog: React.FC<ViewCommunicationDialogProps> = ({
  communication,
  open,
  onOpenChange
}) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {communication.type === 'email' ? (
              <>
                <Mail className="h-5 w-5" />
                Email
              </>
            ) : (
              <>
                <MessageSquare className="h-5 w-5" />
                SMS
              </>
            )}
            <Badge 
              variant={communication.status === 'sent' ? 'default' : 
                    communication.status === 'failed' ? 'destructive' : 'outline'}
              className="ml-2"
            >
              {communication.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-semibold text-muted-foreground">Sent</div>
              <div>{formatDate(communication.sent_at)}</div>
            </div>
            <div>
              <div className="font-semibold text-muted-foreground">Recipient</div>
              <div>
                {communication.customers ? (
                  <>
                    <div>{communication.customers.first_name} {communication.customers.last_name}</div>
                    {communication.customers.email && (
                      <div className="text-xs text-muted-foreground">{communication.customers.email}</div>
                    )}
                  </>
                ) : (
                  'Unknown recipient'
                )}
              </div>
            </div>
          </div>
          
          {communication.type === 'email' && communication.subject && (
            <div>
              <div className="font-semibold text-muted-foreground">Subject</div>
              <div>{communication.subject}</div>
            </div>
          )}
          
          <div>
            <div className="font-semibold text-muted-foreground">Content</div>
            <div className="mt-2 p-4 border rounded whitespace-pre-wrap bg-muted/30 text-sm">
              {communication.content}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewCommunicationDialog;
