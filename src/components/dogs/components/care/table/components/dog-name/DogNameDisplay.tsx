
import React from 'react';

interface DogNameDisplayProps {
  dogName: string;
  onClick: (e: React.MouseEvent) => void;
}

const DogNameDisplay: React.FC<DogNameDisplayProps> = ({ dogName, onClick }) => {
  return (
    <div 
      className="font-medium truncate max-w-[100px] cursor-pointer hover:text-blue-600 dark:hover:text-blue-400" 
      title={dogName}
      onClick={onClick}
    >
      {dogName}
    </div>
  );
};

export default DogNameDisplay;
