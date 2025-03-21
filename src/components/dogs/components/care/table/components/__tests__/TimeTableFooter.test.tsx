
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TimeTableFooter from '../TimeTableFooter';

// Mock the Info icon
jest.mock('lucide-react', () => ({
  Info: () => <div data-testid="info-icon">Info Icon</div>
}));

describe('TimeTableFooter Component', () => {
  const defaultProps = {
    isLoading: false,
    onRefresh: jest.fn(),
    lastUpdateTime: '3:45 PM',
    currentDate: new Date(2023, 3, 1, 15, 45, 0)
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders with last updated time when not loading', () => {
    render(<TimeTableFooter {...defaultProps} />);
    
    expect(screen.getByTestId('info-icon')).toBeInTheDocument();
    expect(screen.getByText('Last updated: 3:45 PM')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /manual refresh/i })).toBeInTheDocument();
  });

  test('shows loading state when isLoading is true', () => {
    render(<TimeTableFooter {...defaultProps} isLoading={true} />);
    
    expect(screen.getByText('Refreshing data...')).toBeInTheDocument();
  });

  test('calls onRefresh when refresh button is clicked', () => {
    render(<TimeTableFooter {...defaultProps} />);
    
    const refreshButton = screen.getByRole('button', { name: /manual refresh/i });
    fireEvent.click(refreshButton);
    
    expect(defaultProps.onRefresh).toHaveBeenCalledTimes(1);
  });

  test('shows condensed text on small screens', () => {
    // Mock window.matchMedia for small screen
    Object.defineProperty(window, 'matchMedia', {
      value: jest.fn().mockImplementation(query => ({
        matches: true, // This simulates a small screen
        media: query,
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
    
    render(<TimeTableFooter {...defaultProps} />);
    
    expect(screen.getByText('Updated: 3:45 PM')).toBeInTheDocument();
  });
});
