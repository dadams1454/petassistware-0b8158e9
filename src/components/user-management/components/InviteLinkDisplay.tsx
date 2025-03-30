
import React, { useState } from 'react';
import { Check, Copy, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DialogFooter } from '@/components/ui/dialog';

interface InviteLinkDisplayProps {
  inviteLink: string;
  onClose: () => void;
}

export const InviteLinkDisplay: React.FC<InviteLinkDisplayProps> = ({
  inviteLink,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="space-y-4">
      <Alert className="bg-blue-50 border-blue-200 text-blue-800">
        <AlertDescription>
          Share this invitation link with the user. This link will expire in 24 hours.
        </AlertDescription>
      </Alert>

      <div className="flex items-center gap-2">
        <Input
          value={inviteLink}
          readOnly
          className="font-mono text-sm"
        />
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handleCopy}
          className="flex-shrink-0"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>

      <DialogFooter className="pt-4">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </DialogFooter>
    </div>
  );
};
