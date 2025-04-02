
import React from 'react';
import { useParams } from 'react-router-dom';
import { useDogProfileData } from '@/hooks/useDogProfileData';

const DogProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { dog, isLoading, error } = useDogProfileData(id);

  if (isLoading) {
    return <div className="container mx-auto p-4">Loading dog profile...</div>;
  }

  if (error || !dog) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-xl font-bold text-red-500">Error loading dog profile</h1>
        <p>{error?.message || "Dog not found"}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{dog.name}</h1>
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
              <span>{dog.weight} {dog.weight_unit}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Birthdate:</span>
              <span>{dog.birthdate ? new Date(dog.birthdate).toLocaleDateString() : 'Unknown'}</span>
            </div>
          </div>
        </div>

        {dog.photo_url && (
          <div className="border rounded-lg p-4 shadow">
            <img 
              src={dog.photo_url} 
              alt={dog.name} 
              className="w-full h-64 object-cover rounded"
            />
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
          </div>
        </div>

        {dog.notes && (
          <div className="border rounded-lg p-4 shadow md:col-span-2">
            <h2 className="text-xl font-semibold mb-2">Notes</h2>
            <p className="whitespace-pre-line">{dog.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DogProfilePage;
