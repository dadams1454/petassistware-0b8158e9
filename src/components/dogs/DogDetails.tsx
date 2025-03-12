
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
import { Pencil, Calendar, Bell } from 'lucide-react';
import DogHealthSection from './DogHealthSection';
import VaccinationsTab from './components/VaccinationsTab';
import PedigreeTab from './components/tabs/PedigreeTab';
import GalleryTab from './components/tabs/GalleryTab';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import DogForm from './DogForm';
import { useQueryClient } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { fetchEvents } from '@/services/eventService';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface DogDetailsProps {
  dog: any;
  isFullPage?: boolean;
}

const DogDetails: React.FC<DogDetailsProps> = ({ dog, isFullPage = false }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch upcoming events related to this dog
  const { data: events } = useQuery({
    queryKey: ['dogEvents', dog.id],
    queryFn: async () => {
      const allEvents = await fetchEvents();
      // Filter events that mention this dog in the title or description
      return allEvents.filter(event => 
        (event.title?.toLowerCase().includes(dog.name.toLowerCase()) || 
        event.description?.toLowerCase().includes(dog.name.toLowerCase())) &&
        event.status !== 'completed' && 
        event.status !== 'cancelled'
      );
    },
  });

  const upcomingEvents = events?.length || 0;

  const handleAddAppointment = () => {
    navigate('/calendar', { 
      state: { 
        initialEventData: {
          title: `${dog.name}`,
          description: `Dog: ${dog.name} (${dog.breed})`,
          event_type: 'Vet Appointment'
        }
      } 
    });
  };

  // Navigate to calendar with the event selected
  const handleViewEvent = (event: any) => {
    navigate('/calendar', {
      state: {
        selectedEventId: event.id
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div className={`${isFullPage ? 'w-full sm:w-1/4' : 'w-full sm:w-1/3'} aspect-square relative rounded-lg overflow-hidden bg-muted`}>
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
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleAddAppointment}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Add Appointment
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsEditDialogOpen(true)}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
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
          
          <div className="flex flex-wrap gap-2">
            {dog.pedigree && (
              <Badge variant="outline" className="bg-primary/10">Pedigree</Badge>
            )}
            
            {upcomingEvents > 0 && (
              <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 flex items-center gap-1">
                <Bell className="h-3 w-3" />
                {upcomingEvents} {upcomingEvents === 1 ? 'Appointment' : 'Appointments'}
              </Badge>
            )}
          </div>
        </div>
      </div>
      
      <Separator />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className={isFullPage ? "mt-8" : ""}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vaccinations">Vaccinations</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
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
          
          {upcomingEvents > 0 && (
            <Card className="mt-4">
              <CardHeader className="py-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Upcoming Appointments
                </CardTitle>
              </CardHeader>
              <CardContent className="py-0">
                <div className="space-y-3">
                  {events?.map(event => (
                    <div 
                      key={event.id} 
                      className="flex justify-between items-center pb-3 border-b last:border-0 cursor-pointer hover:bg-muted/50 rounded p-2 transition-colors"
                      onClick={() => handleViewEvent(event)}
                    >
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {event.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{format(new Date(event.event_date), 'PP')}</div>
                        <Badge variant={event.status === 'upcoming' ? 'default' : 'outline'}>
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-4 pb-2">
                <Button variant="outline" size="sm" onClick={handleAddAppointment} className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Add New Appointment
                </Button>
              </CardFooter>
            </Card>
          )}
          
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

        <TabsContent value="gallery">
          <GalleryTab dogId={dog.id} mainPhotoUrl={dog.photo_url} />
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
              queryClient.invalidateQueries({ queryKey: ['dog', dog.id] });
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
