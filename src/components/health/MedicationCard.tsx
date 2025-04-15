
import React from 'react';
import { format, differenceInDays } from 'date-fns';
import { Pill, Clock, Calendar, MoreHorizontal } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Medication } from '@/types/health-unified';

interface MedicationCardProps {
  medication: Medication;
  onView?: (medication: Medication) => void;
  onEdit?: (medication: Medication) => void;
  onDelete?: (medicationId: string) => void;
  onLogAdministration?: (medicationId: string) => void;
}

const MedicationCard: React.FC<MedicationCardProps> = ({
  medication,
  onView,
  onEdit,
  onDelete,
  onLogAdministration
}) => {
  // Get status color
  const getStatusColor = () => {
    const status = medication.status?.toLowerCase() || '';
    
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'paused':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'discontinued':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  // Format dosage info
  const getDosageInfo = () => {
    if (!medication.dosage) return null;
    
    return `${medication.dosage} ${medication.dosage_unit || ''} ${medication.frequency || ''}`;
  };
  
  // Calculate days remaining
  const getDaysRemaining = () => {
    if (!medication.end_date) return null;
    
    const endDate = new Date(medication.end_date);
    const now = new Date();
    
    const daysRemaining = differenceInDays(endDate, now);
    
    if (daysRemaining < 0) return 'Expired';
    if (daysRemaining === 0) return 'Last day';
    return `${daysRemaining} days left`;
  };

  return (
    <Card className="hover:bg-muted/50 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <Pill className="h-5 w-5 text-purple-500" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium truncate">
                  {medication.name || medication.medication_name}
                </h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  <Badge 
                    variant="secondary" 
                    className={getStatusColor()}
                  >
                    {medication.status || 'Unknown status'}
                  </Badge>
                </div>
              </div>
              
              {medication.last_administered && (
                <span className="text-xs text-muted-foreground flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  Last: {format(new Date(medication.last_administered), 'MMM d')}
                </span>
              )}
            </div>
            
            {getDosageInfo() && (
              <p className="text-sm mt-2">{getDosageInfo()}</p>
            )}
            
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              {medication.start_date && (
                <span className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  Start: {format(new Date(medication.start_date), 'MMM d, yyyy')}
                </span>
              )}
              
              {medication.end_date && (
                <span className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  End: {format(new Date(medication.end_date), 'MMM d, yyyy')}
                </span>
              )}
            </div>
            
            {getDaysRemaining() && (
              <div className="mt-2 text-sm font-medium">
                {getDaysRemaining()}
              </div>
            )}
            
            {medication.notes && (
              <p className="text-xs text-muted-foreground mt-2 line-clamp-1">
                {medication.notes}
              </p>
            )}
          </div>
          
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onView && (
                  <DropdownMenuItem onClick={() => onView(medication)}>
                    View
                  </DropdownMenuItem>
                )}
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(medication)}>
                    Edit
                  </DropdownMenuItem>
                )}
                {onLogAdministration && (
                  <DropdownMenuItem onClick={() => onLogAdministration(medication.id)}>
                    Log Administration
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem 
                    className="text-destructive"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this medication?')) {
                        onDelete(medication.id);
                      }
                    }}
                  >
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicationCard;
