
# Daily Care Feature Documentation

## Overview

The Daily Care feature allows breeders to track and log daily care activities for all their dogs. It provides a centralized dashboard where users can view dog care status, record care activities, and maintain a comprehensive history of care events.

## Key Features

- **Care Dashboard**: View all dogs with their care status at a glance
- **Multiple Views**: Switch between card view and table view
- **Care Categories**: Filter and organize care tasks by categories
- **Task Management**: Use existing care tasks or create new ones
- **Care Logging**: Record detailed care activities with timestamps and notes
- **Flag System**: Add special flags to dogs (in heat, incompatible with others, needs special attention)
- **History Tracking**: View a complete log of past care activities

## Component Structure

The Daily Care feature follows a modular architecture:

```
DailyCare (Page)
└── CareDashboard
    ├── CareDashboardHeader
    ├── TopCategoryTabs
    ├── LoadingState
    ├── NoDogsState
    └── LoadedDogsContent
        ├── CareTabsContent
        │   ├── CareCardsView
        │   │   └── DogCareCard
        │   └── DogCareTable
        │       ├── TableHeader
        │       ├── DogTableRow
        │       │   ├── DogAvatar
        │       │   ├── LastCareStatus
        │       │   └── LogCareButton
        │       └── EmptyTableRow
        └── CareLogForm (Dialog)
            ├── TaskSelection
            │   ├── TaskSelectionTabs
            │   ├── ExistingTaskSelection
            │   │   └── CategoryTabs
            │   └── NewTaskDialog
            ├── DateTimeSelector
            ├── NotesField
            └── FlagSelection
```

## Data Flow

The Daily Care feature uses the following data flow:

1. **DailyCare Context**: Provides global state and actions for the feature
2. **useCareDashboard Hook**: Manages dashboard state and interactions
3. **Service Layer**: Connects to database via Supabase for data operations
4. **Component State**: Manages UI state within individual components

## Core Components

### DailyCare Page (`src/pages/DailyCare.tsx`)

The main page component that renders the care dashboard. It initializes the DailyCare context and fetches initial data.

### CareDashboard (`src/components/dogs/components/care/CareDashboard.tsx`)

The main container component that coordinates:
- View switching (cards/table)
- Category filtering
- Loading states
- Care logging

### CareTabsContent (`src/components/dogs/components/care/CareTabsContent.tsx`)

Renders either the card view or table view based on the selected tab.

### CareCardsView (`src/components/dogs/components/care/CareCardsView.tsx`)

Displays dogs in a grid of cards, each showing care status and actions.

### DogCareTable (`src/components/dogs/components/care/DogCareTable.tsx`)

Displays dogs in a table format with columns for details and actions.

### CareLogForm (`src/components/dogs/components/care/CareLogForm.tsx`)

A form dialog for logging care activities with:
- Category and task selection
- Date/time picking
- Notes
- Flag management

## Context System

### DailyCareContext (`src/contexts/dailyCare/DailyCareContext.tsx`)

Provides a global state and actions for the Daily Care feature:
- Fetching care logs
- Adding new care logs
- Managing task presets
- Tracking dog care status

## Custom Hooks

### useCareDashboard (`src/components/dogs/components/care/dashboard/useCareDashboard.tsx`)

Manages dashboard state including:
- Active view (cards/table)
- Selected category
- Loading states
- Dialog state
- Data refresh

### useCareLogForm (`src/components/dogs/components/care/form/useCareLogForm.tsx`)

Handles form state and submission for care logs with:
- Form validation
- Task selection
- Flag management
- Data submission

## Using the Daily Care Feature

### Viewing Dog Care Status

1. Navigate to the Daily Care page
2. View all dogs with their latest care status
3. Switch between card and table views using the view toggle
4. Filter by care category using the category tabs

### Logging Care Activities

1. Click the "Log Care" or "Update" button on a dog card/row
2. Select a care category and task (or create a new one)
3. Set the date and time
4. Add optional notes
5. Add any relevant flags if needed
6. Submit the form

### Managing Care Tasks

1. When logging care, click the "Create New Task" tab
2. Enter a new category name or use an existing one
3. Enter a task name
4. Save the task preset for future use

## Database Schema

The feature relies on the following database tables:

- `dogs`: Stores basic dog information
- `daily_care_logs`: Records care activities
- `care_task_presets`: Stores reusable care tasks

## Adding New Features

When extending the Daily Care feature:

1. Add new components in the appropriate directory
2. Update the context if adding new data operations
3. Create new hooks for complex logic
4. Update existing components to integrate new features

## Best Practices

1. **Performance**: Use React.memo for list items and memoize callbacks
2. **Error Handling**: All service functions include error handling
3. **Form Validation**: Use zod schemas for form validation
4. **Modularity**: Keep components small and focused
5. **State Management**: Use hooks to isolate and manage state

## Troubleshooting

### Common Issues

1. **Dogs not loading**: Check Supabase connection and verify dog records exist
2. **Care logs not saving**: Ensure user authentication is working
3. **Tasks not appearing**: Verify care_task_presets table has records
4. **UI rendering issues**: Check the console for specific errors

### Debugging Tips

1. The feature includes extensive console logging for debugging
2. Check browser console for detailed operation tracking
3. Use the TableDebugger component to inspect data in the table view
