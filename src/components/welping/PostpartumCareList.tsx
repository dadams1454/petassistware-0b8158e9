
import React from 'react';
import { WelpingPostpartumCare } from '@/services/welpingService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, ArrowRight, CalendarClock, Stethoscope, Trash, User } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';

interface PostpartumCareListProps {
  careRecords: WelpingPostpartumCare[];
  onDelete?: (id: string) => void;
}

const PostpartumCareList: React.FC<PostpartumCareListProps> = ({
  careRecords,
  onDelete,
}) => {
  if (careRecords.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <AlertTriangle className="h-10 w-10 text-amber-500 mb-2" />
          <h3 className="text-lg font-medium mb-1">No Care Records Found</h3>
          <p className="text-muted-foreground max-w-md">
            No postpartum care has been recorded for this puppy yet. Start tracking care activities using the form above.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  const formatCareType = (type: string) => {
    switch (type) {
      case 'feeding': return { label: 'Feeding', color: 'bg-green-100 text-green-800 hover:bg-green-200' };
      case 'cleaning': return { label: 'Cleaning', color: 'bg-blue-100 text-blue-800 hover:bg-blue-200' };
      case 'medical': return { label: 'Medical', color: 'bg-red-100 text-red-800 hover:bg-red-200' };
      case 'weighing': return { label: 'Weighing', color: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200' };
      default: return { label: 'Other', color: 'bg-gray-100 text-gray-800 hover:bg-gray-200' };
    }
  };

  return (
    <div className="space-y-4">
      {careRecords.map((care) => {
        const careTypeInfo = formatCareType(care.care_type);
        const careDate = new Date(`${new Date().toISOString().split('T')[0]}T${care.care_time}`);
        
        return (
          <Card key={care.id} className="overflow-hidden">
            <div className="flex items-center border-b p-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Badge className={careTypeInfo.color}>
                    {careTypeInfo.label}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    <CalendarClock className="h-4 w-4 inline mr-1" />
                    {format(careDate, 'h:mm a')}
                  </span>
                </div>
                {care.performed_by && (
                  <p className="text-xs text-muted-foreground mt-1">
                    <User className="h-3 w-3 inline mr-1" />
                    By: {care.performed_by}
                  </p>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(care.created_at), { addSuffix: true })}
              </div>
            </div>
            <CardContent className="p-4">
              <div className="text-sm whitespace-pre-wrap">{care.notes}</div>
              
              {onDelete && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => onDelete(care.id)}
                    className="text-xs text-red-600 hover:text-red-800 flex items-center"
                  >
                    <Trash className="h-3 w-3 mr-1" />
                    Delete Record
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default PostpartumCareList;
