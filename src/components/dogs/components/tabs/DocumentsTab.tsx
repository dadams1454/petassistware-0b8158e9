
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Download, Trash2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DogProfile } from '@/types/dog';

interface DocumentsTabProps {
  dogId: string;
  dog?: DogProfile;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ dogId, dog }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Dog Documents</h3>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" /> Add Document
        </Button>
      </div>
      
      <Alert variant="default" className="bg-muted">
        <AlertDescription>
          Upload and manage important documents related to this dog.
        </AlertDescription>
      </Alert>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-md">Documents</CardTitle>
          <CardDescription>Manage all documents related to this dog</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted">
                <tr>
                  <th scope="col" className="px-4 py-2">Title</th>
                  <th scope="col" className="px-4 py-2">Type</th>
                  <th scope="col" className="px-4 py-2">Date</th>
                  <th scope="col" className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-center">
                  <td colSpan={4} className="py-4 text-muted-foreground">
                    <div className="flex flex-col items-center justify-center">
                      <FileText className="h-8 w-8 mb-2" />
                      <p>No documents found</p>
                      <Button variant="link" size="sm" className="mt-2">
                        <Plus className="h-4 w-4 mr-1" /> Add your first document
                      </Button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentsTab;
