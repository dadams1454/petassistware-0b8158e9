
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { format, differenceInDays, isAfter } from 'date-fns';
import { Baby, Plus, Search, Heart, Puppy } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Litter } from '@/types/litter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const LittersManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('active');
  
  // Fetch litters data
  const { data: allLitters = [], isLoading } = useQuery({
    queryKey: ['litters'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('litters')
        .select(`
          *,
          dam:dam_id(*),
          sire:sire_id(*),
          puppies:puppies(*)
        `)
        .order('birth_date', { ascending: false });
        
      if (error) throw error;
      return data as Litter[];
    }
  });
  
  // Filter and group litters
  const filterLitters = (litters: Litter[]) => {
    return litters.filter(litter => {
      // Filter by search term
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === '' || 
        (litter.litter_name && litter.litter_name.toLowerCase().includes(searchLower)) ||
        (litter.dam?.name && litter.dam.name.toLowerCase().includes(searchLower)) ||
        (litter.sire?.name && litter.sire.name.toLowerCase().includes(searchLower));
      
      // Filter by status if not "all"
      const matchesStatus = statusFilter === 'all' || litter.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  };
  
  // Group litters by active/archive status
  const today = new Date();
  const activeLitters = filterLitters(allLitters.filter(litter => {
    const birthDate = new Date(litter.birth_date);
    const puppyAge = differenceInDays(today, birthDate);
    // Puppies less than 12 weeks old are considered active
    return puppyAge < 84 && litter.status !== 'archived';
  }));
  
  const archivedLitters = filterLitters(allLitters.filter(litter => {
    const birthDate = new Date(litter.birth_date);
    const puppyAge = differenceInDays(today, birthDate);
    // Puppies more than 12 weeks old or explicitly archived
    return puppyAge >= 84 || litter.status === 'archived';
  }));
  
  // For active whelping, look for litters less than 1 week old
  const activeWhelping = filterLitters(allLitters.filter(litter => {
    const birthDate = new Date(litter.birth_date);
    const puppyAge = differenceInDays(today, birthDate);
    return puppyAge <= 7;
  }));
  
  // For planned litters (future birth dates)
  const plannedLitters = filterLitters(allLitters.filter(litter => {
    return isAfter(new Date(litter.birth_date), today);
  }));
  
  const displayedLitters = activeTab === 'active' 
    ? activeLitters 
    : activeTab === 'archived' 
      ? archivedLitters 
      : activeTab === 'whelping' 
        ? activeWhelping
        : plannedLitters;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Litter Management</h2>
        <Button onClick={() => navigate('/reproduction/litters/new')}>
          <Plus className="mr-2 h-4 w-4" /> Add Litter
        </Button>
      </div>
      
      {/* Filters and search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search litters..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      {/* Litter tabs and listings */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active" className="flex gap-2 items-center">
            <Baby className="h-4 w-4" /> 
            <span>Active ({activeLitters.length})</span>
          </TabsTrigger>
          <TabsTrigger value="whelping" className="flex gap-2 items-center">
            <Heart className="h-4 w-4" /> 
            <span>Whelping ({activeWhelping.length})</span>
          </TabsTrigger>
          <TabsTrigger value="planned" className="flex gap-2 items-center">
            <Calendar className="h-4 w-4" /> 
            <span>Planned ({plannedLitters.length})</span>
          </TabsTrigger>
          <TabsTrigger value="archived" className="flex gap-2 items-center">
            <Archive className="h-4 w-4" /> 
            <span>Archived ({archivedLitters.length})</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="pt-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-pulse text-center">
                <p className="text-muted-foreground">Loading litters...</p>
              </div>
            </div>
          ) : displayedLitters.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedLitters.map((litter) => (
                <Card key={litter.id} className="overflow-hidden">
                  <div className="h-40 bg-gray-100 flex items-center justify-center">
                    {litter.documents_url ? (
                      <img 
                        src={litter.documents_url} 
                        alt={litter.litter_name || 'Litter Photo'} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Puppy className="h-16 w-16 text-gray-400" />
                    )}
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg">
                      {litter.litter_name || 'Unnamed Litter'}
                    </h3>
                    
                    <div className="mt-2 space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Dam:</span>
                        <span>{litter.dam?.name || 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sire:</span>
                        <span>{litter.sire?.name || 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Birth Date:</span>
                        <span>{format(new Date(litter.birth_date), 'MMM d, yyyy')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Puppies:</span>
                        <span>
                          {litter.puppies?.length || 0} 
                          {litter.male_count !== undefined && litter.female_count !== undefined && (
                            ` (${litter.male_count}M/${litter.female_count}F)`
                          )}
                        </span>
                      </div>
                      {activeTab === 'active' && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Age:</span>
                          <span>
                            {differenceInDays(today, new Date(litter.birth_date))} days
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 flex">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => navigate(`/reproduction/litters/${litter.id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Baby className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No litters found</h3>
              <p className="mt-2 text-muted-foreground">
                {activeTab === 'active' 
                  ? "You don't have any active litters at the moment."
                  : activeTab === 'whelping'
                    ? "No active whelping sessions. Start a new whelping session when a dam gives birth."
                    : activeTab === 'planned'
                      ? "No planned litters. Add a litter with a future birth date to start planning."
                      : "No archived litters found."}
              </p>
              <Button className="mt-4" onClick={() => navigate('/reproduction/litters/new')}>
                <Plus className="mr-2 h-4 w-4" /> Create New Litter
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LittersManagement;
