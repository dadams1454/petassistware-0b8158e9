
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TimeSlotCell from '../TimeSlotCell';
import * as TouchHandler from '../components/cell/TouchHandler';

// Mock the child components
jest.mock('../components/cell/CellBackground', () => ({
  __esModule: true,
  default: ({ isActive, isIncident, isCurrentHour, hasCareLogged }) => (
    <div data-testid="cell-background" 
      data-active={isActive} 
      data-incident={isIncident} 
      data-current-hour={isCurrentHour}
      data-care-logged={hasCareLogged}>
      Background
    </div>
  )
}));

jest.mock('../components/cell/AnimatedCellContent', () => ({
  __esModule: true,
  default: ({ isActive }) => (
    <div data-testid="cell-content" data-active={isActive}>Content</div>
  )
}));

// Mock the useTouchHandler hook
jest.spyOn(TouchHandler, 'useTouchHandler').mockImplementation(() => ({
  handleTouchStart: jest.fn(),
  handleTouchEnd: jest.fn(),
  handleTouchMove: jest.fn(),
  touchTimeoutRef: { current: null }
}));

describe('TimeSlotCell Component', () => {
  const defaultProps = {
    dogId: 'dog1',
    dogName: 'Buddy',
    timeSlot: '10:00 AM',
    category: 'pottybreaks',
    hasPottyBreak: false,
    hasCareLogged: false,
    onClick: jest.fn(),
    onContextMenu: jest.fn(),
    flags: [],
    isCurrentHour: false,
    isIncident: false,
    isActive: false
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders cell with correct attributes', () => {
    render(<TimeSlotCell {...defaultProps} />);
    
    const cell = screen.getByRole('cell');
    expect(cell).toHaveAttribute('data-dogid', 'dog1');
    expect(cell).toHaveAttribute('data-timeslot', '10:00 AM');
  });

  test('handles click events', () => {
    render(<TimeSlotCell {...defaultProps} />);
    
    fireEvent.click(screen.getByRole('cell'));
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  test('handles context menu events', () => {
    render(<TimeSlotCell {...defaultProps} />);
    
    fireEvent.contextMenu(screen.getByRole('cell'));
    expect(defaultProps.onContextMenu).toHaveBeenCalledTimes(1);
  });

  test('updates state on hover', () => {
    render(<TimeSlotCell {...defaultProps} />);
    
    const cell = screen.getByRole('cell');
    
    // Simulate mouse enter
    fireEvent.mouseEnter(cell);
    expect(screen.getByTestId('cell-background')).toHaveAttribute('data-active', 'true');
    expect(screen.getByTestId('cell-content')).toHaveAttribute('data-active', 'true');
    
    // Simulate mouse leave
    fireEvent.mouseLeave(cell);
    expect(screen.getByTestId('cell-background')).toHaveAttribute('data-active', 'false');
    expect(screen.getByTestId('cell-content')).toHaveAttribute('data-active', 'false');
  });

  test('properly displays active state from props', () => {
    render(<TimeSlotCell {...defaultProps} isActive={true} />);
    
    expect(screen.getByTestId('cell-background')).toHaveAttribute('data-active', 'true');
    expect(screen.getByTestId('cell-content')).toHaveAttribute('data-active', 'true');
  });

  test('properly displays incident state', () => {
    render(<TimeSlotCell {...defaultProps} isIncident={true} />);
    
    expect(screen.getByTestId('cell-background')).toHaveAttribute('data-incident', 'true');
  });

  test('properly displays current hour state', () => {
    render(<TimeSlotCell {...defaultProps} isCurrentHour={true} />);
    
    expect(screen.getByTestId('cell-background')).toHaveAttribute('data-current-hour', 'true');
  });

  test('properly displays care logged state', () => {
    render(<TimeSlotCell {...defaultProps} hasCareLogged={true} />);
    
    expect(screen.getByTestId('cell-background')).toHaveAttribute('data-care-logged', 'true');
  });
});
