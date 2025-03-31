
import React from 'react';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface PreviewTabProps {
  isGeneratingPdf: boolean;
  pdfUrl: string;
  pdfBytes: Uint8Array | null;
  onDownload: () => void;
}

const PreviewTab: React.FC<PreviewTabProps> = ({
  isGeneratingPdf,
  pdfUrl,
  pdfBytes,
  onDownload,
}) => {
  if (isGeneratingPdf) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Skeleton className="h-[60vh] w-full" />
      </div>
    );
  }

  if (!pdfUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <FileText className="h-16 w-16 text-muted-foreground" />
        <p className="text-muted-foreground">Failed to generate preview</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <iframe 
        src={pdfUrl} 
        className="w-full h-[60vh] border border-gray-200 rounded-md"
        title="Contract Preview"
      />
      
      <div className="mt-4">
        <Button onClick={onDownload} disabled={!pdfBytes}>
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>
    </div>
  );
};

export default PreviewTab;
