
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CellBackground from '../CellBackground';

describe('CellBackground Component', () => {
  const defaultProps = {
    dogId: 'dog1',
    category: 'pottybreaks',
  };

  test('renders with default styling', () => {
    render(<CellBackground {...defaultProps} />);
    
    const background = screen.getByRole('presentation', { hidden: true });
    expect(background).toHaveClass('bg-white');
    expect(background).toHaveClass('border-transparent');
  });

  test('applies incident styling (highest priority)', () => {
    render(
      <CellBackground 
        {...defaultProps} 
        isIncident={true} 
        isActive={true} 
        isCurrentHour={true} 
        hasCareLogged={true}
      />
    );
    
    const background = screen.getByRole('presentation', { hidden: true });
    expect(background).toHaveClass('bg-red-50');
    expect(background).toHaveClass('border-red-200');
  });

  test('applies active styling when incident is false', () => {
    render(
      <CellBackground 
        {...defaultProps} 
        isIncident={false} 
        isActive={true} 
        isCurrentHour={true} 
        hasCareLogged={true}
      />
    );
    
    const background = screen.getByRole('presentation', { hidden: true });
    expect(background).toHaveClass('bg-blue-50');
    expect(background).toHaveClass('border-blue-200');
  });

  test('applies current hour styling for potty breaks when incident and active are false', () => {
    render(
      <CellBackground 
        {...defaultProps} 
        isIncident={false} 
        isActive={false} 
        isCurrentHour={true} 
        hasCareLogged={true}
      />
    );
    
    const background = screen.getByRole('presentation', { hidden: true });
    expect(background).toHaveClass('bg-blue-50/50');
    expect(background).toHaveClass('border-blue-100');
  });

  test('applies care logged styling when all other conditions are false', () => {
    render(
      <CellBackground 
        {...defaultProps} 
        isIncident={false} 
        isActive={false} 
        isCurrentHour={false} 
        hasCareLogged={true}
      />
    );
    
    const background = screen.getByRole('presentation', { hidden: true });
    expect(background).toHaveClass('bg-green-50/50');
    expect(background).toHaveClass('border-green-100');
  });
});
