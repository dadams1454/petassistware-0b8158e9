
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Printer, FileDown, Share2 } from 'lucide-react';
import { GeneticReportGeneratorProps } from '@/types/genetics';
import { useDogGenetics } from '@/hooks/useDogGenetics';

const GeneticReportGenerator: React.FC<GeneticReportGeneratorProps> = ({ 
  dogId, 
  dogName, 
  dogGenetics 
}) => {
  const [activeTab, setActiveTab] = useState('health');
  const { dogData, isLoading, error } = useDogGenetics(dogId);
  
  // Use provided dogGenetics if available, otherwise use data from hook
  const geneticData = dogGenetics || dogData;
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error || !geneticData) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-red-500">Error loading genetic data.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleDownload = () => {
    // Implementation for downloading report as PDF
    console.log('Download report');
  };
  
  const handleShare = () => {
    // Implementation for sharing report
    console.log('Share report');
  };
  
  return (
    <Card className="print:shadow-none">
      <CardHeader className="flex flex-row items-center justify-between print:hidden">
        <CardTitle>Genetic Report: {dogName || 'Unknown Dog'}</CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <FileDown className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="print:hidden">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="color">Color Genetics</TabsTrigger>
            <TabsTrigger value="ancestry">Ancestry</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="mt-6">
          {/* Report Content based on selected tab */}
          <TabsContent value="health" className="mt-0">
            <div className="print:block">
              <h3 className="text-lg font-semibold mb-4 print:text-xl">Health Genetics Summary</h3>
              
              <div className="space-y-4">
                {/* Health Tests */}
                <div>
                  <h4 className="text-md font-medium mb-2">Health Test Results</h4>
                  <div className="border rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-border">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Condition</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Test Date</th>
                        </tr>
                      </thead>
                      <tbody className="bg-card divide-y divide-border">
                        {geneticData.healthResults && geneticData.healthResults.length > 0 ? (
                          geneticData.healthResults.map((result, index) => (
                            <tr key={index}>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">{result.condition}</td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">
                                <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                                  result.result === 'clear' ? 'bg-green-100 text-green-800' :
                                  result.result === 'carrier' ? 'bg-yellow-100 text-yellow-800' :
                                  result.result === 'affected' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {result.result.charAt(0).toUpperCase() + result.result.slice(1)}
                                </span>
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">{result.testDate || 'Unknown'}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={3} className="px-4 py-2 text-center text-sm text-muted-foreground">No health test results available</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="color" className="mt-0">
            <div className="print:block">
              <h3 className="text-lg font-semibold mb-4 print:text-xl">Color Genetics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-medium mb-2">Color Traits</h4>
                  <div className="bg-muted/30 rounded-md p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Base Color:</span>
                        <span className="text-sm font-medium">{geneticData.baseColor}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Dilution:</span>
                        <span className="text-sm font-medium">{geneticData.dilution}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Brown Dilution:</span>
                        <span className="text-sm font-medium">{geneticData.brownDilution}</span>
                      </div>
                      {geneticData.agouti && (
                        <div className="flex justify-between">
                          <span className="text-sm">Agouti:</span>
                          <span className="text-sm font-medium">{geneticData.agouti}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-md font-medium mb-2">Predicted Phenotype</h4>
                  <div className="bg-muted/30 rounded-md p-4">
                    <p className="text-sm">
                      Based on the genetic markers, this dog is predicted to have:
                    </p>
                    <p className="text-sm font-medium mt-2">
                      {/* A more complex algorithm would calculate this */}
                      {geneticData.baseColor === 'black' && geneticData.dilution === 'DD' 
                        ? 'Black coat' 
                        : geneticData.baseColor === 'black' && geneticData.dilution === 'Dd' 
                        ? 'Black coat (carrier for dilution)' 
                        : geneticData.baseColor === 'black' && geneticData.dilution === 'dd' 
                        ? 'Blue/Gray diluted coat' 
                        : 'Coat color prediction requires additional data'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="ancestry" className="mt-0">
            <div className="print:block">
              <h3 className="text-lg font-semibold mb-4 print:text-xl">Ancestry & Lineage</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-md font-medium mb-2">Genetic Diversity</h4>
                  <p className="text-sm">
                    Data not available for this dog. Genetic diversity information requires additional testing.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-md font-medium mb-2">Breed Composition</h4>
                  <p className="text-sm">
                    Data not available for this dog. Breed composition information requires additional testing.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </div>
        
        <div className="mt-6 text-center text-xs text-muted-foreground print:mt-12">
          <p>
            Genetic reports by Bear Paw Newfoundlands Kennel Management System
          </p>
          <p>
            Report generated on {new Date().toLocaleDateString()} • Dog ID: {dogId}
          </p>
          <p className="mt-1">
            This report is for informational purposes and should be interpreted by a veterinarian or genetic counselor.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneticReportGenerator;
