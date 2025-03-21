
import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useTouchHandler } from '../TouchHandler';

// Mock timers
jest.useFakeTimers();

describe('useTouchHandler Hook', () => {
  // Mock event
  const mockTouchEvent = {
    touches: [{ clientX: 100, clientY: 100 }]
  } as unknown as React.TouchEvent;

  const mockMouseEvent = {
    bubbles: true,
    cancelable: true,
    view: window,
    clientX: 100,
    clientY: 100
  } as unknown as React.MouseEvent;

  test('handles touch start and end correctly', () => {
    const onContextMenu = jest.fn();
    const { result } = renderHook(() => useTouchHandler(onContextMenu));

    // Start touch
    act(() => {
      result.current.handleTouchStart(mockTouchEvent);
    });

    // End touch quickly (should not trigger long press)
    act(() => {
      result.current.handleTouchEnd();
    });

    // Fast-forward time
    jest.advanceTimersByTime(1000);

    // Context menu should not be called for quick tap
    expect(onContextMenu).not.toHaveBeenCalled();
  });

  test('handles long press correctly', () => {
    const onContextMenu = jest.fn();
    const { result } = renderHook(() => useTouchHandler(onContextMenu));

    // Start touch
    act(() => {
      result.current.handleTouchStart(mockTouchEvent);
    });

    // Fast-forward time past the long press threshold (800ms)
    jest.advanceTimersByTime(850);

    // Context menu should be called for long press
    expect(onContextMenu).toHaveBeenCalled();
  });

  test('cancels long press when touch moves', () => {
    const onContextMenu = jest.fn();
    const { result } = renderHook(() => useTouchHandler(onContextMenu));

    // Start touch
    act(() => {
      result.current.handleTouchStart(mockTouchEvent);
    });

    // Move touch during threshold period
    act(() => {
      result.current.handleTouchMove();
    });

    // Fast-forward time
    jest.advanceTimersByTime(1000);

    // Context menu should not be called
    expect(onContextMenu).not.toHaveBeenCalled();
  });

  test('cleans up timeout on unmount', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    const { result, unmount } = renderHook(() => useTouchHandler(jest.fn()));

    // Start touch
    act(() => {
      result.current.handleTouchStart(mockTouchEvent);
    });

    // Unmount component
    unmount();

    // Timeout should be cleared
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  test('does nothing if no onContextMenu handler provided', () => {
    const { result } = renderHook(() => useTouchHandler(undefined));

    // Start touch
    act(() => {
      result.current.handleTouchStart(mockTouchEvent);
    });

    // Fast-forward time
    jest.advanceTimersByTime(1000);

    // No errors should occur
    expect(true).toBeTruthy();
  });
});
