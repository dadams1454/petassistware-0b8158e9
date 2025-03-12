
import React from 'react';
import { cn } from '@/lib/utils';

interface PedigreeNodeProps {
  dog?: any;
  small?: boolean;
  onClick?: (dog: any) => void;
}

interface EmptyNodeProps {
  type: 'sire' | 'dam';
  small?: boolean;
}

const PedigreeNode = ({ dog, small = false, onClick }: PedigreeNodeProps) => {
  return (
    <div 
      className={cn(
        "border rounded-lg p-3 bg-card shadow-sm hover:shadow-md transition-shadow",
        small ? "w-[120px]" : "w-[180px]",
        onClick && dog ? "cursor-pointer hover:bg-accent/20" : ""
      )}
      onClick={() => onClick && dog && onClick(dog)}
    >
      <div className="flex items-center gap-2">
        <div className={cn(
          "rounded-full overflow-hidden bg-muted flex-shrink-0",
          small ? "w-6 h-6" : "w-8 h-8"
        )}>
          {dog.photo_url ? (
            <div 
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${dog.photo_url})` }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              🐾
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className={cn(
            "font-medium truncate",
            small ? "text-sm" : "text-base"
          )}>
            {dog.name}
          </p>
          {!small && (
            <p className="text-xs text-muted-foreground truncate">
              {dog.breed}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const EmptyNode = ({ type, small = false }: EmptyNodeProps) => {
  return (
    <div 
      className={cn(
        "border border-dashed rounded-lg p-3 bg-muted/30 text-center text-muted-foreground",
        small ? "w-[120px] text-xs" : "w-[180px] text-sm"
      )}
    >
      No {type === 'sire' ? 'Sire' : 'Dam'} Data
    </div>
  );
};

PedigreeNode.Empty = EmptyNode;

export default PedigreeNode;
