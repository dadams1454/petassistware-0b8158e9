
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { LastMedicationInfoProps } from '../types/medicationTypes';

const LastMedicationInfo: React.FC<LastMedicationInfoProps> = ({ 
  medication,
  lastAdministeredDate,
  // Backward compatibility props
  name, 
  lastAdministered,
  frequency 
}) => {
  // Use either the medication object or the backward compatibility props
  const medicationName = medication ? medication.name : name;
  const medicationFrequency = medication ? medication.frequency : frequency;
  const lastAdminDate = lastAdministeredDate || 
                        (medication && medication.last_administered) || 
                        lastAdministered;
  
  const getLastAdministeredText = () => {
    if (!lastAdminDate) return 'Never administered';
    
    try {
      return formatDistanceToNow(new Date(lastAdminDate), { addSuffix: true });
    } catch (error) {
      console.error('Date parsing error:', error);
      return 'Date error';
    }
  };
  
  const getFrequencyText = () => {
    const freq = medicationFrequency || '';
    switch (freq.toLowerCase()) {
      case 'daily':
        return 'Daily';
      case 'twice-daily':
      case 'twice daily':
        return 'Twice daily';
      case 'weekly':
        return 'Weekly';
      case 'biweekly':
        return 'Every 2 weeks';
      case 'monthly':
        return 'Monthly';
      case 'as-needed':
      case 'as needed':
        return 'As needed';
      default:
        return freq;
    }
  };
  
  return (
    <div className="mt-3 pt-2 border-t text-xs text-muted-foreground">
      <p>Last dose: <span className="font-medium">{getLastAdministeredText()}</span></p>
      <p>Frequency: <span className="font-medium">{getFrequencyText()}</span></p>
    </div>
  );
};

export default LastMedicationInfo;
