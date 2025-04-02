
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const DogManagementPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dog Management</h1>
        <Link to="/dogs/new">
          <Button>Add New Dog</Button>
        </Link>
      </div>
      
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
        <p className="font-medium">Dog list will appear here once connected to the database.</p>
      </div>
    </div>
  );
};

export default DogManagementPage;
