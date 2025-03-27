
import React from 'react';
import { format } from 'date-fns';
import { 
  Calendar, 
  Clock, 
  Tag, 
  Trash2, 
  Edit, 
  CheckCircle, 
  AlertCircle, 
  CalendarClock 
} from 'lucide-react';

import { 
  Card, 
  CardContent,
  CardFooter 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { CareRecord } from '@/types/careRecord';
import { careCategories } from '@/components/dogs/components/care/CareCategories';

interface CareRecordCardProps {
  record: CareRecord;
  onEdit?: (record: CareRecord) => void;
  onDelete?: (recordId: string) => void;
  compact?: boolean;
}

const CareRecordCard: React.FC<CareRecordCardProps> = ({ 
  record, 
  onEdit, 
  onDelete,
  compact = false 
}) => {
  // Find category name for the record
  const category = careCategories.find(c => c.id === record.category);
  const categoryName = category?.name || record.category;
  
  // Generate background color based on category
  const getCategoryColor = () => {
    switch (record.category) {
      case 'pottybreaks':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'feeding':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'medications':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'grooming':
        return 'bg-pink-100 text-pink-800 border-pink-300';
      case 'training':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'wellness':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'exercise':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  
  // Generate status badge
  const getStatusBadge = () => {
    const status = record.status || 'completed';
    
    switch (status) {
      case 'completed':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case 'scheduled':
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
            <CalendarClock className="h-3 w-3 mr-1" />
            Scheduled
          </Badge>
        );
      case 'missed':
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
            <AlertCircle className="h-3 w-3 mr-1" />
            Missed
          </Badge>
        );
      default:
        return null;
    }
  };
  
  return (
    <Card className={`border-l-4 ${getCategoryColor()} shadow-sm hover:shadow transition-shadow duration-200`}>
      <CardContent className={compact ? "p-3" : "p-4"}>
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={getCategoryColor()}>
                {categoryName}
              </Badge>
              {!compact && getStatusBadge()}
            </div>
            <h4 className={`font-medium ${compact ? "text-sm" : "text-base"}`}>
              {record.task_name}
            </h4>
            <div className="flex items-center text-sm text-muted-foreground space-x-4">
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                <span>{format(new Date(record.timestamp), 'MMM d, yyyy')}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                <span>{format(new Date(record.timestamp), 'h:mm a')}</span>
              </div>
            </div>
            {record.assigned_to && !compact && (
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <span className="font-medium mr-1">Assigned to:</span> {record.assigned_to}
              </div>
            )}
            {record.notes && (
              <p className={`text-sm mt-2 ${compact ? "line-clamp-1" : ""}`}>
                {record.notes}
              </p>
            )}
            {record.follow_up_needed && !compact && (
              <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md">
                <h5 className="text-sm font-medium text-amber-800 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" /> Follow-up Required
                </h5>
                {record.follow_up_date && (
                  <div className="text-xs text-amber-800 mt-1 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    By {format(new Date(record.follow_up_date), 'MMM d, yyyy')}
                  </div>
                )}
                {record.follow_up_notes && (
                  <p className="text-xs text-amber-800 mt-1">{record.follow_up_notes}</p>
                )}
              </div>
            )}
          </div>
          {compact && getStatusBadge()}
        </div>
      </CardContent>
      
      {(onEdit || onDelete) && !compact && (
        <CardFooter className="flex justify-end p-2 gap-2 bg-gray-50">
          {onEdit && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onEdit(record)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit record</TooltipContent>
            </Tooltip>
          )}
          {onDelete && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onDelete(record.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete record</TooltipContent>
            </Tooltip>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default CareRecordCard;
