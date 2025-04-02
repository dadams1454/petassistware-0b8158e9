
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
// Import from geneticsService/batchGeneticTests instead of geneticsService directly
import { importEmbarkData, importWisdomPanelData } from '@/services/genetics/batchGeneticTests';
import { GeneticImportResult } from '@/types/genetics';
import { Dna, FileSymlink, File, Upload, AlertCircle } from 'lucide-react';

interface GeneticImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dogId: string;
  onImportComplete?: (result: GeneticImportResult) => void;
}

export const GeneticImportDialog: React.FC<GeneticImportDialogProps> = ({
  open,
  onOpenChange,
  dogId,
  onImportComplete
}) => {
  const { toast } = useToast();
  const [provider, setProvider] = useState<string>('embark');
  const [importMethod, setImportMethod] = useState<string>('file');
  const [apiKey, setApiKey] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [accountId, setAccountId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!dogId) {
      setError('Missing dog ID');
      return;
    }

    if (importMethod === 'file' && !file) {
      setError('Please select a file to import');
      return;
    }

    if (importMethod === 'api' && (!apiKey || !accountId)) {
      setError('API key and account ID are required for API import');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let result: GeneticImportResult;

      // For now, just use the placeholder implementations
      // In a real app, you would parse the file data and send it to the API
      if (provider === 'embark') {
        result = await importEmbarkData(dogId, file);
      } else if (provider === 'wisdom_panel') {
        result = await importWisdomPanelData(dogId, file);
      } else {
        throw new Error(`Unsupported provider: ${provider}`);
      }

      if (result.success) {
        toast({
          title: 'Genetic data imported',
          description: `Successfully imported ${result.testsImported} genetic tests from ${result.provider}.`,
        });
        onImportComplete?.(result);
        onOpenChange(false);
      } else {
        setError(`Import failed: ${result.errors?.[0] || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error importing genetic data:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Dna className="h-5 w-5 mr-2" />
            Import Genetic Test Results
          </DialogTitle>
          <DialogDescription>
            Import genetic testing results from popular testing providers or upload a file.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Testing Provider</Label>
            <Select
              value={provider}
              onValueChange={setProvider}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="embark">Embark</SelectItem>
                <SelectItem value="wisdom_panel">Wisdom Panel</SelectItem>
                <SelectItem value="optimal_selection">Optimal Selection</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Import Method</Label>
            <Select
              value={importMethod}
              onValueChange={setImportMethod}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select import method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="file">Upload File</SelectItem>
                <SelectItem value="api">Connect API (beta)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {importMethod === 'file' && (
            <div className="space-y-2">
              <Label>Test Results File</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  onChange={handleFileChange}
                  accept=".csv,.xlsx,.json,.pdf"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Supported formats: CSV, Excel, PDF, or JSON export from your testing provider.
              </p>
            </div>
          )}

          {importMethod === 'api' && (
            <>
              <div className="space-y-2">
                <Label>API Key</Label>
                <Input
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  type="password"
                  placeholder="Enter your API key"
                />
              </div>
              <div className="space-y-2">
                <Label>Account ID</Label>
                <Input
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  placeholder="Enter your account ID"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Your API credentials can be found in your testing provider account settings.
              </p>
            </>
          )}

          {error && (
            <div className="bg-destructive/10 text-destructive rounded-md p-3 flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={isLoading}>
            {isLoading ? 'Importing...' : 'Import Data'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GeneticImportDialog;
