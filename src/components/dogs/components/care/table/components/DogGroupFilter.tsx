
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Users, Filter } from 'lucide-react';

interface DogGroupFilterProps {
  groups: { id: string; name: string; color: string | null }[];
  activeGroupId: string | null;
  onGroupChange: (groupId: string | null) => void;
}

const DogGroupFilter: React.FC<DogGroupFilterProps> = ({
  groups,
  activeGroupId,
  onGroupChange
}) => {
  if (groups.length === 0) {
    return null;
  }

  // Get background color based on group color
  const getGroupColor = (color: string | null): string => {
    switch (color) {
      case 'blue': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'teal': return 'bg-teal-100 text-teal-800 hover:bg-teal-200';
      case 'yellow': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'red': return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'green': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'purple': return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1 mr-2">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Filter by group:</span>
      </div>
      
      <div className="flex flex-wrap gap-1.5">
        <Button
          size="sm"
          variant={activeGroupId === null ? "default" : "outline"}
          className="h-8"
          onClick={() => onGroupChange(null)}
        >
          <Users className="w-3.5 h-3.5 mr-1" />
          All Dogs
        </Button>
        
        {groups.map(group => (
          <Button
            key={group.id}
            size="sm"
            variant={activeGroupId === group.id ? "default" : "outline"}
            className={`h-8 ${activeGroupId === group.id ? '' : getGroupColor(group.color)}`}
            onClick={() => onGroupChange(group.id)}
          >
            {group.name}
          </Button>
        ))}
      </div>
      
      {/* Show on mobile */}
      <div className="md:hidden w-full mt-2">
        <Select 
          value={activeGroupId || "all"} 
          onValueChange={(value) => onGroupChange(value === "all" ? null : value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a group" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Dogs</SelectItem>
            {groups.map(group => (
              <SelectItem key={group.id} value={group.id}>
                {group.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default DogGroupFilter;
