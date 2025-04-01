
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageContainer from '@/components/common/PageContainer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartBar, ChartLine, CalendarCheck, UserRound, Search } from 'lucide-react';
import { usePuppyDetail } from '@/hooks/usePuppyDetail';
import { usePuppyData } from '@/hooks/puppies/usePuppyData';
import { LoadingState, ErrorState } from '@/components/ui/standardized';
import PuppyGrowthDashboard from '@/components/puppies/growth/PuppyGrowthDashboard';
import VaccinationDashboard from '@/components/puppies/vaccination/VaccinationDashboard';
import SocializationDashboard from '@/components/puppies/socialization/SocializationDashboard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { PuppyWithAge } from '@/types/puppyTracking';

const PuppyDashboard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('growth');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLitter, setSelectedLitter] = useState('');
  const [litters, setLitters] = useState<{ id: string, name: string }[]>([]);
  
  // If we have an ID, we're in detail view, otherwise we're in list view
  const isDetailView = !!id;
  
  // For detail view
  const puppyQuery = isDetailView ? usePuppyDetail(id || '') : { isLoading: false, error: null, data: null };
  
  // For list view
  const { puppies, isLoading: allPuppiesLoading, error: allPuppiesError } = usePuppyData();
  
  // Fetch litters for the filter dropdown
  useEffect(() => {
    const fetchLitters = async () => {
      const { data, error } = await supabase
        .from('litters')
        .select('id, litter_name')
        .order('birth_date', { ascending: false });
      
      if (!error && data) {
        setLitters(data.map(litter => ({
          id: litter.id,
          name: litter.litter_name || `Litter ${litter.id.slice(0, 4)}`
        })));
      }
    };
    
    fetchLitters();
  }, []);
  
  // Filter puppies based on search term and selected litter
  const filteredPuppies = React.useMemo(() => {
    return puppies.filter(puppy => {
      const nameMatch = puppy.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
      const litterMatch = selectedLitter ? puppy.litter_id === selectedLitter : true;
      return nameMatch && litterMatch;
    });
  }, [puppies, searchTerm, selectedLitter]);
  
  // Handle navigation to puppy detail
  const handlePuppyClick = (puppyId: string) => {
    navigate(`/puppies/${puppyId}`);
  };
  
  // Detail View
  if (isDetailView) {
    if (puppyQuery.isLoading) {
      return (
        <PageContainer>
          <LoadingState message="Loading puppy dashboard..." />
        </PageContainer>
      );
    }
    
    if (puppyQuery.error || !puppyQuery.data) {
      return (
        <PageContainer>
          <ErrorState 
            title="Error Loading Puppy Data" 
            message="Could not load the puppy information. Please try again."
            onAction={() => navigate('/puppies')}
            actionLabel="Back to Puppies"
          />
        </PageContainer>
      );
    }
    
    const puppy = puppyQuery.data;
    
    return (
      <PageContainer>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">
                {puppy.name || `Puppy #${puppy.birth_order || ''}`}
              </h1>
              <p className="text-muted-foreground">
                Growth and development tracking dashboard - {puppy.ageInDays} days old
              </p>
            </div>
            
            <Button variant="outline" onClick={() => navigate('/puppies')}>
              Back to Puppies
            </Button>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 md:w-[500px]">
              <TabsTrigger value="growth" className="flex items-center">
                <ChartLine className="h-4 w-4 mr-2" />
                Growth
              </TabsTrigger>
              <TabsTrigger value="vaccinations" className="flex items-center">
                <CalendarCheck className="h-4 w-4 mr-2" />
                Vaccinations
              </TabsTrigger>
              <TabsTrigger value="socialization" className="flex items-center">
                <UserRound className="h-4 w-4 mr-2" />
                Socialization
              </TabsTrigger>
              <TabsTrigger value="overview" className="flex items-center">
                <ChartBar className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="growth" className="pt-4">
              <PuppyGrowthDashboard puppyId={id || ''} />
            </TabsContent>
            
            <TabsContent value="vaccinations" className="pt-4">
              <VaccinationDashboard puppyId={id || ''} />
            </TabsContent>
            
            <TabsContent value="socialization" className="pt-4">
              <SocializationDashboard puppyId={id || ''} />
            </TabsContent>
            
            <TabsContent value="overview" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Puppy Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">{puppy.name || 'Unnamed'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Gender</p>
                      <p className="font-medium">{puppy.gender || 'Unknown'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Color</p>
                      <p className="font-medium">{puppy.color || 'Unknown'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Birth Date</p>
                      <p className="font-medium">
                        {puppy.birth_date 
                          ? format(new Date(puppy.birth_date), 'MMM d, yyyy')
                          : puppy.litter?.birth_date 
                            ? format(new Date(puppy.litter.birth_date), 'MMM d, yyyy')
                            : 'Unknown'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Birth Weight</p>
                      <p className="font-medium">{puppy.birth_weight || 'Not recorded'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Current Weight</p>
                      <p className="font-medium">{puppy.current_weight || 'Not recorded'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="font-medium">{puppy.status || 'Unknown'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Microchip ID</p>
                      <p className="font-medium">{puppy.microchip_id || 'Not recorded'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </PageContainer>
    );
  }
  
  // List View
  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h1 className="text-3xl font-bold">Puppies</h1>
          <Button onClick={() => navigate('/litters')}>
            View Litters
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Puppy Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search puppies by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                
                <Select
                  value={selectedLitter}
                  onValueChange={setSelectedLitter}
                >
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="All Litters" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Litters</SelectItem>
                    {litters.map((litter) => (
                      <SelectItem key={litter.id} value={litter.id}>
                        {litter.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Puppies Table */}
              {allPuppiesLoading ? (
                <LoadingState message="Loading puppies..." />
              ) : allPuppiesError ? (
                <ErrorState 
                  title="Error Loading Puppies" 
                  message="Could not load the puppies. Please try again."
                />
              ) : filteredPuppies.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No puppies found matching your filters.</p>
                </div>
              ) : (
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Litter</TableHead>
                        <TableHead>Birth Date</TableHead>
                        <TableHead>Age</TableHead>
                        <TableHead>Weight</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPuppies.map((puppy) => (
                        <TableRow 
                          key={puppy.id} 
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handlePuppyClick(puppy.id)}
                        >
                          <TableCell className="font-medium">
                            {puppy.name || `Puppy #${puppy.id.slice(0, 4)}`}
                          </TableCell>
                          <TableCell>
                            {puppy.litters?.name || puppy.litter_id.slice(0, 8)}
                          </TableCell>
                          <TableCell>
                            {puppy.birth_date 
                              ? format(new Date(puppy.birth_date), 'MMM d, yyyy')
                              : puppy.litters?.birth_date 
                                ? format(new Date(puppy.litters.birth_date), 'MMM d, yyyy')
                                : 'Unknown'}
                          </TableCell>
                          <TableCell>{puppy.ageInDays} days</TableCell>
                          <TableCell>{puppy.current_weight || 'Not recorded'}</TableCell>
                          <TableCell>
                            <StatusBadge status={puppy.status} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

// Helper component for status badges
const StatusBadge: React.FC<{ status?: string }> = ({ status }) => {
  switch (status?.toLowerCase()) {
    case 'available':
      return <Badge className="bg-green-500">Available</Badge>;
    case 'reserved':
      return <Badge className="bg-amber-500">Reserved</Badge>;
    case 'sold':
      return <Badge className="bg-blue-500">Sold</Badge>;
    case 'unavailable':
      return <Badge className="bg-gray-500">Unavailable</Badge>;
    default:
      return <Badge className="bg-gray-400">{status || 'Unknown'}</Badge>;
  }
};

export default PuppyDashboard;
