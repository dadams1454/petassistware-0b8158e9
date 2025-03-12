
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import DogHealthSection from './DogHealthSection';
import VaccinationsTab from './components/VaccinationsTab';
import PedigreeTab from './components/tabs/PedigreeTab';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import DogForm from './DogForm';
import { useQueryClient } from '@tanstack/react-query';

interface DogDetailsProps {
  dog: any;
}

const DogDetails: React.FC<DogDetailsProps> = ({ dog }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div className="w-full sm:w-1/3 aspect-square relative rounded-lg overflow-hidden bg-muted">
          {dog.photo_url ? (
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${dog.photo_url})` }}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-5xl">🐾</span>
            </div>
          )}
        </div>
        
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{dog.name}</h2>
              <p className="text-muted-foreground">{dog.breed}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditDialogOpen(true)}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-y-2">
            {dog.gender && (
              <div>
                <span className="text-muted-foreground font-medium">Gender:</span>{' '}
                {dog.gender}
              </div>
            )}
            
            {dog.birthdate && (
              <div>
                <span className="text-muted-foreground font-medium">Date of Birth:</span>{' '}
                {format(new Date(dog.birthdate), 'PPP')}
              </div>
            )}
            
            {dog.color && (
              <div>
                <span className="text-muted-foreground font-medium">Color:</span>{' '}
                {dog.color}
              </div>
            )}
            
            {dog.weight && (
              <div>
                <span className="text-muted-foreground font-medium">Weight:</span>{' '}
                {dog.weight} kg
              </div>
            )}
          </div>
          
          {dog.pedigree && (
            <div>
              <Badge variant="outline" className="bg-primary/10">Pedigree</Badge>
            </div>
          )}
        </div>
      </div>
      
      <Separator />
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vaccinations">Vaccinations</TabsTrigger>
          <TabsTrigger value="pedigree">Pedigree</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-base">Health {dog.gender === 'Female' ? '& Breeding' : ''}</CardTitle>
            </CardHeader>
            <CardContent className="py-0">
              <DogHealthSection dog={dog} />
            </CardContent>
          </Card>
          
          {dog.notes && (
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Notes</h3>
              <p className="text-muted-foreground whitespace-pre-line">{dog.notes}</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="vaccinations">
          <Card>
            <CardContent className="py-6">
              <VaccinationsTab dogId={dog.id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pedigree">
          <PedigreeTab dogId={dog.id} currentDog={dog} />
        </TabsContent>
        
        <TabsContent value="documentation">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Documentation</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {dog.microchip_number && (
                <div>
                  <span className="text-muted-foreground font-medium">Microchip Number:</span>{' '}
                  {dog.microchip_number}
                </div>
              )}
              
              {dog.registration_number && (
                <div>
                  <span className="text-muted-foreground font-medium">Registration Number:</span>{' '}
                  {dog.registration_number}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Dog</DialogTitle>
          </DialogHeader>
          <DogForm 
            dog={dog}
            onSuccess={() => {
              setIsEditDialogOpen(false);
              queryClient.invalidateQueries({ queryKey: ['dogs'] });
              queryClient.invalidateQueries({ queryKey: ['allDogs'] });
            }}
            onCancel={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DogDetails;
