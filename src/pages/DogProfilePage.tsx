
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDogProfileData } from '@/hooks/useDogProfileData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, ArrowLeft } from 'lucide-react';

const DogProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { dog, isLoading, error } = useDogProfileData(id);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-xl">Loading dog profile...</div>
        </div>
      </div>
    );
  }

  if (error || !dog) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h1 className="text-xl font-bold text-red-700">Error loading dog profile</h1>
          <p className="text-red-600">{error?.message || "Dog not found"}</p>
          <Link to="/dogs">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dogs
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Link to="/dogs">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{dog.name}</h1>
          {dog.gender && (
            <Badge className={dog.gender === 'Male' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'}>
              {dog.gender}
            </Badge>
          )}
        </div>
        
        <Link to={`/dogs/${id}/edit`}>
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4 shadow">
          <h2 className="text-xl font-semibold mb-2">Basic Information</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Breed:</span>
              <span>{dog.breed || 'Not specified'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Gender:</span>
              <span>{dog.gender}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Color:</span>
              <span>{dog.color || 'Not specified'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Weight:</span>
              <span>{dog.weight ? `${dog.weight} ${dog.weight_unit}` : 'Not recorded'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Birthdate:</span>
              <span>{dog.birthdate ? new Date(dog.birthdate).toLocaleDateString() : 'Unknown'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Status:</span>
              <span>{dog.status || 'Active'}</span>
            </div>
          </div>
        </div>

        {dog.photo_url ? (
          <div className="border rounded-lg p-4 shadow flex items-center justify-center">
            <img 
              src={dog.photo_url} 
              alt={dog.name} 
              className="w-full h-64 object-cover rounded"
            />
          </div>
        ) : (
          <div className="border rounded-lg p-4 shadow flex items-center justify-center bg-gray-50">
            <div className="text-gray-400 text-center">
              <p className="mb-2">No photo available</p>
              <Link to={`/dogs/${id}/edit`}>
                <Button variant="outline" size="sm">
                  Add Photo
                </Button>
              </Link>
            </div>
          </div>
        )}

        <div className="border rounded-lg p-4 shadow md:col-span-2">
          <h2 className="text-xl font-semibold mb-2">Registration</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Registration Number:</span>
              <span>{dog.registration_number || 'Not registered'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Microchip:</span>
              <span>{dog.microchip_number || 'No microchip'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Pedigree:</span>
              <span>{dog.pedigree ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>

        {dog.notes && (
          <div className="border rounded-lg p-4 shadow md:col-span-2">
            <h2 className="text-xl font-semibold mb-2">Notes</h2>
            <p className="whitespace-pre-line">{dog.notes}</p>
          </div>
        )}

        {dog.gender === 'Female' && (
          <div className="border rounded-lg p-4 shadow md:col-span-2">
            <h2 className="text-xl font-semibold mb-2">Reproductive Status</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Is Pregnant:</span>
                <span>{dog.is_pregnant ? 'Yes' : 'No'}</span>
              </div>
              {dog.last_heat_date && (
                <div className="flex justify-between">
                  <span className="font-medium">Last Heat Date:</span>
                  <span>{new Date(dog.last_heat_date).toLocaleDateString()}</span>
                </div>
              )}
              {dog.tie_date && (
                <div className="flex justify-between">
                  <span className="font-medium">Last Breeding Date:</span>
                  <span>{new Date(dog.tie_date).toLocaleDateString()}</span>
                </div>
              )}
              <div className="mt-2">
                <Link to={`/dogs/${id}/reproductive-cycle`}>
                  <Button className="w-full">Manage Reproductive Cycle</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DogProfilePage;
