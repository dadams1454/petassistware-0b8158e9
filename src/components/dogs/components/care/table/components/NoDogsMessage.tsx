
import React, { ReactNode } from 'react';
import { Dog } from 'lucide-react';

interface NoDogsMessageProps {
  title: string;
  description: string;
  icon?: ReactNode;
  children?: ReactNode;
}

const NoDogsMessage: React.FC<NoDogsMessageProps> = ({ 
  title, 
  description, 
  icon = <Dog className="h-16 w-16 text-muted-foreground mb-4" />,
  children 
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8">
      <div className="mb-2">
        {icon}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground mt-2">{description}</p>
      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </div>
  );
};

export default NoDogsMessage;
