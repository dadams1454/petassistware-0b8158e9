
import React from 'react';
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from '@/components/ui/context-menu';

interface CellContextMenuProps {
  children: React.ReactNode;
  hasObservation: boolean;
  onOpenObservation: () => void;
}

const CellContextMenu: React.FC<CellContextMenuProps> = ({ 
  children, 
  hasObservation, 
  onOpenObservation 
}) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      
      <ContextMenuContent>
        <ContextMenuItem onSelect={onOpenObservation}>
          {hasObservation ? "View/Add Observation" : "Add Observation"}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default CellContextMenu;
