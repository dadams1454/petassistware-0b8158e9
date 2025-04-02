
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const EditDogPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <Link to={`/dogs/${id}`}>
          <Button variant="outline" className="mr-4">Back to Dog Profile</Button>
        </Link>
        <h1 className="text-2xl font-bold">Edit Dog</h1>
      </div>
      
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
        <p className="font-medium">Edit dog form for ID: {id} will appear here once implemented.</p>
      </div>
    </div>
  );
};

export default EditDogPage;
