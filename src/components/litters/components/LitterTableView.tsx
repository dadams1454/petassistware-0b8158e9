import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Litter } from '@/types/litter';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Archive, Unarchive } from 'lucide-react';
import { cn } from '@/lib/utils';

type LitterStatus = 'planned' | 'active' | 'completed' | 'archived';

interface LitterTableViewProps {
  litters: Litter[];
  onEditLitter: (litter: Litter) => void;
  onDeleteLitter: (litter: Litter) => void;
  onArchiveLitter: (litter: Litter) => void;
  onUnarchiveLitter: (litter: Litter) => void;
}

const LitterTableView: React.FC<LitterTableViewProps> = ({
  litters,
  onEditLitter,
  onDeleteLitter,
  onArchiveLitter,
  onUnarchiveLitter
}) => {
  return (
    <div className="w-full">
      <Table>
        <TableCaption>A list of your recent litters.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Litter Name</TableHead>
            <TableHead>Dam</TableHead>
            <TableHead>Sire</TableHead>
            <TableHead>Birth Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {litters.map((litter) => {
            const isArchived = (litter.status as LitterStatus) === 'archived';

            return (
              <TableRow key={litter.id}>
                <TableCell className="font-medium">{litter.litter_name || 'N/A'}</TableCell>
                <TableCell>{litter.dam?.name || 'N/A'}</TableCell>
                <TableCell>{litter.sire?.name || 'N/A'}</TableCell>
                <TableCell>
                  {litter.birth_date
                    ? new Date(litter.birth_date).toLocaleDateString()
                    : 'N/A'}
                </TableCell>
                <TableCell>{litter.status || 'N/A'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditLitter(litter)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteLitter(litter)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    {isArchived ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onUnarchiveLitter(litter)}
                      >
                        <Unarchive className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onArchiveLitter(litter)}
                        className={cn(isArchived && "hidden")}
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={6} className="text-center">
              {litters.length} litters in total
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default LitterTableView;
