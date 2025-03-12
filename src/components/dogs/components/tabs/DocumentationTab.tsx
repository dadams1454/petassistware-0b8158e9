
import React from 'react';

interface DocumentationTabProps {
  dog: any;
}

const DocumentationTab: React.FC<DocumentationTabProps> = ({ dog }) => {
  return (
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
  );
};

export default DocumentationTab;
