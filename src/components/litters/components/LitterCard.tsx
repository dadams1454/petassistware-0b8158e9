
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Archive, Trash2, RefreshCw } from 'lucide-react';
import { Litter } from '@/types/litter';

export interface LitterCardProps {
  litter: Litter;
  onEditLitter: (litter: Litter) => void;
  onDeleteLitter: (litter: Litter) => void;
  onArchiveLitter: (litter: Litter) => void;
  onUnarchiveLitter: (litter: Litter) => void;
}

const LitterCard: React.FC<LitterCardProps> = ({
  litter,
  onEditLitter,
  onDeleteLitter,
  onArchiveLitter,
  onUnarchiveLitter
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{litter.name || 'Unnamed Litter'}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Placeholder litter card content</p>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" size="sm" onClick={() => onEditLitter(litter)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        {litter.archived ? (
          <Button variant="outline" size="sm" onClick={() => onUnarchiveLitter(litter)}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Unarchive
          </Button>
        ) : (
          <Button variant="outline" size="sm" onClick={() => onArchiveLitter(litter)}>
            <Archive className="h-4 w-4 mr-2" />
            Archive
          </Button>
        )}
        <Button variant="destructive" size="sm" onClick={() => onDeleteLitter(litter)}>
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LitterCard;
