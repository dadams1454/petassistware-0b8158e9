
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Upload, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Puppy } from '@/types/puppy';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface PuppyProfileProps {
  puppy: Puppy;
  onRefresh?: () => void;
}

const PuppyProfile: React.FC<PuppyProfileProps> = ({ puppy, onRefresh }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Format dates for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not recorded';
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  // Handle photo upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    try {
      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${puppy.id}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `puppies/${fileName}`;
      
      // Upload the file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('puppy-photos')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data } = supabase.storage
        .from('puppy-photos')
        .getPublicUrl(filePath);
      
      // Update the puppy record with the new photo URL
      const { error: updateError } = await supabase
        .from('puppies')
        .update({ photo_url: data.publicUrl })
        .eq('id', puppy.id);
      
      if (updateError) throw updateError;
      
      toast({
        title: 'Photo uploaded successfully',
        description: 'The puppy profile has been updated with the new photo.',
      });
      
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: 'Photo upload failed',
        description: 'There was an error uploading the photo. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Photo Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Photo</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="w-full aspect-square bg-muted rounded-md overflow-hidden mb-4">
              {puppy.photo_url ? (
                <img
                  src={puppy.photo_url}
                  alt={puppy.name || 'Puppy'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                  No photo available
                </div>
              )}
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Upload className="mr-2 h-4 w-4" />
                  {puppy.photo_url ? 'Update Photo' : 'Add Photo'}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Puppy Photo</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                    <input
                      type="file"
                      id="photo-upload"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoUpload}
                      disabled={isUploading}
                    />
                    <label
                      htmlFor="photo-upload"
                      className="cursor-pointer text-primary hover:text-primary-dark"
                    >
                      Click to select a photo
                    </label>
                    <p className="text-sm text-gray-500 mt-2">
                      Recommended: Square images in JPG or PNG format
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
        
        {/* Details Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{puppy.name || 'Unnamed'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gender</p>
                <p className="font-medium">{puppy.gender || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Color</p>
                <p className="font-medium">{puppy.color || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Birth Date</p>
                <p className="font-medium">{formatDate(puppy.birth_date)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Birth Order</p>
                <p className="font-medium">
                  {puppy.birth_order ? `#${puppy.birth_order}` : 'Not recorded'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-medium">{puppy.status || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Birth Weight</p>
                <p className="font-medium">
                  {puppy.birth_weight ? `${puppy.birth_weight} oz` : 'Not recorded'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Weight</p>
                <p className="font-medium">
                  {puppy.current_weight 
                    ? `${puppy.current_weight} ${puppy.weight_unit || 'oz'}` 
                    : 'Not recorded'}
                </p>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Microchip Number</p>
                <p className="font-medium">
                  {puppy.microchip_number || 'Not microchipped'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">AKC Registration</p>
                <p className="font-medium">
                  {puppy.akc_registration_number || 'Not registered'}
                </p>
              </div>
            </div>
            
            {puppy.notes && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Notes</p>
                  <p className="text-sm">{puppy.notes}</p>
                </div>
              </>
            )}
            
            <div className="flex justify-end pt-4">
              <Button variant="outline" onClick={() => window.history.back()} className="mr-2">
                Back
              </Button>
              <Button onClick={() => console.log('Edit puppy')}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PuppyProfile;
