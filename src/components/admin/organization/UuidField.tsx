
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AlertTriangle, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { useUuidValidation } from '@/hooks/useUuidValidation';
import { generateUUID, isValidUUID } from '@/utils/uuidUtils';
import { useToast } from '@/hooks/use-toast';

interface UuidFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  showGuide?: boolean;
}

const UuidField: React.FC<UuidFieldProps> = ({ 
  value, 
  onChange,
  error,
  showGuide = true
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  
  const {
    validation,
    handleUuidChange,
    handlePaste
  } = useUuidValidation(value);

  // Force validation to update when value changes external to this component
  useEffect(() => {
    if (value) {
      // This ensures the validation state updates when the value is set externally
      handleUuidChange(value);
    }
  }, [value]);

  // Handle input change
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleUuidChange(e.target.value);
    onChange(e.target.value);
  };

  // Handle paste event
  const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData('text');
    const processedText = handlePaste(pastedText);
    
    if (processedText) {
      e.preventDefault();
      onChange(processedText);
    }
  };

  // Generate new UUID - complete implementation with proper validation
  const onGenerateClick = () => {
    setIsGenerating(true);
    try {
      // Generate a valid UUID
      const newUuid = generateUUID();
      
      // Log for debugging
      console.log('Generated new UUID:', newUuid, 'Valid:', isValidUUID(newUuid));
      
      // Update the input field with the new UUID
      onChange(newUuid);
      
      // Manually trigger validation for immediate UI update
      handleUuidChange(newUuid);
      
      toast({
        title: "UUID Generated",
        description: "A new valid UUID has been generated and validated.",
        variant: "default"
      });
    } catch (error) {
      console.error('Error generating UUID:', error);
      toast({
        title: "UUID Generation Error",
        description: "Failed to generate a valid UUID. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const displayError = error || (!validation.valid ? validation.error : null);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label htmlFor="tenantId">Tenant ID (UUID format required)</Label>
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={onGenerateClick}
          disabled={isGenerating}
          className="flex items-center gap-2"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              Generate New ID
            </>
          )}
        </Button>
      </div>
      <div className="relative">
        <Input
          id="tenantId"
          placeholder="UUID format tenant ID"
          value={value}
          onChange={onInputChange}
          onPaste={onPaste}
          className={`${!validation.valid ? 'border-destructive' : value ? 'border-green-500' : ''} pr-10`}
        />
        {value && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {validation.valid ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-destructive" />
            )}
          </div>
        )}
      </div>
      
      {displayError && (
        <div className="text-sm text-destructive flex items-center gap-1 mt-1">
          <AlertTriangle className="h-4 w-4" />
          <span>{displayError}</span>
        </div>
      )}
      
      {showGuide && (
        <div className="border border-gray-200 rounded-md p-3 mt-2 bg-gray-50 text-xs">
          <p className="font-medium mb-1">UUID format guide:</p>
          <p className="font-mono">xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx</p>
          <p className="mt-1">Example: 123e4567-e89b-12d3-a456-426614174000</p>
          <p className="mt-1 text-muted-foreground">
            <span className="font-medium">Important:</span> Click "Generate New ID" to create a valid UUID - this is the safest approach.
          </p>
        </div>
      )}
    </div>
  );
};

export default UuidField;
