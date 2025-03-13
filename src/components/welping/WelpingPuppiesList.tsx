
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Puppy } from '@/components/litters/puppies/types';
import { Dog } from 'lucide-react';
import EmptyState from '@/components/ui/empty-state';
import { WelpingPuppiesTable } from './WelpingPuppiesTable';

interface WelpingPuppyListProps {
  puppies: Puppy[];
  onRefresh: () => Promise<void>;
}

const WelpingPuppyList: React.FC<WelpingPuppyListProps> = ({ puppies, onRefresh }) => {
  // Sort puppies by birth time or created_at to show in chronological order
  const sortedPuppies = [...puppies].sort((a, b) => {
    // Use birth time if available, otherwise use created_at
    const aTime = a.birth_time ? new Date(`2000-01-01T${a.birth_time}`) : new Date(a.created_at);
    const bTime = b.birth_time ? new Date(`2000-01-01T${b.birth_time}`) : new Date(b.created_at);
    return aTime.getTime() - bTime.getTime();
  });

  if (!puppies.length) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Recorded Puppies</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={<Dog className="h-12 w-12 text-muted-foreground" />}
            title="No puppies recorded yet"
            description="Record your first puppy to start tracking this litter."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Recorded Puppies ({puppies.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <WelpingPuppiesTable puppies={sortedPuppies} onRefresh={onRefresh} />
      </CardContent>
    </Card>
  );
};

export default WelpingPuppyList;
