
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

interface DogGroupBadgesProps {
  dogGroups: Array<{id: string; name: string; color: string | null}>;
}

const DogGroupBadges: React.FC<DogGroupBadgesProps> = ({ dogGroups }) => {
  if (dogGroups.length === 0) return null;
  
  // Get group badge color
  const getGroupBadgeColor = (color: string | null) => {
    switch (color) {
      case 'blue': return 'bg-blue-100 text-blue-800';
      case 'teal': return 'bg-teal-100 text-teal-800';
      case 'yellow': return 'bg-yellow-100 text-yellow-800';
      case 'red': return 'bg-red-100 text-red-800';
      case 'green': return 'bg-green-100 text-green-800';
      case 'purple': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="flex flex-wrap gap-1 mt-1 mb-1">
      {dogGroups.map(group => (
        <Badge 
          key={group.id} 
          variant="outline" 
          className={`text-xs py-0 px-1.5 ${getGroupBadgeColor(group.color)}`}
        >
          <Users className="h-2.5 w-2.5 mr-0.5" />
          {group.name}
        </Badge>
      ))}
    </div>
  );
};

export default DogGroupBadges;
