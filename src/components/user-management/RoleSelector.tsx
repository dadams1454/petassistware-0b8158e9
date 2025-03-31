
import React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

// Updated roles to match kennel management needs
const roles = [
  { value: 'owner', label: 'Kennel Owner', description: 'Full access to all features and settings' },
  { value: 'admin', label: 'Administrator', description: 'Can manage most system settings and all data' },
  { value: 'manager', label: 'Kennel Manager', description: 'Can manage dogs, litters, and staff' },
  { value: 'staff', label: 'Staff Member', description: 'Daily care and basic record keeping' },
  { value: 'veterinarian', label: 'Veterinarian', description: 'Access to health records and medical data' },
  { value: 'assistant', label: 'Breeding Assistant', description: 'Specialized in breeding and whelping' },
  { value: 'viewer', label: 'Limited Viewer', description: 'Read-only access to specific areas' },
];

interface RoleSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function RoleSelector({ value, onChange, disabled }: RoleSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const selectedRole = roles.find((role) => role.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="w-full justify-between"
        >
          {selectedRole ? selectedRole.label : "Select role..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search role..." />
          <CommandEmpty>No role found.</CommandEmpty>
          <CommandGroup>
            {roles.map((role) => (
              <CommandItem
                key={role.value}
                value={role.value}
                onSelect={(currentValue) => {
                  onChange(currentValue);
                  setOpen(false);
                }}
                className="flex flex-col items-start py-2"
              >
                <div className="flex w-full items-center">
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === role.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="font-medium">{role.label}</span>
                </div>
                <span className="ml-6 text-xs text-muted-foreground">
                  {role.description}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
