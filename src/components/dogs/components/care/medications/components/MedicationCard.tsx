
import React from 'react';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Check, Clock, AlertTriangle, Settings, Calendar, Plus } from 'lucide-react';
import { MedicationInfo, DogInfoProps, LastMedicationInfoProps } from '../types/medicationTypes';
import { getMedicationStatus, getStatusLabel } from '@/utils/medicationUtils';
import TimeManager from '../../table/components/TimeManager';

interface MedicationCardProps {
  medication: MedicationInfo;
  dogInfo: {
    dogId: string;
    dogName: string;
    dogPhoto: string;
    breed: string;
  };
  onAdminister?: (medicationId: string) => void;
  onEdit?: (medicationId: string) => void;
}

const MedicationCard: React.FC<MedicationCardProps> = ({ medication, dogInfo, onAdminister, onEdit }) => {
  const status = medication.status;
  const lastAdministered = medication.lastAdministered;
  
  const handleAdminister = () => {
    if (onAdminister) {
      onAdminister(medication.id);
    }
  };
  
  const handleEdit = () => {
    if (onEdit) {
      onEdit(medication.id);
    }
  };
  
  const getStatusIcon = () => {
    if (typeof status === 'string') {
      switch (status) {
        case 'active':
          return <Check className="h-4 w-4 text-green-500" />;
        case 'upcoming':
          return <Calendar className="h-4 w-4 text-blue-500" />;
        case 'overdue':
          return <AlertTriangle className="h-4 w-4 text-red-500" />;
        default:
          return <Clock className="h-4 w-4 text-gray-500" />;
      }
    }
    
    // If status is an object
    if (status && typeof status === 'object') {
      switch (status.status) {
        case 'active':
          return <Check className="h-4 w-4 text-green-500" />;
        case 'upcoming':
          return <Calendar className="h-4 w-4 text-blue-500" />;
        case 'overdue':
          return <AlertTriangle className="h-4 w-4 text-red-500" />;
        default:
          return <Clock className="h-4 w-4 text-gray-500" />;
      }
    }
    
    return <Clock className="h-4 w-4 text-gray-500" />;
  };
  
  return (
    <div className="bg-white rounded-lg border p-4 space-y-4">
      <DogInfo 
        dogId={dogInfo.dogId}
        dogName={dogInfo.dogName} 
        dogPhoto={dogInfo.dogPhoto}
        breed={dogInfo.breed}
      />
      
      <div className="border-t pt-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium">{medication.name}</h3>
            <p className="text-sm text-muted-foreground">
              {medication.dosage && `${medication.dosage} ${medication.dosage && medication.dosage}`}
            </p>
          </div>
          
          <div className="flex items-center space-x-1">
            {getStatusIcon()}
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              typeof status === 'object' && status?.statusColor ? 
                status.statusColor : 
                getStatusLabel(status || 'unknown').statusColor
            }`}>
              {typeof status === 'object' && status?.statusLabel ? 
                status.statusLabel : 
                getStatusLabel(status || 'unknown').statusLabel}
            </span>
          </div>
        </div>
        
        <LastMedicationInfo
          dogId={dogInfo.dogId}
          name={medication.name}
          lastAdministered={lastAdministered}
          frequency={medication.frequency}
        />
        
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" size="sm" onClick={handleEdit}>
            <Settings className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button size="sm" onClick={handleAdminister}>
            <Plus className="h-4 w-4 mr-1" />
            Log Dose
          </Button>
        </div>
      </div>
    </div>
  );
};

// The DogInfo component displays basic information about the dog
const DogInfo: React.FC<DogInfoProps> = ({ dogId, dogName, dogPhoto, breed }) => {
  return (
    <div className="flex items-center space-x-3">
      <div className="w-12 h-12 rounded-full overflow-hidden bg-primary/10">
        {dogPhoto ? (
          <img 
            src={dogPhoto} 
            alt={dogName} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-primary/60 text-lg font-bold">
            {dogName.charAt(0)}
          </div>
        )}
      </div>
      <div>
        <h3 className="font-semibold">{dogName}</h3>
        <p className="text-xs text-muted-foreground">{breed}</p>
      </div>
    </div>
  );
};

// The LastMedicationInfo component displays information about when the medication was last administered
const LastMedicationInfo: React.FC<LastMedicationInfoProps> = ({ dogId, name, lastAdministered, frequency }) => {
  if (!lastAdministered) {
    return (
      <div className="mt-2 text-sm">
        <div className="text-muted-foreground">No administration records yet</div>
      </div>
    );
  }
  
  return (
    <div className="mt-2">
      <TimeManager 
        frequency={frequency}
        lastTime={lastAdministered}
        showFrequency={true}
      />
    </div>
  );
};

export default MedicationCard;
