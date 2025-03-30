
import React from 'react';

interface SmsCharacterCounterProps {
  text: string;
}

const SmsCharacterCounter: React.FC<SmsCharacterCounterProps> = ({ text }) => {
  const characterCount = text.length;
  const smsCount = Math.ceil(characterCount / 160);
  
  // Determine color based on count
  const getCountColor = () => {
    if (characterCount > 400) return 'text-red-500';
    if (characterCount > 300) return 'text-amber-500';
    return 'text-muted-foreground';
  };

  return (
    <div className={`text-xs flex justify-between ${getCountColor()}`}>
      <span>{characterCount} characters</span>
      <span>{smsCount} SMS message{smsCount !== 1 ? 's' : ''}</span>
    </div>
  );
};

export default SmsCharacterCounter;
