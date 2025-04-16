
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, AlertCircle, Clock, Pill } from 'lucide-react';
import { format } from 'date-fns';
import { Medication } from '@/types/health';
import { MedicationStatusEnum, isDetailedStatus, getStatusString, getStatusMessage } from '@/types/medication-status';

interface MedicationItemProps {
  medication: Medication;
  onAdminister: (medicationId: string) => void;
  isAdministering?: boolean;
}

const MedicationItem: React.FC<MedicationItemProps> = ({
  medication,
  onAdminister,
  isAdministering = false,
}) => {
  const {
    id,
    name,
    medication_name,
    dosage,
    dosage_unit,
    frequency,
    administration_route,
    status,
    notes,
    last_administered,
    nextDue
  } = medication;

  // Use medication_name as fallback if name is not provided
  const displayName = name || medication_name || 'Unnamed Medication';
  
  // Normalize status
  const statusValue = status || MedicationStatusEnum.PENDING;
  const statusString = getStatusString(statusValue);
  
  // Get the UI elements based on status
  const getStatusUI = () => {
    switch (statusString) {
      case MedicationStatusEnum.DUE:
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
          icon: <AlertCircle className="h-5 w-5 text-yellow-500" />,
          actionText: 'Administer Now',
          showAction: true,
        };
      case MedicationStatusEnum.OVERDUE:
        return {
          color: 'bg-red-100 text-red-800 border-red-300',
          icon: <AlertCircle className="h-5 w-5 text-red-500" />,
          actionText: 'Administer Now',
          showAction: true,
        };
      case MedicationStatusEnum.UPCOMING:
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-300',
          icon: <Clock className="h-5 w-5 text-blue-500" />,
          actionText: 'Administer Early',
          showAction: true,
        };
      case MedicationStatusEnum.ADMINISTERED:
        return {
          color: 'bg-green-100 text-green-800 border-green-300',
          icon: <Check className="h-5 w-5 text-green-500" />,
          actionText: 'Administer Again',
          showAction: false,
        };
      case MedicationStatusEnum.COMPLETED:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-300',
          icon: <Check className="h-5 w-5 text-gray-500" />,
          actionText: 'Restart',
          showAction: false,
        };
      case MedicationStatusEnum.PAUSED:
        return {
          color: 'bg-purple-100 text-purple-800 border-purple-300',
          icon: <Clock className="h-5 w-5 text-purple-500" />,
          actionText: 'Resume',
          showAction: false,
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-300',
          icon: <Pill className="h-5 w-5 text-gray-500" />,
          actionText: 'Administer',
          showAction: true,
        };
    }
  };

  const { color, icon, actionText, showAction } = getStatusUI();
  
  // Get message from status
  const message = isDetailedStatus(status) && status.message 
    ? status.message 
    : getStatusMessage(statusValue);

  // Format the next due date if available
  const formattedNextDue = nextDue 
    ? (typeof nextDue === 'string' 
      ? format(new Date(nextDue), 'MMM d, yyyy') 
      : format(nextDue, 'MMM d, yyyy'))
    : null;

  return (
    <Card className={`border ${color} shadow-sm`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {icon}
              <h3 className="font-semibold text-base">{displayName}</h3>
            </div>
            
            <p className="text-sm font-medium mb-2">{message}</p>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs">
              {dosage && dosage_unit && (
                <div>
                  <span className="text-gray-500">Dosage:</span> {dosage} {dosage_unit}
                </div>
              )}
              
              {frequency && (
                <div>
                  <span className="text-gray-500">Frequency:</span> {frequency}
                </div>
              )}
              
              {administration_route && (
                <div>
                  <span className="text-gray-500">Route:</span> {administration_route}
                </div>
              )}
              
              {last_administered && (
                <div>
                  <span className="text-gray-500">Last given:</span> {format(new Date(last_administered), 'MMM d')}
                </div>
              )}
              
              {formattedNextDue && (
                <div>
                  <span className="text-gray-500">Next due:</span> {formattedNextDue}
                </div>
              )}
            </div>
            
            {notes && (
              <p className="text-xs text-gray-600 border-t border-gray-200 mt-2 pt-2">
                {notes}
              </p>
            )}
          </div>
          
          {showAction && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAdminister(id)}
              disabled={isAdministering}
              className="ml-4 h-8"
            >
              {isAdministering ? 'Saving...' : actionText}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicationItem;
