import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Litter } from '@/types/litter';
import LitterSection from '@/components/litters/components/LitterSection';
import { Badge } from '@/components/ui/badge';

interface OrganizedLitters {
  active: Litter[];
  other: Litter[];
  archived: Litter[];
}

interface LitterCardViewProps {
  organizedLitters: OrganizedLitters;
  onEditLitter: (litter: Litter) => void;
  onDeleteLitter: (litter: Litter) => void;
  onArchiveLitter: (litter: Litter) => void;
  onUnarchiveLitter: (litter: Litter) => void;
}

const LitterCardView: React.FC<LitterCardViewProps> = ({
  organizedLitters,
  onEditLitter,
  onDeleteLitter,
  onArchiveLitter,
  onUnarchiveLitter
}) => {
  // Get badge props based on litter status
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'active':
        return {
          variant: 'default' as const,
          label: 'Active'
        };
      case 'complete':
        return {
          variant: 'default' as const,
          label: 'Complete'
        };
      case 'planned':
        return {
          variant: 'outline' as const,
          label: 'Planned'
        };
      case 'archived':
        return {
          variant: 'secondary' as const,
          label: 'Archived'
        };
      default:
        return {
          variant: 'outline' as const,
          label: status || 'Unknown'
        };
    }
  };
  
  // Show the total count of all litters
  const totalLittersCount = 
    organizedLitters.active.length + 
    organizedLitters.other.length + 
    organizedLitters.archived.length;
  
  return (
    <Accordion 
      type="multiple" 
      defaultValue={organizedLitters.active.length > 0 ? ['active-litters'] : []}
      className="w-full"
    >
      {/* Active Litters Section */}
      <AccordionItem value="active-litters" className="border-b">
        <AccordionTrigger className="hover:no-underline py-4">
          <div className="flex justify-between w-full items-center pr-4">
            <h3 className="text-lg font-semibold">Active Litters</h3>
            <div className="flex items-center gap-2">
              <Badge variant="default" className="rounded-full">
                {organizedLitters.active.length}
              </Badge>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <LitterSection 
            litters={organizedLitters.active}
            onEdit={onEditLitter}
            onDelete={onDeleteLitter}
            onArchive={onArchiveLitter}
            onUnarchive={onUnarchiveLitter}
          />
        </AccordionContent>
      </AccordionItem>
      
      {/* Other Litters Section (if any) */}
      {organizedLitters.other.length > 0 && (
        <AccordionItem value="other-litters" className="border-b">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex justify-between w-full items-center pr-4">
              <h3 className="text-lg font-semibold">Other Active Litters</h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="rounded-full">
                  {organizedLitters.other.length}
                </Badge>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <LitterSection 
              litters={organizedLitters.other}
              onEdit={onEditLitter}
              onDelete={onDeleteLitter}
              onArchive={onArchiveLitter}
              onUnarchive={onUnarchiveLitter}
            />
          </AccordionContent>
        </AccordionItem>
      )}
      
      {/* Archived Litters Section (if any) */}
      {organizedLitters.archived.length > 0 && (
        <AccordionItem value="archived-litters">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex justify-between w-full items-center pr-4">
              <h3 className="text-lg font-semibold">Archived Litters</h3>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="rounded-full">
                  {organizedLitters.archived.length}
                </Badge>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <LitterSection 
              litters={organizedLitters.archived}
              onEdit={onEditLitter}
              onDelete={onDeleteLitter}
              onArchive={onArchiveLitter}
              onUnarchive={onUnarchiveLitter}
            />
          </AccordionContent>
        </AccordionItem>
      )}
    </Accordion>
  );
};

export default LitterCardView;
