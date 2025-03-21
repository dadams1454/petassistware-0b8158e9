
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ObservationDialogManager from '../ObservationDialogManager';

// Mock the ObservationDialog component
jest.mock('../observation/ObservationDialog', () => ({
  __esModule: true,
  default: ({ 
    dogId, 
    dogName, 
    open, 
    existingObservations, 
    timeSlots, 
    activeCategory,
    selectedTimeSlot
  }) => (
    <div data-testid="observation-dialog" style={{ display: open ? 'block' : 'none' }}>
      <div data-testid="dog-id">{dogId}</div>
      <div data-testid="dog-name">{dogName}</div>
      <div data-testid="observations-count">{existingObservations.length}</div>
      <div data-testid="time-slots-count">{timeSlots.length}</div>
      <div data-testid="active-category">{activeCategory}</div>
      <div data-testid="selected-time-slot">{selectedTimeSlot}</div>
    </div>
  )
}));

describe('ObservationDialogManager Component', () => {
  const mockDog = {
    dog_id: 'dog1',
    dog_name: 'Buddy',
    breed: 'Newfoundland',
    color: 'black',
    sex: 'male',
    gender: 'male',
    weight: 120,
    flags: [],
    age: 3,
    next_vaccination: null,
    last_potty_break: null,
    last_care: null,
    status: 'active'
  };
  
  const defaultProps = {
    selectedDog: mockDog,
    observationDialogOpen: true,
    onOpenChange: jest.fn(),
    onSubmit: jest.fn(),
    observations: [
      { dogId: 'dog1', text: 'Observation 1', type: 'behavior' },
      { dogId: 'dog2', text: 'Observation 2', type: 'other' },
    ],
    timeSlots: ['9:00 AM', '10:00 AM', '11:00 AM'],
    isMobile: false,
    activeCategory: 'pottybreaks',
    selectedTimeSlot: '9:00 AM'
  };

  test('renders dialog when selectedDog is provided', () => {
    render(<ObservationDialogManager {...defaultProps} />);
    
    expect(screen.getByTestId('observation-dialog')).toBeInTheDocument();
    expect(screen.getByTestId('dog-id').textContent).toBe('dog1');
    expect(screen.getByTestId('dog-name').textContent).toBe('Buddy');
  });

  test('filters observations for selected dog', () => {
    render(<ObservationDialogManager {...defaultProps} />);
    
    // Only 1 observation for this dog
    expect(screen.getByTestId('observations-count').textContent).toBe('1');
  });

  test('passes correct props to ObservationDialog', () => {
    render(<ObservationDialogManager {...defaultProps} />);
    
    expect(screen.getByTestId('time-slots-count').textContent).toBe('3');
    expect(screen.getByTestId('active-category').textContent).toBe('pottybreaks');
    expect(screen.getByTestId('selected-time-slot').textContent).toBe('9:00 AM');
  });

  test('does not render when selectedDog is null', () => {
    render(<ObservationDialogManager {...defaultProps} selectedDog={null} />);
    
    expect(screen.queryByTestId('observation-dialog')).not.toBeInTheDocument();
  });
});
