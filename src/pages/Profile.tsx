
import React from 'react';
import MainLayout from '@/layouts/MainLayout';
import ProfileForm from '@/components/profile/ProfileForm';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthProvider';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const Profile = () => {
  const { user } = useAuth();
  
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
            <p className="text-muted-foreground mt-2">
              Manage your breeder profile information
            </p>
          </div>
          <Separator />
          
          {user && <ProfileForm userId={user.id} />}
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default Profile;
