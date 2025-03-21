
import React from 'react';
import { render, screen } from '@testing-library/react';
import { TimeManagerProvider, useTimeManager } from '../TimeManager';

// Mock the generateTimeSlots function
jest.mock('../../dogGroupColors', () => ({
  generateTimeSlots: jest.fn().mockImplementation(() => ['9:00 AM', '10:00 AM', '11:00 AM'])
}));

// Test component that uses the TimeManager context
const TestComponent = () => {
  const { currentHour, timeSlots } = useTimeManager();
  return (
    <div>
      <div data-testid="current-hour">{currentHour}</div>
      <ul>
        {timeSlots.map((slot, i) => (
          <li key={i} data-testid="time-slot">{slot}</li>
        ))}
      </ul>
    </div>
  );
};

describe('TimeManagerProvider', () => {
  beforeEach(() => {
    // Mock Date.now and new Date()
    const mockDate = new Date(2023, 3, 1, 15, 0, 0); // April 1st, 2023, 3:00 PM
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate as unknown as Date);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('provides current hour and time slots', () => {
    render(
      <TimeManagerProvider activeCategory="pottybreaks">
        <TestComponent />
      </TimeManagerProvider>
    );
    
    // Current hour should be 15 (3 PM)
    expect(screen.getByTestId('current-hour').textContent).toBe('15');
    
    // Should have 3 time slots based on our mock
    const timeSlots = screen.getAllByTestId('time-slot');
    expect(timeSlots).toHaveLength(3);
    expect(timeSlots[0].textContent).toBe('9:00 AM');
    expect(timeSlots[1].textContent).toBe('10:00 AM');
    expect(timeSlots[2].textContent).toBe('11:00 AM');
  });

  test('throws error when used outside provider', () => {
    // Suppress console.error for this test to avoid noisy output
    const originalError = console.error;
    console.error = jest.fn();
    
    // The render should throw an error
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useTimeManager must be used within a TimeManagerProvider');
    
    // Restore console.error
    console.error = originalError;
  });
});
