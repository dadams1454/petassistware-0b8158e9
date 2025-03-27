
import React from 'react';
import { Pill } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DogInfoProps {
  dogName: string;
  dogPhoto: string | null;
  breed: string | null;
}

const DogInfo: React.FC<DogInfoProps> = ({ dogName, dogPhoto, breed }) => {
  return (
    <div className="flex items-center gap-2">
      {dogPhoto ? (
        <img 
          src={dogPhoto} 
          alt={dogName} 
          className="h-10 w-10 rounded-full object-cover"
        />
      ) : (
        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
          <Pill className="h-5 w-5 text-blue-500" />
        </div>
      )}
      <div>
        <p className="font-medium text-sm">{dogName}</p>
        <p className={cn("text-xs text-muted-foreground", !breed && "italic")}>
          {breed || "Unknown breed"}
        </p>
      </div>
    </div>
  );
};

export default DogInfo;
