
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Home,
  Dog,
  Users,
  Calendar,
  Package,
  Settings,
  ClipboardList,
  PawPrint,
  Menu,
  X,
  Baby,
  Dna,
  Building,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  end?: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
  to,
  icon,
  children,
  onClick,
  end = false,
}) => {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
          isActive
            ? 'bg-muted text-primary hover:bg-muted hover:text-primary'
            : 'text-muted-foreground hover:bg-muted hover:text-primary'
        )
      }
    >
      {icon}
      <span>{children}</span>
    </NavLink>
  );
};

const SidebarMenu: React.FC<SidebarMenuProps> = ({ isOpen, onClose }) => {
  return (
    <div
      className={cn(
        'fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-all duration-300 lg:hidden',
        isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
      )}
    >
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 bg-background p-6 shadow-lg transition-transform duration-300',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between">
          <span className="text-xl font-semibold">PetAssistWare</span>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-7rem)]">
          <div className="mt-6 space-y-6">
            <div className="space-y-1">
              <SidebarLink to="/" icon={<Home className="h-5 w-5" />} onClick={onClose} end>
                Dashboard
              </SidebarLink>
              <SidebarLink to="/dogs" icon={<Dog className="h-5 w-5" />} onClick={onClose}>
                Dogs
              </SidebarLink>
              <SidebarLink to="/customers" icon={<Users className="h-5 w-5" />} onClick={onClose}>
                Customers
              </SidebarLink>
              <SidebarLink to="/litters" icon={<Baby className="h-5 w-5" />} onClick={onClose}>
                Litters
              </SidebarLink>
            </div>

            <div className="space-y-1">
              <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Breeding
              </h3>
              <SidebarLink to="/reproduction" icon={<PawPrint className="h-5 w-5" />} onClick={onClose}>
                Reproduction
              </SidebarLink>
              <SidebarLink to="/breeding/genetic-analysis" icon={<Dna className="h-5 w-5" />} onClick={onClose}>
                Genetic Analysis
              </SidebarLink>
              <SidebarLink to="/whelping" icon={<ClipboardList className="h-5 w-5" />} onClick={onClose}>
                Whelping
              </SidebarLink>
            </div>

            <div className="space-y-1">
              <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Management
              </h3>
              <SidebarLink to="/calendar" icon={<Calendar className="h-5 w-5" />} onClick={onClose}>
                Calendar
              </SidebarLink>
              <SidebarLink to="/facility" icon={<Building className="h-5 w-5" />} onClick={onClose}>
                Facility
              </SidebarLink>
              <SidebarLink to="/inventory" icon={<Package className="h-5 w-5" />} onClick={onClose}>
                Inventory
              </SidebarLink>
            </div>

            <div className="space-y-1">
              <SidebarLink to="/settings" icon={<Settings className="h-5 w-5" />} onClick={onClose}>
                Settings
              </SidebarLink>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default SidebarMenu;
