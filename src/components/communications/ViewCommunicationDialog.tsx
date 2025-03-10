
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CustomerCommunicationsRow } from '@/integrations/supabase/client';
import { Mail, MessageSquare, User, Calendar, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import MessagePreview from './MessagePreview';

interface ViewCommunicationDialogProps {
  communication: CustomerCommunicationsRow;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ViewCommunicationDialog: React.FC<ViewCommunicationDialogProps> = ({
  communication,
  open,
  onOpenChange,
}) => {
  // Format the date in a human-readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge variant and icon
  const getStatusInfo = () => {
    switch (communication.status) {
      case 'sent':
        return { 
          icon: <CheckCircle className="h-4 w-4 mr-1" />, 
          variant: 'default' as const
        };
      case 'failed':
        return { 
          icon: <AlertCircle className="h-4 w-4 mr-1" />, 
          variant: 'destructive' as const 
        };
      case 'pending':
      default:
        return { 
          icon: <Clock className="h-4 w-4 mr-1" />, 
          variant: 'outline' as const 
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Communication Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">
                {communication.customers ? 
                  `${communication.customers.first_name} ${communication.customers.last_name}` : 
                  'Unknown Recipient'}
              </span>
            </div>
            
            <div className="flex items-center">
              {communication.type === 'email' ? (
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
              ) : (
                <MessageSquare className="h-4 w-4 mr-2 text-muted-foreground" />
              )}
              <span className="text-sm capitalize">{communication.type}</span>
            </div>
            
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">{formatDate(communication.sent_at)}</span>
            </div>
            
            <div className="flex items-center">
              <Badge variant={statusInfo.variant} className="flex items-center">
                {statusInfo.icon}
                <span className="capitalize">{communication.status}</span>
              </Badge>
            </div>
          </div>

          <MessagePreview 
            messageType={communication.type}
            subject={communication.subject}
            content={communication.content}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewCommunicationDialog;
