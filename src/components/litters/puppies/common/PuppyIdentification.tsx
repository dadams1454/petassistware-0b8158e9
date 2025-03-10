
import React from 'react';
import { Scan } from 'lucide-react';

interface PuppyIdentificationProps {
  microchipNumber: string | null;
}

const PuppyIdentification: React.FC<PuppyIdentificationProps> = ({ microchipNumber }) => {
  if (!microchipNumber) {
    return <span className="text-sm text-muted-foreground">Not chipped</span>;
  }

  return (
    <div className="text-sm">
      <div className="flex items-center gap-1 text-muted-foreground">
        <Scan className="h-3.5 w-3.5" />
        Microchip:
      </div>
      <div className="font-mono">{microchipNumber}</div>
    </div>
  );
};

export default PuppyIdentification;
