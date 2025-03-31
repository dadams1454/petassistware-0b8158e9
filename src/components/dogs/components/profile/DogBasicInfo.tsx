
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DogProfileDetails from './DogProfileDetails';

interface DogBasicInfoProps {
  dog: any;
}

const DogBasicInfo: React.FC<DogBasicInfoProps> = ({ dog }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent>
        <DogProfileDetails dog={dog} />
      </CardContent>
    </Card>
  );
};

export default DogBasicInfo;
