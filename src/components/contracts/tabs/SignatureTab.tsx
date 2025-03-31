
import React from 'react';
import ESignatureCanvas from '../ESignatureCanvas';

interface SignatureTabProps {
  customerName: string;
  onSignatureChange: (signature: string) => void;
}

const SignatureTab: React.FC<SignatureTabProps> = ({
  customerName,
  onSignatureChange,
}) => {
  return (
    <div className="flex-1 overflow-auto space-y-4">
      <div className="space-y-4">
        <p>Please sign below to indicate your agreement to the terms of this contract:</p>
        
        <div className="border rounded-md p-4 bg-gray-50">
          <p className="text-sm font-medium">Signing as: {customerName}</p>
          <p className="text-sm text-muted-foreground">
            Date: {new Date().toLocaleDateString()}
          </p>
        </div>
        
        <ESignatureCanvas 
          onChange={onSignatureChange}
          width={600}
          height={200}
        />
        
        <p className="text-sm text-muted-foreground">
          By signing, you acknowledge that you have read and agree to all terms and conditions outlined in this contract.
        </p>
      </div>
    </div>
  );
};

export default SignatureTab;
