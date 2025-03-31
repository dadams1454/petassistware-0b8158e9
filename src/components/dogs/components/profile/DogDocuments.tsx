
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DogDocumentsProps {
  dogId: string;
}

const DogDocuments: React.FC<DogDocumentsProps> = ({ dogId }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Documents</CardTitle>
        <Button size="sm" variant="outline">
          <Upload className="h-4 w-4 mr-2" />
          Upload
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <FileText className="h-10 w-10 text-muted-foreground mb-2" />
          <h3 className="font-medium mb-1">No Documents</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Upload registration, health records, and other documents
          </p>
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DogDocuments;
