
import React from 'react';
import PageContainer from '@/components/common/PageContainer';
import { PageHeader } from '@/components/ui/standardized';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const AdminSchemaPage: React.FC = () => {
  return (
    <PageContainer>
      <div className="container mx-auto py-6 px-4">
        <PageHeader 
          title="Database Schema"
          subtitle="View and explore your database entity relationship diagram (ERD)"
          className="mb-6"
        />
        
        <Card>
          <CardHeader>
            <CardTitle>Entity Relationship Diagram</CardTitle>
            <CardDescription>
              Visual representation of your database tables and their relationships
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md p-6 bg-muted min-h-[500px] flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  Interactive database schema visualization coming soon
                </p>
                <p className="text-sm text-muted-foreground">
                  This feature will display tables, relationships, and allow you to explore your data model
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Tables</CardTitle>
              <CardDescription>
                List of all tables in your database
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 border rounded-md bg-muted">
                <p className="font-mono text-sm">Coming soon: Table list with column details</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Relationships</CardTitle>
              <CardDescription>
                Table relationships and foreign key constraints
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 border rounded-md bg-muted">
                <p className="font-mono text-sm">Coming soon: Relationship mapping and visualization</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default AdminSchemaPage;
