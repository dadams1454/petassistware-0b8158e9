
import React from 'react';
import PageContainer from '@/components/common/PageContainer';
import { PageHeader } from '@/components/ui/standardized';

const ProfilePage = () => {
  return (
    <PageContainer>
      <div className="container mx-auto py-6">
        <PageHeader 
          title="Your Profile"
          subtitle="Manage your account information"
        />
        
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h3 className="font-semibold text-lg mb-4">Profile Information</h3>
          <p className="text-muted-foreground mb-4">Update your profile information</p>
          
          {/* Profile form will go here */}
          <div className="border border-dashed border-gray-300 rounded-md p-4 bg-gray-50">
            <p className="text-center text-gray-500">Profile form placeholder</p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default ProfilePage;
