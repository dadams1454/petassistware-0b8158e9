
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AnimatedCellContent from '../AnimatedCellContent';

// Mock the CellContent component
jest.mock('../../CellContent', () => ({
  __esModule: true,
  default: ({ 
    dogName, 
    timeSlot, 
    category, 
    hasPottyBreak, 
    hasCareLogged,
    isCurrentHour,
    isIncident
  }) => (
    <div data-testid="cell-content"
      data-dog-name={dogName}
      data-time-slot={timeSlot}
      data-category={category}
      data-potty-break={hasPottyBreak}
      data-care-logged={hasCareLogged}
      data-current-hour={isCurrentHour}
      data-incident={isIncident}>
      Mock Cell Content
    </div>
  )
}));

// Mock the AnimatedCell component
jest.mock('../../AnimatedCell', () => ({
  __esModule: true,
  default: ({ isActive, children, className }) => (
    <div data-testid="animated-cell" data-active={isActive} className={className}>
      {children}
    </div>
  )
}));

describe('AnimatedCellContent Component', () => {
  const defaultProps = {
    dogName: 'Buddy',
    timeSlot: '10:00 AM',
    category: 'pottybreaks',
    hasPottyBreak: false,
    hasCareLogged: false,
    isActive: false,
    isCurrentHour: false,
    isIncident: false
  };

  test('renders with correct props when inactive', () => {
    render(<AnimatedCellContent {...defaultProps} />);
    
    const animatedCell = screen.getByTestId('animated-cell');
    expect(animatedCell).toHaveAttribute('data-active', 'false');
    
    const cellContent = screen.getByTestId('cell-content');
    expect(cellContent).toHaveAttribute('data-dog-name', 'Buddy');
    expect(cellContent).toHaveAttribute('data-time-slot', '10:00 AM');
    expect(cellContent).toHaveAttribute('data-category', 'pottybreaks');
    expect(cellContent).toHaveAttribute('data-potty-break', 'false');
    expect(cellContent).toHaveAttribute('data-care-logged', 'false');
    expect(cellContent).toHaveAttribute('data-current-hour', 'false');
    expect(cellContent).toHaveAttribute('data-incident', 'false');
  });

  test('renders with correct props when active', () => {
    render(<AnimatedCellContent {...defaultProps} isActive={true} />);
    
    const animatedCell = screen.getByTestId('animated-cell');
    expect(animatedCell).toHaveAttribute('data-active', 'true');
    
    // When active, hasPottyBreak and hasCareLogged should be true
    const cellContent = screen.getByTestId('cell-content');
    expect(cellContent).toHaveAttribute('data-potty-break', 'true');
    expect(cellContent).toHaveAttribute('data-care-logged', 'true');
  });

  test('respects other props', () => {
    render(
      <AnimatedCellContent 
        {...defaultProps} 
        isCurrentHour={true} 
        isIncident={true}
        hasPottyBreak={true}
        hasCareLogged={true}
      />
    );
    
    const cellContent = screen.getByTestId('cell-content');
    expect(cellContent).toHaveAttribute('data-current-hour', 'true');
    expect(cellContent).toHaveAttribute('data-incident', 'true');
    expect(cellContent).toHaveAttribute('data-potty-break', 'true');
    expect(cellContent).toHaveAttribute('data-care-logged', 'true');
  });
});
