
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload, Image, Camera, FileText } from 'lucide-react';

interface ReceiptUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (data: any) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/heic', 'application/pdf'];

const formSchema = z.object({
  file: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, "File is required")
    .refine(
      (files) => files[0]?.size <= MAX_FILE_SIZE,
      "File size must be less than 5MB"
    )
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files[0]?.type),
      "Only JPEG, PNG, HEIC and PDF files are accepted"
    ),
});

const ReceiptUploadDialog = ({ open, onOpenChange, onUpload }: ReceiptUploadDialogProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const fileUrl = URL.createObjectURL(file);
        setPreviewUrl(fileUrl);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const file = values.file[0];
    onUpload({
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      // In a real application, you would upload the file to your server/storage here
    });
    form.reset();
    setPreviewUrl(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Receipt</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="file"
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <FormLabel>Receipt Image or PDF</FormLabel>
                  <FormControl>
                    <div className="grid gap-2">
                      <Input
                        id="receiptFile"
                        type="file"
                        accept="image/jpeg,image/png,image/heic,application/pdf"
                        className="hidden"
                        onChange={(e) => {
                          onChange(e.target.files);
                          onFileChange(e);
                        }}
                        {...rest}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <label
                          htmlFor="receiptFile"
                          className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-4 hover:border-primary cursor-pointer"
                        >
                          <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                          <div className="text-sm text-center text-muted-foreground">
                            <span className="font-medium">Click to upload</span> or drag and drop
                            <p>JPEG, PNG, HEIC or PDF (max 5MB)</p>
                          </div>
                        </label>
                        
                        {previewUrl ? (
                          <div className="flex items-center justify-center border rounded-md overflow-hidden">
                            <img
                              src={previewUrl}
                              alt="Receipt preview"
                              className="max-h-[150px] object-contain"
                            />
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center border border-dashed rounded-md p-4 text-muted-foreground">
                            <FileText className="h-10 w-10 mb-2" />
                            <p className="text-sm text-center">Receipt preview will appear here</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Upload</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ReceiptUploadDialog;
