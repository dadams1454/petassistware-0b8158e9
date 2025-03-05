
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CustomButton } from '@/components/ui/custom-button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Upload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Enhanced form schema to include business info
const profileSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  business_name: z.string().optional(),
  profile_image_url: z.string().optional(),
  business_overview: z.string().optional(),
  breeding_experience: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  userId: string;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ userId }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isBusinessInfoLoading, setIsBusinessInfoLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Initialize form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      business_name: '',
      profile_image_url: '',
      business_overview: '',
      breeding_experience: '',
    },
  });

  // Fetch the user profile from Supabase
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('breeder_profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (error) throw error;
        
        if (data) {
          form.reset({
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            business_name: data.business_name || '',
            profile_image_url: data.profile_image_url || '',
            business_overview: data.business_overview || '',
            breeding_experience: data.breeding_experience || '',
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: 'Error',
          description: 'Failed to load profile data. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId, form, toast]);

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    try {
      setIsUploading(true);
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-avatar.${fileExt}`;
      
      // Upload the image
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
        });
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('profile-images')
        .getPublicUrl(fileName);
      
      if (urlData) {
        form.setValue('profile_image_url', urlData.publicUrl);
      }
      
      toast({
        title: 'Success',
        description: 'Profile image uploaded successfully!',
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Handle form submission
  const onSubmit = async (values: ProfileFormValues) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('breeder_profiles')
        .update({
          first_name: values.first_name,
          last_name: values.last_name,
          business_name: values.business_name,
          profile_image_url: values.profile_image_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Your profile has been updated successfully!',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle business info submission
  const handleBusinessInfoSubmit = async () => {
    try {
      setIsBusinessInfoLoading(true);
      
      const { error } = await supabase
        .from('breeder_profiles')
        .update({
          business_overview: form.getValues('business_overview'),
          breeding_experience: form.getValues('breeding_experience'),
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Your business information has been updated successfully!',
      });
    } catch (error) {
      console.error('Error updating business info:', error);
      toast({
        title: 'Error',
        description: 'Failed to update business information. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsBusinessInfoLoading(false);
    }
  };

  const getInitials = () => {
    const firstName = form.watch('first_name');
    const lastName = form.watch('last_name');
    
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    } else if (firstName) {
      return firstName.charAt(0).toUpperCase();
    }
    
    return 'BP'; // Breeder Profile fallback
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your personal details and profile picture
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage 
                    src={form.watch('profile_image_url')} 
                    alt="Profile" 
                  />
                  <AvatarFallback className="text-xl">{getInitials()}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h3 className="text-lg font-medium">Profile Picture</h3>
                  <p className="text-sm text-muted-foreground">
                    Click below to upload a new profile image
                  </p>
                  
                  <div className="mt-2">
                    <label 
                      htmlFor="profile-image" 
                      className="flex cursor-pointer items-center gap-2 text-sm font-medium text-primary hover:underline"
                    >
                      <Upload size={16} />
                      {isUploading ? 'Uploading...' : 'Upload Image'}
                    </label>
                    <input 
                      id="profile-image" 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="sr-only" 
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your first name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="business_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Name (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your kennel or business name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <CustomButton 
                type="submit" 
                isLoading={isLoading}
                fullWidth
              >
                Save Changes
              </CustomButton>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
          <CardDescription>
            Share details about your breeding business
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="business_overview"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Overview</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Share information about your breeding program..."
                        className="h-32" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="breeding_experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Breeding Experience (years)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter years of experience" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="pt-4">
                <CustomButton 
                  variant="primary" 
                  fullWidth 
                  isLoading={isBusinessInfoLoading}
                  onClick={handleBusinessInfoSubmit}
                  type="button"
                >
                  Update Business Info
                </CustomButton>
              </div>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileForm;
