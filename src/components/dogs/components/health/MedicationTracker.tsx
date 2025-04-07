
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Check, Clock, AlarmClock, AlertCircle, Edit, Calendar, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Medication } from '@/types/health';
import { 
  getMedicationStatus, 
  MedicationFrequencyConstants, 
  getStatusLabel 
} from '@/utils/medicationUtils';

interface MedicationTrackerProps {
  medications: Medication[];
  onEdit?: (medication: Medication) => void;
  onDelete?: (medicationId: string) => void;
  onAdminister?: (medicationId: string, data: any) => void;
  className?: string;
}

export const MedicationTracker: React.FC<MedicationTrackerProps> = ({
  medications = [],
  onEdit,
  onDelete,
  onAdminister,
  className
}) => {
  const { toast } = useToast();
  const [expandedMedications, setExpandedMedications] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedMedications(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleAdminister = (medicationId: string) => {
    if (onAdminister) {
      onAdminister(medicationId, {
        administered_at: new Date().toISOString(),
        notes: ''
      });
      toast({
        title: 'Medication administered',
        description: 'The medication administration has been recorded.',
      });
    }
  };

  const activeMedications = medications.filter(med => med.is_active !== false);
  const inactiveMedications = medications.filter(med => med.is_active === false);

  if (medications.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg">Medications</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            No medications have been prescribed yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  const renderMedicationStatus = (medication: Medication) => {
    const status = getMedicationStatus(
      medication.start_date,
      medication.end_date,
      medication.frequency || MedicationFrequencyConstants.DAILY,
      medication.last_administered
    );
    
    const { label, color } = getStatusLabel(status.status);
    
    switch (status.status) {
      case 'active':
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            {label}
          </Badge>
        );
      case 'upcoming':
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-600">
            {label}
          </Badge>
        );
      case 'overdue':
        return (
          <Badge className="bg-red-500 hover:bg-red-600">
            {label}
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="outline" className="border-gray-400 text-gray-500">
            {label}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {label}
          </Badge>
        );
    }
  };

  const renderMedicationItem = (medication: Medication, index: number) => {
    const isExpanded = expandedMedications[medication.id] || false;
    
    const status = getMedicationStatus(
      medication.start_date,
      medication.end_date,
      medication.frequency || MedicationFrequencyConstants.DAILY,
      medication.last_administered
    );
    
    return (
      <div key={medication.id} className="mb-4 last:mb-0">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-2">
            <div className="flex flex-col">
              <h4 className="font-semibold text-base">
                {medication.medication_name}
              </h4>
              <p className="text-sm text-muted-foreground">
                {medication.dosage} {medication.dosage_unit} ({medication.frequency})
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {renderMedicationStatus(medication)}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onAdminister && (
                  <DropdownMenuItem onClick={() => handleAdminister(medication.id)}>
                    <Check className="mr-2 h-4 w-4" />
                    Administer
                  </DropdownMenuItem>
                )}
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(medication)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem 
                    onClick={() => onDelete(medication.id)}
                    className="text-destructive"
                  >
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 px-2 text-xs"
              onClick={() => toggleExpand(medication.id)}
            >
              {isExpanded ? 'Less' : 'More'}
            </Button>
          </div>
        </div>
        
        {isExpanded && (
          <div className="mt-2 pl-2 border-l-2 border-gray-200 space-y-1">
            <div className="flex text-xs">
              <span className="text-gray-500 w-28">Start Date:</span>
              <span>{medication.start_date ? format(new Date(medication.start_date), 'MMM d, yyyy') : 'Not set'}</span>
            </div>
            {medication.end_date && (
              <div className="flex text-xs">
                <span className="text-gray-500 w-28">End Date:</span>
                <span>{format(new Date(medication.end_date), 'MMM d, yyyy')}</span>
              </div>
            )}
            <div className="flex text-xs">
              <span className="text-gray-500 w-28">Administration:</span>
              <span>{medication.administration_route}</span>
            </div>
            {medication.last_administered && (
              <div className="flex text-xs">
                <span className="text-gray-500 w-28">Last Given:</span>
                <span>{format(new Date(medication.last_administered), 'MMM d, yyyy h:mm a')}</span>
              </div>
            )}
            {status.nextDue && (
              <div className="flex text-xs">
                <span className="text-gray-500 w-28">Next Due:</span>
                <span>{format(status.nextDue, 'MMM d, yyyy')}</span>
              </div>
            )}
            {medication.notes && (
              <div className="flex text-xs">
                <span className="text-gray-500 w-28">Notes:</span>
                <span className="text-gray-700">{medication.notes}</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Medications</CardTitle>
      </CardHeader>
      <CardContent>
        {activeMedications.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Active Medications</h3>
            <div className="space-y-2 divide-y">
              {activeMedications.map(renderMedicationItem)}
            </div>
          </div>
        )}
        
        {inactiveMedications.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2">Inactive Medications</h3>
            <div className="space-y-2 divide-y text-gray-500">
              {inactiveMedications.map(renderMedicationItem)}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MedicationTracker;
