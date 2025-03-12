
import React from 'react';
import { Progress } from '@/components/ui/progress';

const SMS_CHAR_LIMIT = 160;

interface SmsCharacterCounterProps {
  text: string;
}

const SmsCharacterCounter: React.FC<SmsCharacterCounterProps> = ({ text }) => {
  const charCount = text.length;
  const messagesCount = Math.ceil(charCount / SMS_CHAR_LIMIT);
  const percentageFilled = Math.min((charCount % SMS_CHAR_LIMIT || SMS_CHAR_LIMIT) / SMS_CHAR_LIMIT * 100, 100);
  
  const getStatusColor = () => {
    if (messagesCount === 1 && charCount <= SMS_CHAR_LIMIT * 0.8) {
      return 'text-green-500';
    } else if (messagesCount === 1) {
      return 'text-yellow-500';
    } else {
      return 'text-yellow-500';
    }
  };

  return (
    <div className="text-xs space-y-1">
      <div className="flex justify-between">
        <span>Characters: <span className={getStatusColor()}>{charCount}</span></span>
        <span>
          {messagesCount > 1 ? 
            `Will send as ${messagesCount} messages` : 
            `${SMS_CHAR_LIMIT - charCount} characters remaining`
          }
        </span>
      </div>
      <Progress value={percentageFilled} className="h-1" />
    </div>
  );
};

export default SmsCharacterCounter;
