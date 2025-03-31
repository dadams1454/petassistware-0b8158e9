
import React from 'react';
import { FormLabel } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface ReceiptUploadProps {
  receiptFile: File | null;
  onFileChange: (file: File | null) => void;
}

const ReceiptUpload: React.FC<ReceiptUploadProps> = ({ receiptFile, onFileChange }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileChange(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <FormLabel>Receipt (Optional)</FormLabel>
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById('receipt-upload')?.click()}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          {receiptFile ? 'Change Receipt' : 'Upload Receipt'}
        </Button>
        <input
          id="receipt-upload"
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      {receiptFile && (
        <p className="text-sm text-muted-foreground">
          Selected file: {receiptFile.name}
        </p>
      )}
    </div>
  );
};

export default ReceiptUpload;
