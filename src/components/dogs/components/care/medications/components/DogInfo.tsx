
import React from 'react';

interface DogInfoProps {
  dogName: string;
  dogPhoto?: string;
  breed: string;
}

const DogInfo: React.FC<DogInfoProps> = ({ dogName, dogPhoto, breed }) => {
  return (
    <div className="flex items-center">
      {dogPhoto ? (
        <img 
          src={dogPhoto} 
          alt={dogName} 
          className="h-10 w-10 rounded-full object-cover mr-3" 
        />
      ) : (
        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
          <span className="text-primary font-bold">
            {dogName.charAt(0)}
          </span>
        </div>
      )}
      <div>
        <h3 className="font-medium">{dogName}</h3>
        <p className="text-xs text-muted-foreground">
          {breed}
        </p>
      </div>
    </div>
  );
};

export default DogInfo;
