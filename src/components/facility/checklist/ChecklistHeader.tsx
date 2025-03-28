
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';

interface ChecklistHeaderProps {
  date: string;
}

const ChecklistHeader: React.FC<ChecklistHeaderProps> = ({ date }) => {
  return (
    <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
      <div className="flex justify-between items-center">
        <CardTitle className="text-2xl">Daily Kennel Facility Checklist</CardTitle>
        <div className="text-lg">{date}</div>
      </div>
    </CardHeader>
  );
};

export default ChecklistHeader;
