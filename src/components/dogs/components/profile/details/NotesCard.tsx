
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

interface NotesCardProps {
  notes?: string;
}

const NotesCard: React.FC<NotesCardProps> = ({ notes }) => {
  if (!notes) return null;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="mr-2 h-5 w-5" />
          Notes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-line">{notes}</p>
      </CardContent>
    </Card>
  );
};

export default NotesCard;
