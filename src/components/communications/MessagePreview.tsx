
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, MessageSquare } from 'lucide-react';

interface MessagePreviewProps {
  messageType: 'email' | 'sms';
  subject?: string;
  content: string;
  className?: string;
}

const MessagePreview: React.FC<MessagePreviewProps> = ({
  messageType,
  subject,
  content,
  className = '',
}) => {
  if (messageType === 'email') {
    return (
      <Card className={`overflow-hidden ${className}`}>
        <div className="bg-secondary p-3 flex items-center gap-2 border-b">
          <Mail className="h-4 w-4" />
          <span className="font-medium text-sm">Email Preview</span>
        </div>
        <CardContent className="p-0">
          {subject && (
            <div className="p-3 border-b">
              <div className="text-sm font-medium">Subject: {subject}</div>
            </div>
          )}
          <div className="p-4 text-sm whitespace-pre-wrap">
            {content}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className="bg-secondary p-3 flex items-center gap-2 border-b">
        <MessageSquare className="h-4 w-4" />
        <span className="font-medium text-sm">SMS Preview</span>
      </div>
      <CardContent className="p-4 text-sm">
        <div className="max-w-[320px] mx-auto bg-background border rounded-lg p-3 shadow whitespace-pre-wrap">
          {content}
        </div>
        <div className="text-xs text-muted-foreground text-center mt-2">
          Messages longer than 160 characters may be split into multiple messages
        </div>
      </CardContent>
    </Card>
  );
};

export default MessagePreview;
