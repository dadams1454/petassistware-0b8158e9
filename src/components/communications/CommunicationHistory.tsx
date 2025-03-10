
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Mail, MessageSquare, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase, CustomerCommunicationsRow } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import ViewCommunicationDialog from './ViewCommunicationDialog';

const CommunicationHistory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [communicationToView, setCommunicationToView] = useState<any>(null);

  const { data: communications, isLoading, error } = useQuery({
    queryKey: ['customer-communications'],
    queryFn: async () => {
      // We need to cast this as any since the table isn't in the generated types yet
      const { data, error } = await (supabase as any)
        .from('customer_communications')
        .select(`
          *,
          customers:customer_id (
            first_name, 
            last_name, 
            email
          )
        `)
        .order('sent_at', { ascending: false });
      
      if (error) throw error;
      return data as CustomerCommunicationsRow[];
    }
  });

  if (error) {
    toast({
      title: "Error loading communications",
      description: (error as Error).message,
      variant: "destructive"
    });
  }

  const filteredCommunications = communications?.filter(comm => {
    const searchLower = searchTerm.toLowerCase();
    const customerName = comm.customers ? `${comm.customers.first_name} ${comm.customers.last_name}`.toLowerCase() : '';
    const content = comm.content?.toLowerCase() || '';
    const subject = comm.subject?.toLowerCase() || '';
    
    return (
      customerName.includes(searchLower) ||
      content.includes(searchLower) ||
      subject.includes(searchLower)
    );
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search communications..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date Sent</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCommunications?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    {searchTerm ? "No communications match your search" : "No communications have been sent yet"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredCommunications?.map((comm) => (
                  <TableRow key={comm.id}>
                    <TableCell className="whitespace-nowrap">
                      {formatDate(comm.sent_at)}
                    </TableCell>
                    <TableCell>
                      {comm.type === 'email' ? (
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>Email</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <MessageSquare className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>SMS</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {comm.customers ? `${comm.customers.first_name} ${comm.customers.last_name}` : 'Unknown'}
                    </TableCell>
                    <TableCell>
                      {comm.type === 'email' ? (
                        <div>
                          <div className="font-medium">{truncateText(comm.subject || 'No subject', 30)}</div>
                          <div className="text-muted-foreground text-xs">{truncateText(comm.content, 50)}</div>
                        </div>
                      ) : (
                        <div>{truncateText(comm.content, 50)}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={comm.status === 'sent' ? 'default' : 
                               comm.status === 'failed' ? 'destructive' : 'outline'}
                      >
                        {comm.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setCommunicationToView(comm)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {/* View Communication Dialog */}
      {communicationToView && (
        <ViewCommunicationDialog
          communication={communicationToView}
          open={!!communicationToView}
          onOpenChange={(open) => !open && setCommunicationToView(null)}
        />
      )}
    </Card>
  );
};

export default CommunicationHistory;
