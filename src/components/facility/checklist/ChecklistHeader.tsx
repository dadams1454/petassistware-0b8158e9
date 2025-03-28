
import React from 'react';

interface ChecklistHeaderProps {
  date: string;
}

const ChecklistHeader: React.FC<ChecklistHeaderProps> = ({ date }) => {
  return (
    <div className="bg-primary text-primary-foreground p-4 rounded-t-lg flex justify-between items-center">
      <h1 className="text-2xl font-bold">Daily Kennel Facility Checklist</h1>
      <div className="text-lg">{date}</div>
    </div>
  );
};

export default ChecklistHeader;
