
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { LastMedicationInfoProps } from '../types/medicationTypes';

const LastMedicationInfo: React.FC<LastMedicationInfoProps> = ({ 
  name, 
  lastAdministered,
  frequency 
}) => {
  const getLastAdministeredText = () => {
    if (!lastAdministered) return 'Never administered';
    
    try {
      return formatDistanceToNow(new Date(lastAdministered), { addSuffix: true });
    } catch (error) {
      console.error('Date parsing error:', error);
      return 'Date error';
    }
  };
  
  const getFrequencyText = () => {
    switch (frequency) {
      case 'daily':
        return 'Daily';
      case 'twice-daily':
        return 'Twice daily';
      case 'weekly':
        return 'Weekly';
      case 'biweekly':
        return 'Every 2 weeks';
      case 'monthly':
        return 'Monthly';
      case 'as-needed':
        return 'As needed';
      default:
        return frequency;
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
