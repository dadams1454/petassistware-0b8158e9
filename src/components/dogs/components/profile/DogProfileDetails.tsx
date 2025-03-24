
import React from 'react';
import { DogProfile } from '@/types/dog';
import BasicInfoCard from './details/BasicInfoCard';
import RegistrationCard from './details/RegistrationCard';
import GroupsCard from './details/GroupsCard';
import NotesCard from './details/NotesCard';

interface DogProfileDetailsProps {
  dog: DogProfile;
}

const DogProfileDetails: React.FC<DogProfileDetailsProps> = ({ dog }) => {
  return (
    <div className="space-y-6">
      <BasicInfoCard dog={dog} />
      <RegistrationCard dog={dog} />
      <GroupsCard dog={dog} />
      <NotesCard notes={dog.notes} />
    </div>
  );
};

export default DogProfileDetails;
