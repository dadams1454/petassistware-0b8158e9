
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays } from 'lucide-react';
import { DogProfile } from '@/types/dog';
import { useQuery } from '@tanstack/react-query';
import { fetchDogGroups, fetchGroupMembers } from '@/services/dailyCare/dogGroupsService';

interface GroupsCardProps {
  dog: DogProfile;
}

const GroupsCard: React.FC<GroupsCardProps> = ({ dog }) => {
  const { data: groups } = useQuery({
    queryKey: ['dogGroups'],
    queryFn: fetchDogGroups,
  });

  const { data: memberships } = useQuery({
    queryKey: ['dogGroupMembers', dog.id],
    queryFn: async () => {
      const allGroups = await fetchDogGroups();
      const memberPromises = allGroups.map(async (group) => {
        const members = await fetchGroupMembers(group.id);
        return {
          group,
          isMember: members.some(member => member.dog_id === dog.id)
        };
      });
      return Promise.all(memberPromises);
    },
    enabled: !!groups,
  });

  const dogGroups = memberships?.filter(m => m.isMember).map(m => m.group) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CalendarDays className="mr-2 h-5 w-5" />
          Groups & Assignments
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-2">Assigned Groups:</p>
        {dogGroups.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {dogGroups.map(group => (
              <span 
                key={group.id} 
                className="px-3 py-1 rounded-full text-sm"
                style={{ 
                  backgroundColor: group.color ? `${group.color}20` : '#e0f2fe',
                  color: group.color || '#1e40af'
                }}
              >
                {group.name}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Not assigned to any groups</p>
        )}
      </CardContent>
    </Card>
  );
};

export default GroupsCard;
