
import React from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Paintbrush, RotateCcw } from 'lucide-react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Separator } from '@/components/ui/separator';

interface PersonalizationPanelProps {
  trigger?: React.ReactNode;
}

const PersonalizationPanel: React.FC<PersonalizationPanelProps> = ({ 
  trigger 
}) => {
  const { preferences, resetAllPreferences } = useUserPreferences();
  
  const handleResetAll = () => {
    if (confirm('This will reset all your personalization settings. Continue?')) {
      resetAllPreferences();
    }
  };
  
  const dogColorEntries = Object.entries(preferences.dogColors);
  const hasCustomizations = dogColorEntries.length > 0;

  return (
    <Sheet>
      <SheetTrigger asChild>
        {trigger || (
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
          >
            <Paintbrush className="h-4 w-4" />
            <span>Personalize</span>
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Interface Personalization</SheetTitle>
          <SheetDescription>
            Customize your kennel management interface to suit your preferences.
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-6 space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Custom Dog Colors</h3>
            <Separator className="mb-3" />
            
            {hasCustomizations ? (
              <div className="space-y-3">
                {dogColorEntries.map(([dogId, colorClass]) => (
                  <div key={dogId} className="flex items-center">
                    <div className={`h-6 w-6 rounded mr-3 ${colorClass.split(' ')[0]}`}></div>
                    <div className="text-sm">{dogId}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                No custom dog colors set. You can customize a dog's appearance by clicking the paintbrush icon next to their name.
              </div>
            )}
          </div>
          
          {/* Future personalization options can be added here */}
        </div>
        
        <SheetFooter className="pt-4">
          <Button 
            variant="outline" 
            className="gap-1" 
            onClick={handleResetAll}
            disabled={!hasCustomizations}
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset All Settings</span>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default PersonalizationPanel;
