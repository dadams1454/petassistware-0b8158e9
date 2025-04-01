
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { WelpingPostpartumCare } from '@/services/welpingService';
import { BadgeInfo, PawPrint, Syringe, Droplets, Weight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PostpartumCareListProps {
  careRecords: WelpingPostpartumCare[];
}

const PostpartumCareList: React.FC<PostpartumCareListProps> = ({ careRecords }) => {
  if (!careRecords || careRecords.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-muted-foreground">
            No postpartum care records found for this puppy.
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const getCareTypeIcon = (careType: string) => {
    switch (careType) {
      case 'feeding':
        return <PawPrint className="h-4 w-4 text-green-500" />;
      case 'cleaning':
        return <Droplets className="h-4 w-4 text-blue-500" />;
      case 'medical':
        return <Syringe className="h-4 w-4 text-red-500" />;
      case 'weighing':
        return <Weight className="h-4 w-4 text-amber-500" />;
      default:
        return <BadgeInfo className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const getCareTypeBadgeStyles = (careType: string) => {
    switch (careType) {
      case 'feeding':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'cleaning':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'medical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'weighing':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  
  return (
    <div className="space-y-4">
      {careRecords.map((record) => (
        <Card key={record.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <Badge 
                  variant="outline" 
                  className={`mr-2 ${getCareTypeBadgeStyles(record.care_type)}`}>
                  <span className="flex items-center">
                    {getCareTypeIcon(record.care_type)}
                    <span className="ml-1 capitalize">{record.care_type}</span>
                  </span>
                </Badge>
                <div className="text-sm text-muted-foreground">
                  {record.care_time}
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                {format(new Date(record.created_at), 'MMM d, yyyy')}
              </div>
            </div>
            
            <div className="mt-2 text-sm">{record.notes}</div>
            
            {record.performed_by && (
              <div className="mt-2 text-xs text-muted-foreground">
                Performed by: {record.performed_by}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PostpartumCareList;
