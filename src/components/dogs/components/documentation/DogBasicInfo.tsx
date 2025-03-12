
import React from 'react';
import { FileText, FileBadge, FileHeart } from 'lucide-react';

interface DogBasicInfoProps {
  microchip_number?: string;
  registration_number?: string;
  pedigree?: boolean;
}

const DogBasicInfo: React.FC<DogBasicInfoProps> = ({
  microchip_number,
  registration_number,
  pedigree
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {microchip_number && (
        <div className="flex items-center gap-2">
          <FileBadge className="h-5 w-5 text-muted-foreground" />
          <div>
            <span className="text-muted-foreground font-medium">Microchip:</span>{' '}
            {microchip_number}
          </div>
        </div>
      )}
      
      {registration_number && (
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <div>
            <span className="text-muted-foreground font-medium">Registration Number:</span>{' '}
            {registration_number}
          </div>
        </div>
      )}
      
      {pedigree && (
        <div className="flex items-center gap-2">
          <FileHeart className="h-5 w-5 text-muted-foreground" />
          <div>
            <span className="text-muted-foreground font-medium">Pedigree:</span>{' '}
            Yes
          </div>
        </div>
      )}
    </div>
  );
};

export default DogBasicInfo;
