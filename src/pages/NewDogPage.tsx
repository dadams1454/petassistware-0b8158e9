
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NewDogPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <Link to="/dogs">
          <Button variant="outline" className="mr-4">Back to Dogs</Button>
        </Link>
        <h1 className="text-2xl font-bold">Add New Dog</h1>
      </div>
      
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
        <p className="font-medium">New dog form will appear here once implemented.</p>
      </div>
    </div>
  );
};

export default NewDogPage;
