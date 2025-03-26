
import React from 'react';
import { Button } from '@/components/ui/button';

interface NoDogsMessageProps {
  onRefresh: () => void;
}

const NoDogsMessage: React.FC<NoDogsMessageProps> = ({ onRefresh }) => {
  return (
    <div className="p-8 text-center border rounded-lg">
      <p className="text-muted-foreground">No dogs found. Please refresh or add dogs to the system.</p>
      <Button onClick={onRefresh} className="mt-4">Refresh Dogs</Button>
    </div>
  );
};

export default NoDogsMessage;
