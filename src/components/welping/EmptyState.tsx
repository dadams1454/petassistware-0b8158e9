
import React from 'react';
import { PawPrint } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 border border-dashed rounded-lg h-56">
      <div className="bg-primary/10 p-3 rounded-full mb-4">
        <PawPrint className="h-10 w-10 text-primary" />
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-sm">{description}</p>
    </div>
  );
};

export default EmptyState;
