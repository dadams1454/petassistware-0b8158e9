
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const ProfileForm: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Edit your profile information here
        </p>
      </CardContent>
    </Card>
  );
};
