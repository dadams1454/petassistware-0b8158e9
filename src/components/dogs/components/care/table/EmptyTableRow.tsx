
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyTableRowProps {
  onRefresh?: () => void;
}

const EmptyTableRow: React.FC<EmptyTableRowProps> = ({ onRefresh }) => {
  return (
    <TableRow>
      <TableCell colSpan={6} className="text-center py-8">
        <p className="text-gray-500">No dogs found</p>
        <p className="text-xs text-gray-400 mt-2">Check your Supabase connection and ensure dogs are added to the system</p>
        
        {onRefresh && (
          <Button 
            onClick={onRefresh} 
            variant="outline" 
            size="sm" 
            className="mt-4 gap-2"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};

export default EmptyTableRow;
