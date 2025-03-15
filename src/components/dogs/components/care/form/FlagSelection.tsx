import React from 'react';
import { Check } from 'lucide-react';
import { FormLabel } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DogFlag } from '@/types/dailyCare';

interface FlagSelectionProps {
  selectedFlags: {
    in_heat: boolean;
    incompatible: boolean;
    special_attention: boolean;
    other: boolean;
  };
  toggleFlag: (flagType: keyof typeof selectedFlags) => void;
  otherDogs: { id: string; name: string }[];
  incompatibleDogs: string[];
  handleIncompatibleDogToggle: (dogId: string) => void;
  specialAttentionNote: string;
  setSpecialAttentionNote: (note: string) => void;
  otherFlagNote: string;
  setOtherFlagNote: (note: string) => void;
  showFlagsSection: boolean;
  setShowFlagsSection: (show: boolean) => void;
}

const FlagSelection: React.FC<FlagSelectionProps> = ({
  selectedFlags,
  toggleFlag,
  otherDogs,
  incompatibleDogs,
  handleIncompatibleDogToggle,
  specialAttentionNote,
  setSpecialAttentionNote,
  otherFlagNote,
  setOtherFlagNote,
  showFlagsSection,
  setShowFlagsSection,
}) => {
  return (
    <div className="space-y-4">
      <Collapsible
        open={showFlagsSection}
        onOpenChange={setShowFlagsSection}
        className="border rounded-md p-2"
      >
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="flex w-full justify-between p-2">
            <FormLabel className="cursor-pointer">Add Flags (Optional)</FormLabel>
            <Check className={`h-4 w-4 ${showFlagsSection ? 'opacity-100' : 'opacity-0'}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="px-4 pb-2 pt-1">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="in-heat"
                checked={selectedFlags.in_heat}
                onCheckedChange={() => toggleFlag('in_heat')}
              />
              <label
                htmlFor="in-heat"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                In Heat
              </label>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="incompatible"
                  checked={selectedFlags.incompatible}
                  onCheckedChange={() => toggleFlag('incompatible')}
                />
                <label
                  htmlFor="incompatible"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Incompatible with other dogs
                </label>
              </div>

              {selectedFlags.incompatible && otherDogs.length > 0 && (
                <div className="ml-6 mt-2">
                  <p className="text-sm text-muted-foreground mb-2">Select incompatible dogs:</p>
                  <ScrollArea className="h-24 w-full rounded-md border">
                    <div className="p-2 space-y-2">
                      {otherDogs.map((dog) => (
                        <div key={dog.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`dog-${dog.id}`}
                            checked={incompatibleDogs.includes(dog.id)}
                            onCheckedChange={() => handleIncompatibleDogToggle(dog.id)}
                          />
                          <label
                            htmlFor={`dog-${dog.id}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {dog.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="special-attention"
                  checked={selectedFlags.special_attention}
                  onCheckedChange={() => toggleFlag('special_attention')}
                />
                <label
                  htmlFor="special-attention"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Needs special attention
                </label>
              </div>

              {selectedFlags.special_attention && (
                <div className="ml-6 mt-2">
                  <Textarea
                    placeholder="Describe the special attention needed"
                    value={specialAttentionNote}
                    onChange={(e) => setSpecialAttentionNote(e.target.value)}
                    className="resize-none"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="other-flag"
                  checked={selectedFlags.other}
                  onCheckedChange={() => toggleFlag('other')}
                />
                <label
                  htmlFor="other-flag"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Other flag
                </label>
              </div>

              {selectedFlags.other && (
                <div className="ml-6 mt-2">
                  <Textarea
                    placeholder="Describe the flag"
                    value={otherFlagNote}
                    onChange={(e) => setOtherFlagNote(e.target.value)}
                    className="resize-none"
                  />
                </div>
              )}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default FlagSelection;
