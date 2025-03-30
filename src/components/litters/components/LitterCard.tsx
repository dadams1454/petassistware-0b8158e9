import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarClock, Users, MapPin, Dog, BadgeInfo } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { Litter } from '@/types/litter';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface LitterCardProps {
  litter: Litter;
  onEditLitter: (litter: Litter) => void;
  onViewLitter: (litter: Litter) => void;
}

const LitterCard: React.FC<LitterCardProps> = ({ litter, onEditLitter, onViewLitter }) => {
  const getStatusColor = (status: string | undefined) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'planned':
        return 'bg-blue-100 text-blue-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = () => {
    if (!litter.litter_name) return 'LT';
    return litter.litter_name.substring(0, 2).toUpperCase();
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex items-center border-b p-4 bg-muted/30">
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src={litter.documents_url || undefined} alt={litter.litter_name || 'Litter'} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-medium line-clamp-1">
            {litter.litter_name || 'Unnamed Litter'}
          </h3>
          <div className="flex gap-1 items-center text-xs text-muted-foreground">
            <CalendarClock className="h-3.5 w-3.5" />
            <span>
              Born{' '}
              {litter.birth_date
                ? formatDistanceToNow(new Date(litter.birth_date), {
                    addSuffix: true,
                  })
                : 'Unknown'}
            </span>
          </div>
        </div>
        <Badge variant="outline" className={getStatusColor(litter.status)}>
          {litter.status || 'Planned'}
        </Badge>
      </div>
      <CardContent className="p-4 grid gap-2">
        <div className="flex items-center gap-1 text-sm">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            {litter.puppy_count || 0} Puppies
          </span>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <Dog className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            Dam:{' '}
            {litter.dam?.name ? (
              litter.dam.name
            ) : (
              <span className="italic text-muted-foreground">Unknown</span>
            )}
          </span>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <Dog className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            Sire:{' '}
            {litter.sire?.name ? (
              litter.sire.name
            ) : (
              <span className="italic text-muted-foreground">Unknown</span>
            )}
          </span>
        </div>
        {litter.kennel_name && (
          <div className="flex items-center gap-1 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{litter.kennel_name}</span>
          </div>
        )}
        {litter.akc_registration_number && (
          <div className="flex items-center gap-1 text-sm">
            <BadgeInfo className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              AKC: {litter.akc_registration_number}
            </span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end p-4 pt-0">
        <Button variant="outline" size="sm" onClick={() => onEditLitter(litter)}>
          Edit
        </Button>
        <Button variant="secondary" size="sm" onClick={() => onViewLitter(litter)}>
          View
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LitterCard;
