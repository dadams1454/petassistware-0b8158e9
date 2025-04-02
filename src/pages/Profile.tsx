
import React from 'react';
import PageContainer from '@/components/common/PageContainer';
import { PageHeader } from '@/components/ui/standardized';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileForm } from '@/components/profile/ProfileForm';

const Profile: React.FC = () => {
  return (
    <PageContainer>
      <div className="container mx-auto py-6 px-4">
        <PageHeader 
          title="Your Profile"
          subtitle="Manage your account information and preferences"
          className="mb-6"
        />
        
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Profile Information</h2>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="details" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="details">Personal Details</TabsTrigger>
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-4">
                  <ProfileForm />
                </TabsContent>
                
                <TabsContent value="preferences" className="space-y-4">
                  <div className="text-center p-4">
                    <p>Preferences settings will be available soon.</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="security" className="space-y-4">
                  <div className="text-center p-4">
                    <p>Security settings will be available soon.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default Profile;
