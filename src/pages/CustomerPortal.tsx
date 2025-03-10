
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MainLayout from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { ExternalLink, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CustomerPortal = () => {
  const navigate = useNavigate();
  
  return (
    <MainLayout>
      <div className="container mx-auto py-8 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold">Customer Portal</h1>
            <p className="text-muted-foreground mt-1">
              Manage customer access and communication in one place
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => navigate('/communications')}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Communications
            </Button>
            <Button
              variant="default"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Launch Demo Portal
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="waitlist">Waitlist</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Waitlist Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Active Waitlists:</span>
                      <span className="font-bold">3</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Pending Approval:</span>
                      <span className="font-bold">7</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Approved Customers:</span>
                      <span className="font-bold">12</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline" size="sm">
                    View All Waitlists
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Communication Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Emails Sent (30d):</span>
                      <span className="font-bold">42</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>SMS Sent (30d):</span>
                      <span className="font-bold">18</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Avg. Response Rate:</span>
                      <span className="font-bold">68%</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline" size="sm">
                    View Communication History
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Pending Follow-ups</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Waitlist Contacts:</span>
                      <span className="font-bold">5</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Potential Customers:</span>
                      <span className="font-bold">8</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Past Customers:</span>
                      <span className="font-bold">3</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline" size="sm">
                    See All Follow-ups
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Customer Portal Demo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video relative rounded-md overflow-hidden border bg-secondary/20">
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <h3 className="text-xl font-medium mb-2">Customer Portal Preview</h3>
                    <p className="text-muted-foreground mb-4">
                      This is a preview of what your customers will see when they log in to your breeder portal.
                      Your clients will be able to view puppy details, join waitlists, upload documents, and more.
                    </p>
                    <Button>Launch Demo Portal</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="waitlist">
            <Card>
              <CardHeader>
                <CardTitle>Waitlist Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-muted-foreground">
                  Waitlist management functionality will be implemented in a future update.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="engagement">
            <Card>
              <CardHeader>
                <CardTitle>Customer Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-muted-foreground">
                  Customer engagement tools will be implemented in a future update.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Portal Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-muted-foreground">
                  Portal settings will be implemented in a future update.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default CustomerPortal;
