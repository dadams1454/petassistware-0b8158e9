
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';

type Dog = {
  id: string;
  name: string;
  breed?: string;
  gender?: string;
  color?: string;
  photo_url?: string;
  birthdate?: string;
  status?: string;
};

const DogManagementPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: dogs, isLoading, error } = useQuery({
    queryKey: ['dogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dogs')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Dog[];
    }
  });

  const filteredDogs = dogs?.filter(dog => 
    dog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (dog.breed && dog.breed.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (dog.color && dog.color.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dog Management</h1>
        <Link to="/dogs/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Dog
          </Button>
        </Link>
      </div>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search dogs by name, breed, or color..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {isLoading ? (
        <div className="text-center p-8">Loading dogs...</div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
          Error loading dogs: {(error as Error).message}
        </div>
      ) : filteredDogs && filteredDogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDogs.map(dog => (
            <Link to={`/dogs/${dog.id}`} key={dog.id}>
              <div className="border rounded-lg p-4 shadow hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  {dog.photo_url ? (
                    <img src={dog.photo_url} alt={dog.name} className="w-16 h-16 rounded-full object-cover" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                      No Image
                    </div>
                  )}
                  <div>
                    <h2 className="text-lg font-semibold">{dog.name}</h2>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {dog.breed && <span className="text-sm text-gray-600">{dog.breed}</span>}
                      {dog.gender && (
                        <Badge className={dog.gender === 'Male' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'}>
                          {dog.gender}
                        </Badge>
                      )}
                      {dog.status && dog.status !== 'active' && (
                        <Badge variant="outline">{dog.status}</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
          {searchTerm ? (
            <div>
              <p className="mb-4">No dogs found matching "{searchTerm}"</p>
              <Button variant="outline" onClick={() => setSearchTerm('')}>Clear Search</Button>
            </div>
          ) : (
            <div>
              <p className="mb-4">You haven't added any dogs yet</p>
              <Link to="/dogs/new">
                <Button>Add Your First Dog</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DogManagementPage;
