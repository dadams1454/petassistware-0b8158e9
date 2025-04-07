
# Puppy Tracking Hooks

This directory contains hooks for tracking and managing puppy data in the PetAssistWare system.

## Hooks

### `usePuppyTracking`

The primary hook for accessing puppy tracking data throughout the application.

```typescript
import { usePuppyTracking } from '@/hooks/puppyTracking/usePuppyTracking';

// In your component
const { 
  puppies,
  totalPuppies,
  ageGroups,
  puppiesByAgeGroup,
  isLoading,
  error
} = usePuppyTracking();
```

This hook provides:
- Puppy data with age calculations
- Age group organization
- Status counts (available, reserved, sold)
- Gender distribution
- Loading and error states

## Migration

If you're using one of the older implementations of `usePuppyTracking`, please update your imports to use this canonical implementation:

```typescript
// OLD (deprecated):
import { usePuppyTracking } from '@/hooks/usePuppyTracking';
// or
import { usePuppyTracking } from '@/hooks/puppies/usePuppyTracking';
// or
import { usePuppyTracking } from '@/components/dogs/components/care/puppies/hooks/usePuppyTracking';

// NEW (canonical):
import { usePuppyTracking } from '@/hooks/puppyTracking/usePuppyTracking';
// or
import { usePuppyTracking } from '@/hooks/puppyTracking';
```
