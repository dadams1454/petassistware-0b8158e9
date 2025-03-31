
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RoleSelector } from '@/components/user-management/RoleSelector';
import { Checkbox } from '@/components/ui/checkbox';

// Form schema
const inviteFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: z.string().min(1, 'Please select a role'),
  isTestUser: z.boolean().default(false),
  generateRandomPassword: z.boolean().default(true),
});

export type InviteFormValues = z.infer<typeof inviteFormSchema>;

interface InviteFormProps {
  onSubmit: (values: InviteFormValues) => void;
  isSubmitting: boolean;
  onCancel: () => void;
}

export function InviteForm({ onSubmit, isSubmitting, onCancel }: InviteFormProps) {
  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      role: 'staff',
      isTestUser: true,
      generateRandomPassword: true,
    },
  });

  // Add suffix for test users
  const handleFormSubmit = (values: InviteFormValues) => {
    // For test users, add a suffix to ensure unique emails
    if (values.isTestUser) {
      const timestamp = new Date().getTime().toString().slice(-4);
      const emailParts = values.email.split('@');
      if (emailParts.length === 2) {
        values.email = `${emailParts[0]}+test${timestamp}@${emailParts[1]}`;
      }
    }
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="First name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Email address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <RoleSelector
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormField
            control={form.control}
            name="isTestUser"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    This is a test user
                  </FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Adds a suffix to the email to ensure uniqueness
                  </p>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="generateRandomPassword"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Generate random password
                  </FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Creates a secure password automatically
                  </p>
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Inviting..." : "Send Invitation"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
