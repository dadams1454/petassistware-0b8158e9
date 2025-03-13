
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { Puppy } from '@/components/litters/puppies/types';
import { WelpingPuppiesTable } from './WelpingPuppiesTable';

interface WelpingPuppyListProps {
  puppies: Puppy[];
  onRefresh: () => Promise<void>;
}

const WelpingPuppyList: React.FC<WelpingPuppyListProps> = ({ puppies, onRefresh }) => {
  if (puppies.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <AlertTriangle className="h-12 w-12 text-amber-500" />
            <h3 className="text-lg font-medium">No Puppies Recorded Yet</h3>
            <p className="text-muted-foreground max-w-md">
              You haven't recorded any puppies for this litter yet. Use the "Record New Puppy" tab to start recording puppies as they are born.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Recorded Puppies</CardTitle>
      </CardHeader>
      <CardContent>
        <WelpingPuppiesTable puppies={puppies} onRefresh={onRefresh} />
      </CardContent>
    </Card>
  );
};

export default WelpingPuppyList;
