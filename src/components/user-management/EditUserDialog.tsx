
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UserWithProfile } from '@/types/user';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface EditUserDialogProps {
  open: boolean;
  onClose: () => void;
  user: UserWithProfile;
  currentUserId: string;
  onUserUpdated: () => void;
}

const editUserSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  role: z.string({ required_error: 'Role is required' }),
});

type EditUserFormValues = z.infer<typeof editUserSchema>;

export const EditUserDialog: React.FC<EditUserDialogProps> = ({
  open,
  onClose,
  user,
  currentUserId,
  onUserUpdated,
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      role: user.role || 'viewer',
    },
  });

  const handleUpdateUser = async (values: EditUserFormValues) => {
    setIsSubmitting(true);
    try {
      // Check if trying to remove admin from self
      if (user.id === currentUserId && user.role === 'admin' && values.role !== 'admin') {
        toast({
          title: 'Cannot remove admin role',
          description: 'You cannot remove your own admin role',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }

      const { error } = await supabase
        .from('breeder_profiles')
        .update({
          first_name: values.first_name,
          last_name: values.last_name,
          role: values.role,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: 'User updated',
        description: 'User information has been successfully updated',
      });

      onUserUpdated();
      onClose();
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update user',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user information and permissions
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleUpdateUser)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="First Name" {...field} />
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
                      <Input placeholder="Last Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-1">
              <Label>Email</Label>
              <Input value={user.email} disabled />
            </div>

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={user.id === currentUserId && user.role === 'admin'}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                      <SelectItem value="veterinarian">Veterinarian</SelectItem>
                      <SelectItem value="buyer">Buyer/Client</SelectItem>
                    </SelectContent>
                  </Select>
                  {user.id === currentUserId && user.role === 'admin' && (
                    <p className="text-xs text-muted-foreground">
                      You cannot change your own admin role
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
