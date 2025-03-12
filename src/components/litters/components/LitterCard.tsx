
import React from 'react';
import { format, differenceInWeeks } from 'date-fns';
import { Eye, Edit, Trash2, Archive } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface LitterCardProps {
  litter: Litter;
  onEdit: (litter: Litter) => void;
  onDelete: (litter: Litter) => void;
  onArchive: (litter: Litter) => void;
}

const LitterCard: React.FC<LitterCardProps> = ({ litter, onEdit, onDelete, onArchive }) => {
  const navigate = useNavigate();
  
  // Calculate litter age in weeks
  const birthDate = new Date(litter.birth_date);
  const ageInWeeks = differenceInWeeks(new Date(), birthDate);
  
  // Count available puppies and get unique colors
  const availablePuppies = (litter.puppies || []).filter(p => p.status === 'Available');
  const colors = [...new Set((litter.puppies || []).map(p => p.color).filter(Boolean))];
  
  const isArchived = litter.status === 'archived';
  
  return (
    <Card className={`overflow-hidden ${isArchived ? 'bg-muted/30' : ''}`}>
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold text-lg">
                {litter.dam?.name || 'Unknown Dam'} × {litter.sire?.name || 'Unknown Sire'}
              </h3>
              <p className="text-muted-foreground text-sm">
                Born: {format(new Date(litter.birth_date), 'MMM d, yyyy')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isArchived && (
                <Badge variant="outline" className="bg-muted text-muted-foreground rounded-full px-3 py-0.5 text-sm font-medium">
                  Archived
                </Badge>
              )}
              <Badge variant="outline" className="bg-primary/10 text-primary rounded-full px-3 py-0.5 text-sm font-medium">
                {ageInWeeks} weeks old
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Dam:</span> 
              <span className="text-sm text-muted-foreground">{litter.dam?.name || 'Unknown'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Sire:</span> 
              <span className="text-sm text-muted-foreground">{litter.sire?.name || 'Unknown'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Total Puppies:</span> 
              <span className="text-sm text-muted-foreground">
                {litter.puppies?.length || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Available:</span> 
              <span className="text-sm font-medium text-green-600">
                {availablePuppies.length} puppies
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Colors:</span> 
              <div className="flex flex-wrap justify-end gap-1">
                {colors.length > 0 ? (
                  colors.map((color, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {color}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">N/A</span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex border-t">
          <Button 
            variant="ghost" 
            className="flex-1 rounded-none py-2 h-12"
            onClick={() => navigate(`/litters/${litter.id}`)}
          >
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
          <div className="w-px bg-border" />
          <Button 
            variant="ghost" 
            className="flex-1 rounded-none py-2 h-12"
            onClick={() => onEdit(litter)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <div className="w-px bg-border" />
          {!isArchived ? (
            <>
              <Button 
                variant="ghost" 
                className="flex-1 rounded-none py-2 h-12 text-amber-600 hover:text-amber-700"
                onClick={() => onArchive(litter)}
              >
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </Button>
              <div className="w-px bg-border" />
            </>
          ) : null}
          <Button 
            variant="ghost" 
            className="flex-1 rounded-none py-2 h-12 text-destructive hover:text-destructive"
            onClick={() => onDelete(litter)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LitterCard;
