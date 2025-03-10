
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PlusCircle, Edit, Trash } from 'lucide-react';
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
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import TemplateDialog from './TemplateDialog';
import DeleteTemplateDialog from './DeleteTemplateDialog';

const CommunicationTemplates = () => {
  const [templateToEdit, setTemplateToEdit] = useState<any>(null);
  const [templateToDelete, setTemplateToDelete] = useState<any>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: templates, isLoading, error, refetch } = useQuery({
    queryKey: ['communication-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('communication_templates')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  if (error) {
    toast({
      title: "Error loading templates",
      description: error.message,
      variant: "destructive"
    });
  }

  const handleEditTemplate = (template: any) => {
    setTemplateToEdit(template);
  };

  const handleDeleteTemplate = (template: any) => {
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
              {templates && templates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No templates found. Create your first template to get started.
                  </TableCell>
                </TableRow>
              ) : (
                templates?.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell className="font-medium">{template.name}</TableCell>
                    <TableCell>
                      <Badge variant={template.type === 'email' ? 'default' : 'secondary'}>
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
