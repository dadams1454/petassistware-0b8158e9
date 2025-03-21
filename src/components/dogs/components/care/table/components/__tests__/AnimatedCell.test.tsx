
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AnimatedCell from '../AnimatedCell';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ className, animate, children }: any) => (
      <div 
        className={className} 
        data-testid="motion-div"
        data-animate-scale={animate.scale}
        data-animate-bg={animate.backgroundColor}
      >
        {children}
      </div>
    )
  }
}));

describe('AnimatedCell Component', () => {
  test('renders with default props', () => {
    render(
      <AnimatedCell isActive={false}>
        <div data-testid="child">Child content</div>
      </AnimatedCell>
    );
    
    const motionDiv = screen.getByTestId('motion-div');
    expect(motionDiv).toHaveClass('w-full h-full');
    expect(motionDiv).toHaveAttribute('data-animate-scale', '1');
    expect(motionDiv).toHaveAttribute('data-animate-bg', 'rgba(255, 255, 255, 0)');
    
    // Check that children are rendered
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
  
  test('renders with active state', () => {
    render(
      <AnimatedCell isActive={true}>
        <div data-testid="child">Child content</div>
      </AnimatedCell>
    );
    
    const motionDiv = screen.getByTestId('motion-div');
    expect(motionDiv).toHaveAttribute('data-animate-scale', '1.02');
    expect(motionDiv).toHaveAttribute('data-animate-bg', 'rgba(34, 197, 94, 0.2)');
  });
  
  test('applies custom className', () => {
    render(
      <AnimatedCell isActive={false} className="test-class">
        <div>Child content</div>
      </AnimatedCell>
    );
    
    const motionDiv = screen.getByTestId('motion-div');
    expect(motionDiv).toHaveClass('test-class');
    expect(motionDiv).toHaveClass('w-full h-full');
  });
});
