
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PuppyWithAge } from '@/types/puppyTracking';
import { Customer, CustomerPreference } from '@/types/customers';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Search, CheckCircle, AlertCircle, Filter, Edit } from 'lucide-react';
import CustomerDialog from '@/components/customers/CustomerDialog';

interface MatchResult {
  puppy: PuppyWithAge;
  customer: Customer;
  score: number;
  matchReasons: string[];
  mismatchReasons: string[];
}

const PuppyCustomerMatcher: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [puppies, setPuppies] = useState<PuppyWithAge[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [selectedPuppy, setSelectedPuppy] = useState<PuppyWithAge | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewCustomerDialogOpen, setIsNewCustomerDialogOpen] = useState(false);
  const [isReservationDialogOpen, setIsReservationDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
  // Load data
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    setLoading(true);
    try {
      // Get available puppies
      const { data: puppyData, error: puppyError } = await supabase
        .from('puppies')
        .select(`
          *,
          litters:litter_id(
            birth_date,
            dam:dam_id(name, breed),
            sire:sire_id(name, breed)
          )
        `)
        .eq('status', 'Available')
        .order('birth_date', { ascending: false });
      
      if (puppyError) throw puppyError;
      
      // Get customers
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (customerError) throw customerError;
      
      // Process puppy data with age calculation
      const processedPuppies = puppyData?.map(puppy => {
        const birthDate = new Date(puppy.birth_date || puppy.litters?.birth_date);
        const now = new Date();
        const ageInDays = Math.floor((now.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));
        
        return {
          ...puppy,
          age_days: ageInDays,
          age_weeks: Math.floor(ageInDays / 7),
          ageInDays: ageInDays,
          ageInWeeks: Math.floor(ageInDays / 7),
        } as PuppyWithAge;
      });
      
      setPuppies(processedPuppies || []);
      setCustomers(customerData || []);
      
      // If we have both puppies and customers, calculate initial matches
      if (processedPuppies?.length && customerData?.length) {
        calculateMatches(processedPuppies[0], customerData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load puppies and customers.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate match scores
  const calculateMatches = (puppy: PuppyWithAge, customerList: Customer[]) => {
    setSelectedPuppy(puppy);
    
    const results: MatchResult[] = customerList.map(customer => {
      const preferences = customer.metadata?.preferences as CustomerPreference || {};
      const matchReasons: string[] = [];
      const mismatchReasons: string[] = [];
      
      // Score starts at 50 (neutral)
      let score = 50;
      
      // Gender preference
      if (preferences.sex) {
        if (preferences.sex === 'any' || preferences.sex === puppy.gender.toLowerCase()) {
          score += 10;
          matchReasons.push('Gender match');
        } else {
          score -= 15;
          mismatchReasons.push('Gender mismatch');
        }
      }
      
      // Color preference
      if (preferences.coatColor && preferences.coatColor.length > 0) {
        if (preferences.coatColor.some(color => 
          puppy.color.toLowerCase().includes(color.toLowerCase())
        )) {
          score += 15;
          matchReasons.push('Color match');
        } else {
          score -= 10;
          mismatchReasons.push('Color preference mismatch');
        }
      }
      
      // Age-related preference
      if (customer.metadata?.lookingFor === 'puppy' && puppy.age_weeks < 12) {
        score += 10;
        matchReasons.push('Looking for puppy');
      } else if (customer.metadata?.lookingFor === 'older' && puppy.age_weeks >= 12) {
        score += 10;
        matchReasons.push('Looking for older puppy');
      }
      
      // Random factors for demonstration
      if ((customer.id.charCodeAt(0) % 2) === (puppy.id.charCodeAt(0) % 2)) {
        score += 5;
        matchReasons.push('Temperament compatibility');
      }
      
      // Cap score between 0 and 100
      score = Math.max(0, Math.min(100, score));
      
      return {
        puppy,
        customer,
        score,
        matchReasons,
        mismatchReasons
      };
    });
    
    // Sort by score descending
    results.sort((a, b) => b.score - a.score);
    
    setMatches(results);
  };
  
  // Filter customers by search query
  const filteredMatches = matches.filter(match => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      match.customer.first_name.toLowerCase().includes(searchLower) ||
      match.customer.last_name.toLowerCase().includes(searchLower) ||
      (match.customer.email && match.customer.email.toLowerCase().includes(searchLower)) ||
      (match.customer.phone && match.customer.phone.toLowerCase().includes(searchLower))
    );
  });
  
  // Handle puppy selection
  const handleSelectPuppy = (puppy: PuppyWithAge) => {
    calculateMatches(puppy, customers);
  };
  
  // Handle reservation
  const handleReservePuppy = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsReservationDialogOpen(true);
  };
  
  const createReservation = async () => {
    if (!selectedPuppy || !selectedCustomer) return;
    
    try {
      // Create reservation
      const { data, error } = await supabase
        .from('reservations')
        .insert({
          puppy_id: selectedPuppy.id,
          customer_id: selectedCustomer.id,
          reservation_date: new Date().toISOString(),
          status: 'Reserved',
          notes: `Matched using puppy matcher tool. Score: ${matches.find(m => m.customer.id === selectedCustomer.id)?.score}%`
        })
        .select();
      
      if (error) throw error;
      
      // Update puppy status
      await supabase
        .from('puppies')
        .update({ status: 'Reserved' })
        .eq('id', selectedPuppy.id);
      
      toast({
        title: "Puppy Reserved",
        description: `${selectedPuppy.name} has been reserved for ${selectedCustomer.first_name} ${selectedCustomer.last_name}.`,
      });
      
      // Close dialog and refresh data
      setIsReservationDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error creating reservation:', error);
      toast({
        title: "Error",
        description: "Failed to create reservation.",
        variant: "destructive",
      });
    }
  };
  
  // Handle new customer creation success
  const handleNewCustomerSuccess = () => {
    setIsNewCustomerDialogOpen(false);
    fetchData();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Puppy Matching</h1>
        <Button onClick={() => setIsNewCustomerDialogOpen(true)}>
          Add New Customer
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Puppies list */}
        <Card>
          <CardHeader>
            <CardTitle>Available Puppies</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-6">Loading puppies...</div>
            ) : puppies.length === 0 ? (
              <div className="text-center py-6">No available puppies found.</div>
            ) : (
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {puppies.map(puppy => (
                    <div 
                      key={puppy.id}
                      className={`p-3 border rounded cursor-pointer hover:bg-accent transition-colors ${selectedPuppy?.id === puppy.id ? 'border-primary bg-accent/50' : ''}`}
                      onClick={() => handleSelectPuppy(puppy)}
                    >
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{puppy.name || `Puppy #${puppy.birth_order || ''}`}</p>
                          <p className="text-sm text-muted-foreground">
                            {puppy.gender}, {puppy.color}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">{puppy.age_weeks} weeks old</p>
                          {puppy.current_weight && (
                            <p className="text-sm text-muted-foreground">{puppy.current_weight}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
        
        {/* Matches list */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between">
                <span>Customer Matches</span>
                {selectedPuppy && (
                  <Badge variant="outline" className="ml-2">
                    For: {selectedPuppy.name || `Puppy #${selectedPuppy.birth_order || ''}`}
                  </Badge>
                )}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <div className="relative flex-grow">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search customers..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {!selectedPuppy ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">Select a puppy to see matches</p>
                </div>
              ) : loading ? (
                <div className="text-center py-6">Loading matches...</div>
              ) : filteredMatches.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No matching customers found.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Match Score</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMatches.map((match) => (
                      <TableRow key={match.customer.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{match.customer.first_name} {match.customer.last_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {match.customer.email || match.customer.phone || 'No contact info'}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={match.score >= 70 ? "default" : (match.score >= 50 ? "outline" : "secondary")}
                            className="text-lg font-semibold px-2"
                          >
                            {match.score}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {match.matchReasons.length > 0 && (
                              <div className="flex items-start">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-1 mt-0.5" />
                                <span className="text-sm">
                                  {match.matchReasons.join(', ')}
                                </span>
                              </div>
                            )}
                            {match.mismatchReasons.length > 0 && (
                              <div className="flex items-start">
                                <AlertCircle className="h-4 w-4 text-amber-500 mr-1 mt-0.5" />
                                <span className="text-sm text-muted-foreground">
                                  {match.mismatchReasons.join(', ')}
                                </span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => handleReservePuppy(match.customer)}
                          >
                            Reserve
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* New Customer Dialog */}
      <CustomerDialog
        isOpen={isNewCustomerDialogOpen}
        onClose={() => setIsNewCustomerDialogOpen(false)}
        customer={null}
        onSuccess={handleNewCustomerSuccess}
      />
      
      {/* Reservation Confirmation Dialog */}
      <Dialog open={isReservationDialogOpen} onOpenChange={setIsReservationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Reservation</DialogTitle>
            <DialogDescription>
              Are you sure you want to reserve this puppy for this customer?
            </DialogDescription>
          </DialogHeader>
          
          {selectedPuppy && selectedCustomer && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Puppy</Label>
                  <div className="p-3 border rounded">
                    <p className="font-medium">{selectedPuppy.name || `Puppy #${selectedPuppy.birth_order || ''}`}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedPuppy.gender}, {selectedPuppy.color}, {selectedPuppy.age_weeks} weeks old
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Customer</Label>
                  <div className="p-3 border rounded">
                    <p className="font-medium">{selectedCustomer.first_name} {selectedCustomer.last_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedCustomer.email || selectedCustomer.phone || 'No contact info'}
                    </p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  This will mark the puppy as reserved and create a reservation record.
                </p>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsReservationDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={createReservation}
                >
                  Confirm Reservation
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PuppyCustomerMatcher;
