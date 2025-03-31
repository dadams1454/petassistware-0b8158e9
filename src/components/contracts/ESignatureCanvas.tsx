
import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Eraser, Save, X } from 'lucide-react';

interface ESignatureCanvasProps {
  onChange: (signature: string) => void;
  initialSignature?: string;
  height?: number;
  width?: number;
}

const ESignatureCanvas: React.FC<ESignatureCanvasProps> = ({
  onChange,
  initialSignature,
  height = 200,
  width = 400,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  // Initialize canvas and context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Clear canvas
    context.fillStyle = '#f9fafb';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw border
    context.strokeStyle = '#d1d5db';
    context.lineWidth = 1;
    context.strokeRect(0, 0, canvas.width, canvas.height);
    
    // Load initial signature if provided
    if (initialSignature) {
      const img = new Image();
      img.onload = () => {
        context.drawImage(img, 0, 0);
        setHasSignature(true);
      };
      img.src = initialSignature;
    }
    
    // Setup drawing style
    context.strokeStyle = '#000';
    context.lineWidth = 2;
    context.lineCap = 'round';
    context.lineJoin = 'round';
  }, [initialSignature]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    setHasSignature(true);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Get coordinates
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    // Start new path
    context.beginPath();
    context.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Get coordinates
    let clientX, clientY;
    if ('touches' in e) {
      e.preventDefault(); // Prevent scrolling on touch devices
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    // Draw line
    context.lineTo(x, y);
    context.stroke();
  };

  const endDrawing = () => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    context.closePath();
    setIsDrawing(false);
    
    // Save signature
    const signatureDataUrl = canvas.toDataURL('image/png');
    onChange(signatureDataUrl);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Clear canvas
    context.fillStyle = '#f9fafb';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw border
    context.strokeStyle = '#d1d5db';
    context.lineWidth = 1;
    context.strokeRect(0, 0, canvas.width, canvas.height);
    
    // Reset drawing style
    context.strokeStyle = '#000';
    context.lineWidth = 2;
    
    setHasSignature(false);
    onChange('');
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative border border-gray-300 rounded-md">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="touch-none cursor-crosshair rounded-md"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={endDrawing}
        />
        {!hasSignature && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
            Sign here
          </div>
        )}
      </div>
      <div className="flex space-x-2">
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={clearSignature}
          disabled={!hasSignature}
        >
          <Eraser className="w-4 h-4 mr-2" />
          Clear
        </Button>
      </div>
    </div>
  );
};

export default ESignatureCanvas;
