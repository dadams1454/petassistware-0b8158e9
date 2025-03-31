
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { customSupabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Calendar, Baby } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import PuppyAgeGroupList from './puppies/PuppyAgeGroupList';
import { usePuppyTracking } from '@/hooks/usePuppyTracking';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PuppiesTabProps {
  onRefresh: () => void;
}

const PuppiesTab: React.FC<PuppiesTabProps> = ({ onRefresh }) => {
  const navigate = useNavigate();
  const { 
    puppies, 
    ageGroups, 
    puppiesByAgeGroup,
    puppyStats,
    isLoading, 
    error 
  } = usePuppyTracking();
  
  const handleGoToLitters = () => {
    navigate('/litters');
  };
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Puppy Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertDescription>
            Error loading puppy data: {error}
            <Button variant="outline" size="sm" className="ml-4" onClick={onRefresh}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  const puppyCount = puppies?.length || 0;
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <div>
            <CardTitle className="text-lg">Puppy Management</CardTitle>
            <CardDescription>
              Manage puppies and their development
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-0"
            onClick={handleGoToLitters}
          >
            <Calendar className="h-4 w-4 mr-2" />
            View Litters
          </Button>
        </CardHeader>
        <CardContent>
          {puppyCount > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-green-50 dark:bg-green-900/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Active Puppies</p>
                        <p className="text-2xl font-bold">{puppyStats.totalPuppies}</p>
                      </div>
                      <Baby className="h-8 w-8 text-green-500 opacity-70" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-blue-50 dark:bg-blue-900/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Active Litters</p>
                        <p className="text-2xl font-bold">{puppyStats.activeLitters}</p>
                      </div>
                      <Calendar className="h-8 w-8 text-blue-500 opacity-70" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-purple-50 dark:bg-purple-900/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Upcoming Vaccines</p>
                        <p className="text-2xl font-bold">{puppyStats.upcomingVaccinations}</p>
                      </div>
                      <Badge variant="outline" className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">Next 7 days</Badge>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-amber-50 dark:bg-amber-900/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Recent Weight Checks</p>
                        <p className="text-2xl font-bold">{puppyStats.recentWeightChecks}</p>
                      </div>
                      <Badge variant="outline" className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">Last 48 hours</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Show puppies by age group */}
              <PuppyAgeGroupList 
                puppiesByAgeGroup={puppiesByAgeGroup} 
                ageGroups={ageGroups} 
              />
            </div>
          ) : (
            <div className="text-center py-8">
              <Baby className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                No active puppies found. Visit the Litters page to manage breeding cycles and add new litters.
              </p>
              <Button onClick={handleGoToLitters}>
                Go to Litters & Breeding
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PuppiesTab;
