
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';

interface DogCareRedirectProps {
  title?: string;
  message?: string;
}

const DogCareRedirect: React.FC<DogCareRedirectProps> = ({ 
  title = "Feature Relocated",
  message = "This feature has been moved to the comprehensive Daily Care section."
}) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
          <FileText className="h-6 w-6 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          {message} Please use the Daily Care section for tracking all dog care activities.
        </p>
        <Button onClick={() => navigate("/daily-care")}>Go to Daily Care</Button>
      </CardContent>
    </Card>
  );
};

export default DogCareRedirect;
