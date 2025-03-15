
import React from 'react';
import { Heart, Slash, AlertCircle, Flag } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface FlagSelectionProps {
  selectedFlags: {
    in_heat: boolean;
    incompatible: boolean;
    special_attention: boolean;
    other: boolean;
  };
  toggleFlag: (flagType: keyof typeof selectedFlags) => void;
  otherDogs: Array<{ id: string; name: string }>;
  incompatibleDogs: string[];
  handleIncompatibleDogToggle: (dogId: string) => void;
  specialAttentionNote: string;
  setSpecialAttentionNote: (value: string) => void;
  otherFlagNote: string;
  setOtherFlagNote: (value: string) => void;
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
  setShowFlagsSection
}) => {
  return (
    <div className="border rounded-md p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Special Flags</h3>
        <button
          type="button"
          className="text-sm text-muted-foreground hover:text-foreground"
          onClick={() => setShowFlagsSection(!showFlagsSection)}
        >
          {showFlagsSection ? 'Hide' : 'Show'}
        </button>
      </div>
      
      {showFlagsSection && (
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="in-heat" 
                checked={selectedFlags.in_heat}
                onCheckedChange={() => toggleFlag('in_heat')}
              />
              <label 
                htmlFor="in-heat"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center space-x-2"
              >
                <Heart className="h-4 w-4 text-red-500" />
                <span>In Heat</span>
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="incompatible" 
                checked={selectedFlags.incompatible}
                onCheckedChange={() => toggleFlag('incompatible')}
              />
              <label 
                htmlFor="incompatible"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center space-x-2"
              >
                <Slash className="h-4 w-4 text-amber-500" />
                <span>Doesn't Get Along With Other Dogs</span>
              </label>
            </div>

            {selectedFlags.incompatible && (
              <div className="pl-6 mt-2 space-y-2">
                <p className="text-sm text-muted-foreground">Select incompatible dogs:</p>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                  {otherDogs.map(dog => (
                    <div key={dog.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`incompatible-${dog.id}`}
                        checked={incompatibleDogs.includes(dog.id)}
                        onCheckedChange={() => handleIncompatibleDogToggle(dog.id)}
                      />
                      <label 
                        htmlFor={`incompatible-${dog.id}`}
                        className="text-sm cursor-pointer"
                      >
                        {dog.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="special-attention" 
                checked={selectedFlags.special_attention}
                onCheckedChange={() => toggleFlag('special_attention')}
              />
              <label 
                htmlFor="special-attention"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center space-x-2"
              >
                <AlertCircle className="h-4 w-4 text-blue-500" />
                <span>Needs Special Attention</span>
              </label>
            </div>

            {selectedFlags.special_attention && (
              <div className="pl-6 mt-2">
                <Input
                  placeholder="Specify what special attention is needed"
                  value={specialAttentionNote}
                  onChange={(e) => setSpecialAttentionNote(e.target.value)}
                />
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="other-flag" 
                checked={selectedFlags.other}
                onCheckedChange={() => toggleFlag('other')}
              />
              <label 
                htmlFor="other-flag"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center space-x-2"
              >
                <Flag className="h-4 w-4 text-gray-500" />
                <span>Other Flag</span>
              </label>
            </div>

            {selectedFlags.other && (
              <div className="pl-6 mt-2">
                <Input
                  placeholder="Specify the flag"
                  value={otherFlagNote}
                  onChange={(e) => setOtherFlagNote(e.target.value)}
                />
              </div>
            )}
          </div>

          <ActiveFlagsSummary
            selectedFlags={selectedFlags}
            incompatibleDogs={incompatibleDogs}
            specialAttentionNote={specialAttentionNote}
            otherFlagNote={otherFlagNote}
          />
        </div>
      )}
    </div>
  );
};

// Helper component for active flags summary
const ActiveFlagsSummary: React.FC<{
  selectedFlags: {
    in_heat: boolean;
    incompatible: boolean;
    special_attention: boolean;
    other: boolean;
  };
  incompatibleDogs: string[];
  specialAttentionNote: string;
  otherFlagNote: string;
}> = ({ selectedFlags, incompatibleDogs, specialAttentionNote, otherFlagNote }) => {
  if (!(selectedFlags.in_heat || 
        (selectedFlags.incompatible && incompatibleDogs.length > 0) || 
        (selectedFlags.special_attention && specialAttentionNote) || 
        (selectedFlags.other && otherFlagNote))) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {selectedFlags.in_heat && (
        <Badge variant="outline" className="bg-red-100 text-red-800">
          <Heart className="h-3 w-3 mr-1 fill-red-500 text-red-500" />
          In Heat
        </Badge>
      )}
      {selectedFlags.incompatible && incompatibleDogs.length > 0 && (
        <Badge variant="outline" className="bg-amber-100 text-amber-800">
          <Slash className="h-3 w-3 mr-1 text-amber-500" />
          Incompatible with {incompatibleDogs.length} dogs
        </Badge>
      )}
      {selectedFlags.special_attention && specialAttentionNote && (
        <Badge variant="outline" className="bg-blue-100 text-blue-800">
          <AlertCircle className="h-3 w-3 mr-1 text-blue-500" />
          {specialAttentionNote}
        </Badge>
      )}
      {selectedFlags.other && otherFlagNote && (
        <Badge variant="outline" className="bg-gray-100 text-gray-800">
          <Flag className="h-3 w-3 mr-1 text-gray-500" />
          {otherFlagNote}
        </Badge>
      )}
    </div>
  );
};

export default FlagSelection;
