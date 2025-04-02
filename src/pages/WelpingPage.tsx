
import React from 'react';
import { useParams } from 'react-router-dom';

const WelpingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Whelping Page</h1>
      {id ? (
        <p>Viewing whelping session ID: {id}</p>
      ) : (
        <p>Create a new whelping session</p>
      )}
    </div>
  );
};

export default WelpingPage;
