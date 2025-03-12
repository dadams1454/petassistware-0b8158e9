
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PlusCircle, Edit, Trash, FileText, Search, MessageSquare, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { supabase, CommunicationTemplatesRow } from '@/integrations/supabase/client';
import TemplateDialog from './TemplateDialog';
import DeleteTemplateDialog from './DeleteTemplateDialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const CommunicationTemplates = () => {
  const [templateToEdit, setTemplateToEdit] = useState<CommunicationTemplatesRow | null>(null);
  const [templateToDelete, setTemplateToDelete] = useState<CommunicationTemplatesRow | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const { data: templates, isLoading, error, refetch } = useQuery({
    queryKey: ['communication-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('communication_templates')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data as CommunicationTemplatesRow[];
    }
  });

  if (error) {
    toast({
      title: "Error loading templates",
      description: (error as Error).message,
      variant: "destructive"
    });
  }

  const filteredTemplates = templates?.filter(template => {
    const matchesSearch = !searchTerm || 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (template.subject && template.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
      template.content.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesType = typeFilter === 'all' || template.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const handleEditTemplate = (template: CommunicationTemplatesRow) => {
    setTemplateToEdit(template);
  };

  const handleDeleteTemplate = (template: CommunicationTemplatesRow) => {
    setTemplateToDelete(template);
  };

  const handleTemplateUpdated = () => {
    refetch();
    setTemplateToEdit(null);
    setIsCreateDialogOpen(false);
  };

  const handleTemplateDeleted = () => {
    refetch();
    setTemplateToDelete(null);
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
  };

  const hasActiveFilters = searchTerm || typeFilter !== 'all';

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Communication Templates</h2>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!filteredTemplates || filteredTemplates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {hasActiveFilters ? 
                      "No templates match your search" : 
                      "No templates found. Create your first template to get started."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredTemplates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        {template.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={template.type === 'email' ? 'default' : 'secondary'}>
                        {template.type === 'email' ? (
                          <Mail className="h-3 w-3 mr-1" />
                        ) : (
                          <MessageSquare className="h-3 w-3 mr-1" />
                        )}
                        {template.type === 'email' ? 'Email' : 'SMS'}
                      </Badge>
                    </TableCell>
                    <TableCell>{template.subject || '-'}</TableCell>
                    <TableCell>{new Date(template.updated_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleEditTemplate(template)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteTemplate(template)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {/* Create Template Dialog */}
      {isCreateDialogOpen && (
        <TemplateDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSuccess={handleTemplateUpdated}
        />
      )}

      {/* Edit Template Dialog */}
      {templateToEdit && (
        <TemplateDialog
          template={templateToEdit}
          open={!!templateToEdit}
          onOpenChange={(open) => !open && setTemplateToEdit(null)}
          onSuccess={handleTemplateUpdated}
        />
      )}

      {/* Delete Template Dialog */}
      {templateToDelete && (
        <DeleteTemplateDialog
          template={templateToDelete}
          open={!!templateToDelete}
          onOpenChange={(open) => !open && setTemplateToDelete(null)}
          onSuccess={handleTemplateDeleted}
        />
      )}
    </Card>
  );
};

export default CommunicationTemplates;
