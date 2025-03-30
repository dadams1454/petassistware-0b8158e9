
import React from 'react';
import { Litter } from '@/types/litter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Archive, Edit, Eye, RefreshCw, Trash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format, differenceInDays } from 'date-fns';
import { Link } from 'react-router-dom';

interface OrganizedLitters {
  active: Litter[];
  other: Litter[];
  archived: Litter[];
}

interface LitterCardViewProps {
  organizedLitters: OrganizedLitters;
  onEditLitter: (litter: Litter) => void;
  onDeleteLitter: (litter: Litter) => void;
  onArchiveLitter: (litter: Litter) => void;
  onUnarchiveLitter: (litter: Litter) => void;
}

interface LitterSectionProps {
  title: string;
  litters: Litter[];
  onEditLitter: (litter: Litter) => void;
  onDeleteLitter: (litter: Litter) => void;
  onArchiveLitter: (litter: Litter) => void;
  onUnarchiveLitter: (litter: Litter) => void;
  isArchived?: boolean;
}

// A single litter card component
const LitterCard: React.FC<{
  litter: Litter;
  onEdit: (litter: Litter) => void;
  onDelete: (litter: Litter) => void;
  onArchive: (litter: Litter) => void;
  onUnarchive: (litter: Litter) => void;
}> = ({ litter, onEdit, onDelete, onArchive, onUnarchive }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  const getAgeBadge = (birthDate?: string) => {
    if (!birthDate) return null;
    
    try {
      const days = differenceInDays(new Date(), new Date(birthDate));
      const weeks = Math.floor(days / 7);
      
      if (days < 0) {
        return <Badge variant="outline">Due in {Math.abs(days)} days</Badge>;
      }
      
      if (weeks < 1) {
        return <Badge variant="success" className="bg-green-100 text-green-800">{days} days</Badge>;
      }
      
      if (weeks < 8) {
        return <Badge variant="success" className="bg-green-100 text-green-800">{weeks} weeks</Badge>;
      }
      
      if (weeks < 12) {
        return <Badge variant="warning" className="bg-amber-100 text-amber-800">{weeks} weeks</Badge>;
      }
      
      return <Badge variant="destructive" className="bg-red-100 text-red-800">{weeks} weeks</Badge>;
    } catch (e) {
      return null;
    }
  };

  const isArchived = litter.status === 'archived';

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">
              {litter.litter_name || `${litter.dam?.name || 'Unknown'} × ${litter.sire?.name || 'Unknown'}`}
            </CardTitle>
            <CardDescription>
              Birth Date: {formatDate(litter.birth_date)}
            </CardDescription>
          </div>
          {getAgeBadge(litter.birth_date)}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div>
            <p className="text-muted-foreground">Dam</p>
            <p className="font-medium">{litter.dam?.name || 'Unknown'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Sire</p>
            <p className="font-medium">{litter.sire?.name || 'Unknown'}</p>
          </div>
          
          <div>
            <p className="text-muted-foreground">Puppies</p>
            <p className="font-medium">
              {litter.puppies?.length || '0'} 
              {litter.male_count !== undefined && litter.female_count !== undefined && (
                <span> ({litter.male_count}M / {litter.female_count}F)</span>
              )}
            </p>
          </div>

          {litter.expected_go_home_date && (
            <div>
              <p className="text-muted-foreground">Go Home Date</p>
              <p className="font-medium">{formatDate(litter.expected_go_home_date)}</p>
            </div>
          )}

          {litter.akc_registration_number && (
            <div className="col-span-2">
              <p className="text-muted-foreground">AKC Registration</p>
              <p className="font-medium">{litter.akc_registration_number}</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button variant="outline" size="sm" asChild>
          <Link to={`/litters/${litter.id}`}>
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Link>
        </Button>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => onEdit(litter)}>
            <Edit className="h-4 w-4" />
          </Button>
          {isArchived ? (
            <Button variant="ghost" size="sm" onClick={() => onUnarchive(litter)}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => onArchive(litter)}>
              <Archive className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => onDelete(litter)}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

// Litter section component
const LitterSection: React.FC<LitterSectionProps> = ({
  title,
  litters,
  onEditLitter,
  onDeleteLitter,
  onArchiveLitter,
  onUnarchiveLitter,
  isArchived = false
}) => {
  if (litters.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        {title}
        <Badge variant={isArchived ? "outline" : "default"}>
          {litters.length}
        </Badge>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {litters.map(litter => (
          <LitterCard
            key={litter.id}
            litter={litter}
            onEdit={onEditLitter}
            onDelete={onDeleteLitter}
            onArchive={onArchiveLitter}
            onUnarchive={onUnarchiveLitter}
          />
        ))}
      </div>
    </div>
  );
};

// Main LitterCardView component
const LitterCardView: React.FC<LitterCardViewProps> = ({
  organizedLitters,
  onEditLitter,
  onDeleteLitter,
  onArchiveLitter,
  onUnarchiveLitter
}) => {
  return (
    <div>
      <LitterSection
        title="Active Litters"
        litters={organizedLitters.active}
        onEditLitter={onEditLitter}
        onDeleteLitter={onDeleteLitter}
        onArchiveLitter={onArchiveLitter}
        onUnarchiveLitter={onUnarchiveLitter}
      />
      
      {organizedLitters.other.length > 0 && (
        <LitterSection
          title="Other Active Litters"
          litters={organizedLitters.other}
          onEditLitter={onEditLitter}
          onDeleteLitter={onDeleteLitter}
          onArchiveLitter={onArchiveLitter}
          onUnarchiveLitter={onUnarchiveLitter}
        />
      )}
      
      {organizedLitters.archived.length > 0 && (
        <LitterSection
          title="Archived Litters"
          litters={organizedLitters.archived}
          onEditLitter={onEditLitter}
          onDeleteLitter={onDeleteLitter}
          onArchiveLitter={onArchiveLitter}
          onUnarchiveLitter={onUnarchiveLitter}
          isArchived={true}
        />
      )}
    </div>
  );
};

export default LitterCardView;
