import React from 'react';
import { Litter } from '@/types/litter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { format, formatDistanceToNow } from 'date-fns';
import { CalendarClock, Dog, MapPin, Users, PlusCircle, Pencil, Trash2, Eye, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LitterCardViewProps {
  litters: Litter[];
  onEditLitter: (litter: Litter) => void;
  onDeleteLitter: (litter: Litter) => void;
}

const LitterCardView: React.FC<LitterCardViewProps> = ({ 
  litters, 
  onEditLitter, 
  onDeleteLitter 
}) => {
  const navigate = useNavigate();

  const handleViewLitter = (litterId: string) => {
    navigate(`/litters/${litterId}`);
  };

  const handleViewPuppies = (litterId: string) => {
    navigate(`/litters/${litterId}/puppies`);
  };

  const handleViewWelping = (litterId: string) => {
    navigate(`/welping/${litterId}`);
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'planned':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  const getTimeAgo = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return '';
    }
  };

  const getDogInitials = (name?: string) => {
    if (!name) return '??';
    const parts = name.split(' ');
    if (parts.length === 1) return name.substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  if (litters.length === 0) {
    return (
      <Card className="text-center p-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="rounded-full bg-muted p-3">
            <Dog className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle>No Litters Found</CardTitle>
          <CardDescription>
            You haven't added any litters yet. Create your first litter to get started.
          </CardDescription>
          <Button className="mt-2">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Your First Litter
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {litters.map((litter) => (
        <Card key={litter.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">
                  {litter.litter_name || 'Unnamed Litter'}
                </CardTitle>
                <CardDescription>
                  {formatDate(litter.birth_date)}
                  {litter.birth_date && (
                    <span className="ml-1 text-xs">
                      ({getTimeAgo(litter.birth_date)})
                    </span>
                  )}
                </CardDescription>
              </div>
              <Badge className={getStatusColor(litter.status)}>
                {litter.status || 'Active'}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="pb-2">
            <div className="space-y-3">
              {/* Parents */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={litter.dam?.photo_url} alt={litter.dam?.name} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getDogInitials(litter.dam?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium line-clamp-1">
                      {litter.dam?.name || 'Unknown Dam'}
                    </p>
                    <p className="text-xs text-muted-foreground">Dam</p>
                  </div>
                </div>
                
                <ArrowRight className="h-4 w-4 text-muted-foreground mx-1" />
                
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={litter.sire?.photo_url} alt={litter.sire?.name} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getDogInitials(litter.sire?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium line-clamp-1">
                      {litter.sire?.name || 'Unknown Sire'}
                    </p>
                    <p className="text-xs text-muted-foreground">Sire</p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Litter Info */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {litter.puppy_count || litter.puppies?.length || 0} puppies
                  </span>
                </div>
                
                <div className="flex items-center gap-1.5">
                  <CalendarClock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {formatDate(litter.expected_go_home_date)}
                  </span>
                </div>
                
                {litter.kennel_name && (
                  <div className="flex items-center gap-1.5 col-span-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{litter.kennel_name}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="pt-2 flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => handleViewLitter(litter.id)}
            >
              <Eye className="h-3.5 w-3.5 mr-1" />
              Details
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => handleViewPuppies(litter.id)}
            >
              <Dog className="h-3.5 w-3.5 mr-1" />
              Puppies
            </Button>
            
            <div className="w-full flex gap-2 mt-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex-1"
                onClick={() => onEditLitter(litter)}
              >
                <Pencil className="h-3.5 w-3.5 mr-1" />
                Edit
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex-1 text-destructive hover:text-destructive"
                onClick={() => onDeleteLitter(litter)}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Delete
              </Button>
              
              {litter.birth_date && new Date(litter.birth_date) > new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleViewWelping(litter.id)}
                >
                  <Dog className="h-3.5 w-3.5 mr-1" />
                  Welping
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default LitterCardView;
