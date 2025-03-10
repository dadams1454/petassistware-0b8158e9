
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, CreditCard, CheckCircle, Paw } from 'lucide-react';
import { format } from 'date-fns';

interface PuppyProfileProps {
  puppy: Puppy;
}

const PuppyProfile: React.FC<PuppyProfileProps> = ({ puppy }) => {
  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{puppy.name || 'Unnamed Puppy'}</CardTitle>
            <CardDescription>
              {puppy.gender || 'Gender not specified'} • ID: {puppy.id.substring(0, 8)}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(puppy.status || 'Available')}>
            {puppy.status || 'Available'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {puppy.photo_url && (
          <div className="w-full h-48 relative rounded-md overflow-hidden">
            <img 
              src={puppy.photo_url} 
              alt={`Photo of ${puppy.name || 'puppy'}`}
              className="object-cover w-full h-full"
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProfileItem 
            icon={<Paw className="h-4 w-4 text-muted-foreground" />}
            label="Microchip"
            value={puppy.microchip_number || 'Not chipped yet'}
          />
          
          {puppy.sale_price && (
            <ProfileItem 
              icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
              label="Sale Price"
              value={`$${puppy.sale_price}`}
            />
          )}
          
          {puppy.reservation_date && (
            <ProfileItem 
              icon={<CalendarIcon className="h-4 w-4 text-muted-foreground" />}
              label="Reserved On"
              value={format(new Date(puppy.reservation_date), 'MMM d, yyyy')}
            />
          )}
          
          {puppy.birth_weight && (
            <ProfileItem 
              icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
              label="Birth Weight"
              value={`${puppy.birth_weight} oz`}
            />
          )}
        </div>

        {puppy.notes && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-1">Notes</h4>
            <p className="text-sm text-muted-foreground">{puppy.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ProfileItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="flex items-center gap-2">
    {icon}
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  </div>
);

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Available':
      return 'bg-green-100 text-green-800 hover:bg-green-100';
    case 'Reserved':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
    case 'Sold':
      return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
    case 'Retained':
      return 'bg-amber-100 text-amber-800 hover:bg-amber-100';
    case 'Deceased':
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
  }
};

export default PuppyProfile;
