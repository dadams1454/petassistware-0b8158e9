
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, CalendarDays, Dna, PersonStanding } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GeneticBreedingRecommendations from '@/components/breeding/GeneticBreedingRecommendations';

const BreedingDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Breeding Management</h1>
        <div className="flex gap-2">
          <Button 
            onClick={() => navigate("/reproduction/breeding/pairing-analysis")}
            variant="outline"
            className="gap-2"
          >
            <Dna className="h-4 w-4" />
            Genetic Pairing Analysis
          </Button>
          <Button 
            onClick={() => {/* Navigate to create breeding plan */}}
            className="gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            New Breeding Plan
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <PersonStanding className="h-5 w-5 mr-2 text-primary" />
              Active Females
            </CardTitle>
            <CardDescription>
              Female dogs in breeding program
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">5</div>
            <p className="text-sm text-muted-foreground">2 currently in heat</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <PersonStanding className="h-5 w-5 mr-2 text-primary" />
              Active Males
            </CardTitle>
            <CardDescription>
              Male dogs in breeding program
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3</div>
            <p className="text-sm text-muted-foreground">All available for breeding</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <CalendarDays className="h-5 w-5 mr-2 text-primary" />
              Upcoming Breedings
            </CardTitle>
            <CardDescription>
              Planned breeding events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2</div>
            <p className="text-sm text-muted-foreground">Next: May 15, 2023</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="active">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="active">Active Plans</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Heats</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Breeding Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-6">
                <p className="text-muted-foreground">
                  No active breeding plans.
                </p>
                <Button className="mt-4" onClick={() => navigate("/reproduction/breeding/pairing-analysis")}>
                  Start New Breeding Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Completed Breeding Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-6">
                <p className="text-muted-foreground">
                  No completed breeding plans.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Heat Cycles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-6">
                <p className="text-muted-foreground">
                  No upcoming heat cycles.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analysis">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GeneticBreedingRecommendations />
            
            <Card>
              <CardHeader>
                <CardTitle>Breeding Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-6">
                  <p className="text-muted-foreground">
                    No breeding performance data available.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BreedingDashboard;
