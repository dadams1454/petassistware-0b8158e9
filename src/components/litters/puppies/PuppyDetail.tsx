
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PuppyWeightHistory from './PuppyWeightHistory';
import PuppyBuyerInfo from './PuppyBuyerInfo';
import PuppyPhotoGallery from './PuppyPhotoGallery';
import HealthTab from './HealthTab';
import { UseFormReturn } from 'react-hook-form';
import { PuppyFormData } from './types';

interface PuppyDetailProps {
  puppy: Puppy;
  litterId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const PuppyDetail: React.FC<PuppyDetailProps> = ({ 
  puppy, 
  litterId, 
  isOpen, 
  onOpenChange 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">
            {puppy.name || `Puppy ${puppy.id.substring(0, 4)}`}
          </h2>
        </div>
        
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="info">Overview</TabsTrigger>
            <TabsTrigger value="weight">Weight History</TabsTrigger>
            <TabsTrigger value="buyer">Buyer Info</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Basic Information</h3>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div>
                    <dt className="text-sm text-muted-foreground">Name</dt>
                    <dd>{puppy.name || 'Not specified'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Gender</dt>
                    <dd>{puppy.gender || 'Unknown'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Color</dt>
                    <dd>{puppy.color || 'Not specified'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Birth Date</dt>
                    <dd>{puppy.birth_date || 'Unknown'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Status</dt>
                    <dd>{puppy.status}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Microchip</dt>
                    <dd>{puppy.microchip_number || 'Not chipped'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Birth Weight</dt>
                    <dd>{puppy.birth_weight ? `${puppy.birth_weight} oz` : 'Not recorded'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Current Weight</dt>
                    <dd>{puppy.current_weight ? `${puppy.current_weight} oz` : 'Not recorded'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Sale Price</dt>
                    <dd>{puppy.sale_price ? `$${puppy.sale_price}` : 'Not specified'}</dd>
                  </div>
                </dl>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Health Information</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm text-muted-foreground">Deworming</dt>
                    <dd className="whitespace-pre-line">{puppy.deworming_dates || 'Not recorded'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Vaccinations</dt>
                    <dd className="whitespace-pre-line">{puppy.vaccination_dates || 'Not recorded'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Vet Checks</dt>
                    <dd className="whitespace-pre-line">{puppy.vet_check_dates || 'Not recorded'}</dd>
                  </div>
                </dl>
              </div>
            </div>
            
            {puppy.notes && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Notes</h3>
                <p className="whitespace-pre-line bg-muted p-3 rounded-md text-sm">{puppy.notes}</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="weight" className="space-y-4">
            <PuppyWeightHistory puppy={puppy} litterId={litterId} />
          </TabsContent>
          
          <TabsContent value="buyer" className="space-y-4">
            <PuppyBuyerInfo puppy={puppy} />
          </TabsContent>
          
          <TabsContent value="photos" className="space-y-4">
            <PuppyPhotoGallery puppy={puppy} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default PuppyDetail;
