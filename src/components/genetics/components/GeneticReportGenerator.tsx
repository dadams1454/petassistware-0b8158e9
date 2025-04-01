
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';
import { DogGenotype } from '@/types/genetics';

export interface GeneticReportGeneratorProps {
  dogId: string;
  dogName?: string;
  dogGenetics?: DogGenotype;
}

const GeneticReportGenerator: React.FC<GeneticReportGeneratorProps> = ({
  dogId,
  dogName = 'Dog',
  dogGenetics
}) => {
  const generateReport = () => {
    console.log('Generating report for dog:', dogId);
    // Implementation for report generation
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Genetic Reports
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Generate comprehensive genetic reports for {dogName}
        </p>
        
        <div className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={generateReport}
          >
            <FileText className="h-4 w-4 mr-2" />
            Full Genetic Profile Report
            <Download className="h-4 w-4 ml-auto" />
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={generateReport}
          >
            <FileText className="h-4 w-4 mr-2" />
            Health Test Summary
            <Download className="h-4 w-4 ml-auto" />
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={generateReport}
          >
            <FileText className="h-4 w-4 mr-2" />
            Breeding Compatibility Report
            <Download className="h-4 w-4 ml-auto" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneticReportGenerator;
