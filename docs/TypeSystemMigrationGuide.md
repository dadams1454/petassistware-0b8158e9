
# PetAssistWare Type System Migration Guide

This guide is intended to help developers migrate their components and utilities to use the new centralized type system.

## Overview of Changes

We've made the following key changes to the type system:

1. Standardized on string literal union types instead of enums for better TypeScript compatibility
2. Centralized all common types in the `/types` directory
3. Added type guards for runtime safety
4. Improved data mapping and compatibility utilities
5. Moved towards "fail-safe" type handling that degrades gracefully

## Migration Steps

### 1. Updating Import Paths

Import types from the centralized `/types` directory:

```typescript
// OLD approach - importing from various locations
import { HealthRecordType } from '../components/health/types';
import { WeightUnit } from '../utils/weightTypes';

// NEW approach - import all from central location
import { HealthRecordType, WeightUnit } from '@/types';
```

### 2. Using String Literal Types

Use string literal types instead of enum references:

```typescript
// OLD approach - using enum values
if (status === MedicationStatusEnum.COMPLETED) {
  // handle completed status
}

// NEW approach - using string literals
if (status === 'completed') {
  // handle completed status
}
```

### 3. Validating Unknown Data with Type Guards

Use the provided type guards for runtime safety:

```typescript
import { isAppetiteLevel, safelyConvertValue } from '@/utils/typeGuards';

// When receiving data from external sources
function processHealthRecord(record: any) {
  // Safely convert possibly invalid data
  const appetiteLevel = safelyConvertValue(record.appetite, 'normal', isAppetiteLevel);
  
  // Now use the validated value
  processAppetite(appetiteLevel);
}
```

### 4. Form Validation with Zod

Use zod to validate form inputs:

```typescript
import * as z from 'zod';

const healthIndicatorSchema = z.object({
  appetite: z.enum(['excellent', 'good', 'fair', 'poor', 'none']).optional(),
  energy: z.enum(['hyperactive', 'high', 'normal', 'low', 'lethargic']).optional(),
  stool_consistency: z.enum(['normal', 'soft', 'loose', 'watery', 'hard', 'bloody', 'mucus']).optional(),
});
```

### 5. Converting Legacy Data

Use the provided utility functions to convert legacy data:

```typescript
import { mapToCoreDog, mapToCorePuppy } from '@/lib/mappers';

// Convert legacy dog data to the standard format
const standardizedDog = mapToCoreDog(legacyDogData);
```

## Type Definition Files

Here are the key files to reference when using types:

- `/types/index.ts` - Central export of all types
- `/types/health-enums.ts` - Health-related enums and string literal types
- `/types/weight-units.ts` - Weight unit types and utilities
- `/types/enums.ts` - General enum types and conversion utilities
- `/utils/typeGuards.ts` - Runtime type safety utilities

## Testing Type Compatibility

When adding new components or updating existing ones, ensure you run the type guard tests:

```bash
npm test -- typeGuards
```

## Getting Help

If you encounter any issues with the type system, please refer to the example components or contact the development team.
