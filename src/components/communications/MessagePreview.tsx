
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MessagePreviewProps {
  messageType: "email" | "sms";
  subject?: string;
  content: string;
}

const MessagePreview: React.FC<MessagePreviewProps> = ({ messageType, subject, content }) => {
  if (messageType === "email") {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="bg-primary/5 py-3">
          <CardTitle className="text-sm font-medium">
            {subject || "No Subject"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 min-h-[300px] max-h-[300px] overflow-y-auto">
          <div className="prose prose-sm max-w-none">
            {content.split('\n').map((line, i) => (
              <p key={i}>{line || <br />}</p>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // SMS Preview
  return (
    <div className="min-h-[300px] max-h-[300px] overflow-hidden flex items-stretch">
      <div className="w-full bg-muted rounded-lg p-4 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[80%] ml-auto bg-primary text-primary-foreground rounded-lg p-3 mb-2">
            {content}
          </div>
        </div>
        <div className="h-6 border-t pt-1 text-xs text-center text-muted-foreground">
          SMS Preview
        </div>
      </div>
    </div>
  );
};

export default MessagePreview;
