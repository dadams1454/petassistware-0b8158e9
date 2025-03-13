import React from 'react';
import { Litter } from '../puppies/types';
import LitterSection from '../components/LitterSection';
import { PawPrint, UserRound, ArchiveIcon } from 'lucide-react';

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

const LitterCardView: React.FC<LitterCardViewProps> = ({
  organizedLitters,
  onEditLitter,
  onDeleteLitter,
  onArchiveLitter,
  onUnarchiveLitter
}) => {
  return (
    <div className="space-y-10">
      {/* Active Litters - Full Width Layout */}
      {organizedLitters.active.length > 0 && (
        <div className="bg-purple-50 rounded-lg p-4 pb-8">
          <div className="flex items-center gap-2 mb-6 pl-2">
            <UserRound className="h-5 w-5 text-purple-600" />
            <h2 className="text-xl font-semibold text-purple-800">Active Litters</h2>
            <span className="text-sm text-purple-600 ml-2 font-medium">
              ({organizedLitters.active.length} {organizedLitters.active.length === 1 ? 'litter' : 'litters'})
            </span>
          </div>

          <div className="flex flex-row-reverse overflow-x-auto pb-2 gap-6 snap-x">
            {organizedLitters.active.map((litter) => (
              <div 
                key={litter.id} 
                className="transform transition-all duration-200 hover:scale-105 hover:shadow-lg min-w-[350px] snap-start"
              >
                <LitterCard 
                  litter={litter}
                  onEdit={onEditLitter}
                  onDelete={onDeleteLitter}
                  onArchive={onArchiveLitter}
                  onUnarchive={onUnarchiveLitter}
                  isActive={true}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Other Litters */}
      {organizedLitters.other.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <PawPrint className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Other Litters</h2>
            <span className="text-sm text-muted-foreground ml-2">
              ({organizedLitters.other.length} {organizedLitters.other.length === 1 ? 'litter' : 'litters'})
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizedLitters.other.map((litter) => (
              <LitterCard 
                key={litter.id}
                litter={litter}
                onEdit={onEditLitter}
                onDelete={onDeleteLitter}
                onArchive={onArchiveLitter}
                onUnarchive={onUnarchiveLitter}
                isActive={false}
              />
            ))}
          </div>
        </div>
      )}

      {/* Archived Litters */}
      {organizedLitters.archived.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <ArchiveIcon className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Archived Litters</h2>
            <span className="text-sm text-muted-foreground ml-2">
              ({organizedLitters.archived.length} {organizedLitters.archived.length === 1 ? 'litter' : 'litters'})
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizedLitters.archived.map((litter) => (
              <LitterCard 
                key={litter.id}
                litter={litter}
                onEdit={onEditLitter}
                onDelete={onDeleteLitter}
                onArchive={onArchiveLitter}
                onUnarchive={onUnarchiveLitter}
                isActive={false}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// We need to import the LitterCard component directly here 
// since we've removed the LitterSection component
import { Eye, Edit, Trash2, Archive, ArchiveRestore, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, differenceInWeeks } from 'date-fns';

interface LitterCardProps {
  litter: Litter;
  onEdit: (litter: Litter) => void;
  onDelete: (litter: Litter) => void;
  onArchive: (litter: Litter) => void;
  onUnarchive?: (litter: Litter) => void;
  isActive: boolean;
}

const LitterCard: React.FC<LitterCardProps> = ({ 
  litter, 
  onEdit, 
  onDelete, 
  onArchive,
  onUnarchive,
  isActive
}) => {
  const navigate = useNavigate();
  
  // Calculate litter age in weeks
  const birthDate = new Date(litter.birth_date);
  const ageInWeeks = differenceInWeeks(new Date(), birthDate);
  
  // Count available puppies and get unique colors
  const availablePuppies = litter.puppies ? litter.puppies.filter(p => p.status === 'Available') : [];
  const totalPuppies = litter.puppies ? litter.puppies.length : 0;
  const colors = [...new Set((litter.puppies || []).map(p => p.color).filter(Boolean))];
  
  const isArchived = litter.status === 'archived';
  
  return (
    <Card className={`overflow-hidden ${isArchived ? 'bg-muted/30' : ''} ${isActive ? 'border-purple-300 shadow-md' : ''}`}>
      <CardContent className="p-0">
        {/* Colored header bar for active litters */}
        {isActive && (
          <div className="bg-gradient-to-l from-purple-600 to-pink-500 h-1.5"></div>
        )}
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              {/* Litter Name (displayed prominently) */}
              {litter.litter_name && (
                <h2 className={`font-bold text-xl mb-1 ${isActive ? 'text-purple-900' : ''}`}>
                  {litter.litter_name}
                </h2>
              )}
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
              <Badge variant={isActive ? "secondary" : "outline"} className={`${isActive ? 'bg-purple-100 text-purple-800' : 'bg-primary/10 text-primary'} rounded-full px-3 py-0.5 text-sm font-medium`}>
                {ageInWeeks} weeks old
              </Badge>
              {isActive && availablePuppies.length > 0 && (
                <Badge variant="secondary" className="bg-green-100 text-green-800 rounded-full px-3 py-0.5 text-sm font-medium">
                  {availablePuppies.length} available
                </Badge>
              )}
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
                {totalPuppies}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Available:</span> 
              <span className={`text-sm font-medium ${isActive ? 'text-green-600' : ''}`}>
                {availablePuppies.length} puppies
              </span>
            </div>
            {litter.akc_registration_number && (
              <div className="flex justify-between">
                <span className="text-sm font-medium flex items-center">
                  <Award className="h-3.5 w-3.5 mr-1 text-purple-600" />
                  AKC #:
                </span> 
                <span className="text-sm text-purple-600 font-medium">
                  {litter.akc_registration_number}
                </span>
              </div>
            )}
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
            className={`flex-1 rounded-none py-2 h-12 ${isActive ? 'text-purple-700 hover:text-purple-900 hover:bg-purple-50' : ''}`}
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
          ) : onUnarchive ? (
            <>
              <Button 
                variant="ghost" 
                className="flex-1 rounded-none py-2 h-12 text-emerald-600 hover:text-emerald-700"
                onClick={() => onUnarchive(litter)}
              >
                <ArchiveRestore className="h-4 w-4 mr-2" />
                Unarchive
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

export default LitterCardView;
