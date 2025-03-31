
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InviteLinkDisplayProps {
  inviteLink: string;
  onClose: () => void;
}

export function InviteLinkDisplay({ inviteLink, onClose }: InviteLinkDisplayProps) {
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      toast({
        title: 'Copied to clipboard',
        description: 'The invitation link has been copied to your clipboard.',
      });

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: 'Failed to copy',
        description: 'Could not copy the link to clipboard. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Invitation Link</label>
        <div className="flex items-center space-x-2">
          <Input
            value={inviteLink}
            readOnly
            className="font-mono text-xs"
          />
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={copyToClipboard}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Share this link with the user to complete their registration.
        </p>
      </div>

      <div className="bg-muted rounded-md p-3 text-sm">
        <p className="font-medium mb-1">For testing purposes:</p>
        <p>This link can be used to simulate a user accepting your invitation.</p>
        <p className="mt-2">In a production environment, this would be sent via email.</p>
      </div>

      <div className="flex justify-end">
        <Button onClick={onClose}>
          Done
        </Button>
      </div>
    </div>
  );
}
