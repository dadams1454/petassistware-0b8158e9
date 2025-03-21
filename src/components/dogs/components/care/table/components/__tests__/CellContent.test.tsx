
import React from 'react';
import { render, screen } from '@testing-library/react';
import CellContent from '../CellContent';

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  Check: () => <div data-testid="check-icon">Check Icon</div>,
  AlertTriangle: () => <div data-testid="alert-icon">Alert Icon</div>,
  UtensilsCrossed: () => <div data-testid="utensils-icon">Utensils Icon</div>,
  Clock: () => <div data-testid="clock-icon">Clock Icon</div>
}));

describe('CellContent Component', () => {
  const defaultProps = {
    dogName: 'Buddy',
    timeSlot: '10:00 AM',
    category: 'pottybreaks',
    hasPottyBreak: false,
    hasCareLogged: false
  };

  test('renders empty cell for potty breaks when no indicators', () => {
    render(<CellContent {...defaultProps} />);
    
    expect(screen.queryByTestId('check-icon')).not.toBeInTheDocument();
    expect(screen.queryByTestId('alert-icon')).not.toBeInTheDocument();
  });

  test('renders check icon for potty break logged', () => {
    render(<CellContent {...defaultProps} hasPottyBreak={true} />);
    
    expect(screen.getByTestId('check-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('alert-icon')).not.toBeInTheDocument();
  });
  
  test('renders check icon for care logged', () => {
    render(<CellContent {...defaultProps} hasCareLogged={true} />);
    
    expect(screen.getByTestId('check-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('alert-icon')).not.toBeInTheDocument();
  });

  test('renders alert icon for incident', () => {
    render(<CellContent {...defaultProps} hasPottyBreak={true} isIncident={true} />);
    
    expect(screen.getByTestId('alert-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('check-icon')).not.toBeInTheDocument();
  });

  test('renders current hour indicator when no other indicators', () => {
    render(<CellContent {...defaultProps} isCurrentHour={true} />);
    
    expect(screen.getByTestId('cell-content')).toContainElement(
      screen.getByRole('presentation', { hidden: true })
    );
  });

  test('renders feeding icon for feeding category', () => {
    render(<CellContent {...defaultProps} category="feeding" />);
    
    expect(screen.getByTestId('utensils-icon')).toBeInTheDocument();
    expect(screen.getByText('10:00 AM')).toBeInTheDocument();
  });

  test('renders fed status for feeding when care logged', () => {
    render(<CellContent {...defaultProps} category="feeding" hasCareLogged={true} />);
    
    expect(screen.getByTestId('check-icon')).toBeInTheDocument();
    expect(screen.getByText('Fed')).toBeInTheDocument();
  });

  test('renders alert for feeding incident', () => {
    render(<CellContent {...defaultProps} category="feeding" isIncident={true} />);
    
    expect(screen.getByTestId('alert-icon')).toBeInTheDocument();
  });
});
