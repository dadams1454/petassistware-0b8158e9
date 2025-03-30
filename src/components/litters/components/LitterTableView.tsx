import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Eye, PenSquare, Trash } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Litter } from '@/types/litter';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface LitterTableViewProps {
  litters: Litter[];
  onEditLitter: (litter: Litter) => void;
  onDeleteLitter: (litter: Litter) => void;
}

const LitterTableView: React.FC<LitterTableViewProps> = ({ litters, onEditLitter, onDeleteLitter }) => {
  const navigate = useNavigate();

  const handleViewLitter = (litterId: string) => {
    navigate(`/litters/${litterId}`);
  };

  return (
    <TooltipProvider>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Dam</TableHead>
              <TableHead>Sire</TableHead>
              <TableHead>Birth Date</TableHead>
              <TableHead>Puppies</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {litters.map((litter) => (
              <TableRow key={litter.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-2">
                    {litter.litter_name ? (
                      litter.litter_name
                    ) : (
                      <div className="flex items-center">
                        <Avatar className="h-7 w-7">
                          {litter.dam?.photo_url ? (
                            <AvatarImage src={litter.dam.photo_url} alt={litter.dam.name} />
                          ) : (
                            <AvatarFallback>{litter.dam?.name?.substring(0, 2) || 'DM'}</AvatarFallback>
                          )}
                        </Avatar>
                        <span className="ml-2">{litter.dam?.name || 'Unknown Dam'}</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {litter.dam ? (
                    <div className="flex items-center">
                      <Avatar className="h-7 w-7">
                        {litter.dam.photo_url ? (
                          <AvatarImage src={litter.dam.photo_url} alt={litter.dam.name} />
                        ) : (
                          <AvatarFallback>{litter.dam.name?.substring(0, 2) || 'DM'}</AvatarFallback>
                        )}
                      </Avatar>
                      <span className="ml-2">{litter.dam.name}</span>
                    </div>
                  ) : (
                    'N/A'
                  )}
                </TableCell>
                <TableCell>
                  {litter.sire ? (
                    <div className="flex items-center">
                      <Avatar className="h-7 w-7">
                        {litter.sire.photo_url ? (
                          <AvatarImage src={litter.sire.photo_url} alt={litter.sire.name} />
                        ) : (
                          <AvatarFallback>{litter.sire.name?.substring(0, 2) || 'SR'}</AvatarFallback>
                        )}
                      </Avatar>
                      <span className="ml-2">{litter.sire.name}</span>
                    </div>
                  ) : (
                    'N/A'
                  )}
                </TableCell>
                <TableCell>
                  {format(parseISO(litter.birth_date), 'PPP')}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{litter.puppy_count || 0} Puppies</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => handleViewLitter(litter.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      View Litter
                    </TooltipContent>
                    
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => onEditLitter(litter)}>
                        <PenSquare className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Edit Litter
                    </TooltipContent>

                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/5 hover:text-destructive" onClick={() => onDeleteLitter(litter)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Delete Litter
                    </TooltipContent>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
};

export default LitterTableView;
