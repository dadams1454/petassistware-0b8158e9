
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, CreditCard, Edit, Mail, Phone, User, UserCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import TextareaInput from '@/components/dogs/form/TextareaInput';
import DatePicker from '@/components/dogs/form/DatePicker';

interface BuyerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  depositAmount: string;
  depositDate: Date | null;
  notes: string;
}

interface PuppyBuyerInfoProps {
  puppy: Puppy;
}

const PuppyBuyerInfo: React.FC<PuppyBuyerInfoProps> = ({ puppy }) => {
  const [isEditing, setIsEditing] = useState(false);
  // Demo data - in a real app, this would come from the database
  const [buyerInfo, setBuyerInfo] = useState<BuyerInfo | null>(
    puppy.status === 'Reserved' || puppy.status === 'Sold' ? {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@example.com',
      phone: '(555) 123-4567',
      depositAmount: '500',
      depositDate: new Date(),
      notes: 'Family with two children and a large yard. Looking for a good family dog.'
    } : null
  );

  const form = useForm<BuyerInfo>({
    defaultValues: buyerInfo || {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      depositAmount: '',
      depositDate: null,
      notes: ''
    }
  });

  const handleSaveBuyerInfo = (data: BuyerInfo) => {
    setBuyerInfo(data);
    setIsEditing(false);
    // In a real app, this would save to the database
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Buyer Information
          </CardTitle>
          {puppy.status === 'Reserved' || puppy.status === 'Sold' ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditing(true)}
              className="h-8"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  <User className="h-4 w-4 mr-1" />
                  Add Buyer
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Buyer Information</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSaveBuyerInfo)} className="space-y-4">
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
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="Email address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input placeholder="Phone number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="depositAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Deposit Amount</FormLabel>
                            <FormControl>
                              <Input placeholder="Deposit amount" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DatePicker
                        form={form}
                        name="depositDate"
                        label="Deposit Date"
                      />
                    </div>
                    
                    <TextareaInput
                      form={form}
                      name="notes"
                      label="Notes"
                      placeholder="Additional notes about the buyer"
                    />
                    
                    <Button type="submit">Save Buyer Information</Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {buyerInfo ? (
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-primary h-10 w-10 rounded-full flex items-center justify-center text-primary-foreground">
                {buyerInfo.firstName.charAt(0)}{buyerInfo.lastName.charAt(0)}
              </div>
              <div>
                <h3 className="font-medium">{buyerInfo.firstName} {buyerInfo.lastName}</h3>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Badge variant={puppy.status === 'Sold' ? "success" : "secondary"}>
                    {puppy.status}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{buyerInfo.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{buyerInfo.phone}</span>
              </div>
            </div>
            
            <div className="border-t pt-3 mt-3">
              <div className="flex items-center gap-2 text-sm">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span>Deposit: ${buyerInfo.depositAmount}</span>
              </div>
              {buyerInfo.depositDate && (
                <div className="flex items-center gap-2 text-sm mt-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Date: {format(new Date(buyerInfo.depositDate), 'MMMM d, yyyy')}</span>
                </div>
              )}
            </div>
            
            {buyerInfo.notes && (
              <div className="border-t pt-3 mt-3">
                <p className="text-sm font-medium">Notes</p>
                <p className="text-sm text-muted-foreground whitespace-pre-line mt-1">{buyerInfo.notes}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No buyer information available.</p>
            <p className="text-sm">Add buyer details when the puppy is reserved or sold.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PuppyBuyerInfo;
