
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  PlusCircle, 
  MoreVertical, 
  Baby, 
  Heart, 
  FileText, 
  ArchiveIcon,
  CalendarIcon
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface Litter {
  id: string;
  name: string;
  dam_id: string;
  sire_id: string;
  whelp_date: string;
  expected_date?: string;
  status: 'planned' | 'active' | 'completed' | 'archived';
  puppy_count?: number;
  created_at: string;
  dam?: {
    name: string;
  };
  sire?: {
    name: string;
  };
  documentsUrl?: string; // Changed from documents_url to documentsUrl
}

const useLitters = () => {
  const [litters, setLitters] = useState<Litter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchLitters = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('litters')
        .select(`
          *,
          dam:dam_id(name),
          sire:sire_id(name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setLitters(data || []);
    } catch (err: any) {
      console.error('Error fetching litters:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchLitters();
  }, []);
  
  return { litters, isLoading, error, refetch: fetchLitters };
};

const LittersManagement: React.FC = () => {
  const { litters, isLoading, error, refetch } = useLitters();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active');
  
  const filteredLitters = litters.filter(litter => {
    if (activeTab === 'all') return true;
    return litter.status === activeTab;
  });
  
  const handleCreateLitter = () => {
    navigate('/reproduction/litters/new');
  };
  
  const handleViewLitter = (litterId: string) => {
    navigate(`/reproduction/litters/${litterId}`);
  };
  
  const handleArchiveLitter = async (litterId: string) => {
    try {
      const { error } = await supabase
        .from('litters')
        .update({ status: 'archived' })
        .eq('id', litterId);
      
      if (error) throw error;
      
      refetch();
    } catch (err) {
      console.error('Error archiving litter:', err);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Error loading litters: {error}</p>
        <Button variant="outline" onClick={refetch} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Litters Management</h1>
          <p className="text-muted-foreground">Manage your litters and puppy records</p>
        </div>
        <Button onClick={handleCreateLitter}>
          <PlusCircle className="h-4 w-4 mr-2" />
          New Litter
        </Button>
      </div>

      <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="planned">Planned</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6">
          {filteredLitters.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-muted/10">
              <Baby className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No {activeTab} litters found</h3>
              <p className="text-muted-foreground mt-2">
                {activeTab === 'planned' 
                  ? 'Start planning your next breeding by creating a new litter'
                  : activeTab === 'active'
                  ? 'Create a new litter to track your ongoing whelping'
                  : 'Previous litters will appear here'}
              </p>
              <Button className="mt-6" onClick={handleCreateLitter}>
                <PlusCircle className="h-4 w-4 mr-2" />
                New Litter
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLitters.map((litter) => (
                <Card key={litter.id} className="overflow-hidden">
                  <div className="aspect-video relative bg-muted/20">
                    {litter.documentsUrl ? (
                      <img 
                        src={litter.documentsUrl} 
                        alt={litter.name} 
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Baby className="h-16 w-16 text-muted-foreground/40" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge className={
                        litter.status === 'active' 
                          ? 'bg-green-500' 
                          : litter.status === 'planned' 
                          ? 'bg-blue-500' 
                          : litter.status === 'completed'
                          ? 'bg-purple-500'
                          : 'bg-gray-500'
                      }>
                        {litter.status}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="p-4">
                    <div className="flex justify-between items-start">
                      <CardTitle>{litter.name || 'Unnamed Litter'}</CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewLitter(litter.id)}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/reproduction/litters/${litter.id}/edit`)}>
                            Edit Litter
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleArchiveLitter(litter.id)}>
                            Archive
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardDescription>
                      {litter.dam?.name && litter.sire?.name
                        ? `${litter.dam.name} × ${litter.sire.name}`
                        : 'Unknown parentage'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Date</p>
                        <div className="flex items-center">
                          <CalendarIcon className="h-3 w-3 mr-1" />
                          <p className="text-sm">
                            {litter.whelp_date 
                              ? format(new Date(litter.whelp_date), 'MMM d, yyyy')
                              : litter.expected_date
                              ? `Due ${format(new Date(litter.expected_date), 'MMM d, yyyy')}`
                              : 'Date not set'}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Puppies</p>
                        <div className="flex items-center">
                          <Baby className="h-3 w-3 mr-1" />
                          <p className="text-sm">
                            {typeof litter.puppy_count === 'number' 
                              ? `${litter.puppy_count} ${litter.puppy_count === 1 ? 'puppy' : 'puppies'}`
                              : '—'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 border-t">
                    <Button 
                      variant="ghost" 
                      className="w-full"
                      onClick={() => handleViewLitter(litter.id)}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LittersManagement;
