
import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InviteLinkDisplayProps {
  inviteLink: string;
  onClose: () => void;
}

export const InviteLinkDisplay: React.FC<InviteLinkDisplayProps> = ({
  inviteLink,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md bg-muted p-4">
        <div className="text-sm font-medium mb-2">Invitation Link:</div>
        <div className="text-xs break-all bg-background p-2 rounded border">
          {inviteLink}
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Share this link with the user. In a real application, an email would be sent automatically.
      </p>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button variant="default" onClick={handleCopyLink} className="gap-2">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? 'Copied' : 'Copy Link'}
        </Button>
      </div>
    </div>
  );
};
