
import { useState, useEffect } from 'react';
import { isValidUUID, validateUUID, attemptUUIDRepair } from '@/utils/uuidUtils';
import { useToast } from '@/hooks/use-toast';

export interface UuidValidationResult {
  valid: boolean;
  error: string | null;
}

export function useUuidValidation(initialValue?: string) {
  const [uuidValue, setUuidValue] = useState<string>(initialValue || '');
  const [validation, setValidation] = useState<UuidValidationResult>({ valid: false, error: "UUID is required" });
  const { toast } = useToast();

  // Validate UUID whenever it changes
  useEffect(() => {
    if (!uuidValue) {
      setValidation({ valid: false, error: "UUID is required" });
      return;
    }

    // Validate the UUID
    const result = validateUUID(uuidValue);
    setValidation(result);

    // If invalid, try to repair and suggest
    if (!result.valid) {
      const repairedUuid = attemptUUIDRepair(uuidValue);
      if (repairedUuid) {
        setValidation({
          valid: false,
          error: `Invalid format. Did you mean: ${repairedUuid}?`
        });
      }
    }
  }, [uuidValue]);

  // Handler for UUID changes
  const handleUuidChange = (value: string) => {
    // Clean up the input
    const cleanedValue = value.trim().replace(/\s+/g, '');
    setUuidValue(cleanedValue);
  };

  // Handle paste events
  const handlePaste = (pastedText: string): string | null => {
    if (!pastedText) return null;
    
    const cleaned = pastedText.trim().replace(/\s+/g, '');
    
    if (!isValidUUID(cleaned)) {
      const repaired = attemptUUIDRepair(cleaned);
      if (repaired) {
        toast({
          title: "UUID Format Corrected",
          description: "The pasted UUID had formatting issues and was automatically fixed.",
          variant: "default"
        });
        return repaired;
      } else {
        toast({
          title: "Invalid UUID Format",
          description: "The pasted value is not a valid UUID and cannot be repaired.",
          variant: "destructive"
        });
        return null;
      }
    }
    return cleaned;
  };

  return {
    uuidValue,
    setUuidValue,
    validation,
    handleUuidChange,
    handlePaste,
    isValid: validation.valid
  };
}
