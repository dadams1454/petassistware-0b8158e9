
declare module 'react-signature-canvas' {
  import * as React from 'react';

  export interface SignatureCanvasProps {
    canvasProps?: React.CanvasHTMLAttributes<HTMLCanvasElement>;
    clearOnResize?: boolean;
    onBegin?: () => void;
    onEnd?: () => void;
    penColor?: string;
    backgroundColor?: string;
    dotSize?: number;
    minWidth?: number;
    maxWidth?: number;
    throttle?: number;
    velocityFilterWeight?: number;
  }

  export default class SignatureCanvas extends React.Component<SignatureCanvasProps> {
    clear(): void;
    isEmpty(): boolean;
    fromDataURL(dataURL: string, options?: object): void;
    toDataURL(type?: string, encoderOptions?: number): string;
    on(): void;
    off(): void;
  }
}
