
import React from 'react';
import { TableHeader, TableRow, TableHead } from '@/components/ui/table';

const DogCareTableHeader: React.FC = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Dog</TableHead>
        <TableHead>Breed</TableHead>
        <TableHead>Last Care</TableHead>
        <TableHead>Time</TableHead>
        <TableHead>Flags</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default DogCareTableHeader;
