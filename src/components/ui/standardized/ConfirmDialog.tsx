
import React from 'react';
import { Button } from '@/components/ui/button';

export interface ConfirmDialogProps {
  children?: React.ReactNode;
  title: string;
  description?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  confirmText?: string;
  confirmLabel?: string; // Added for backward compatibility
  cancelText?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  isLoading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ 
  children,
  title,
  description,
  open,
  onOpenChange,
  onConfirm,
  confirmText,
  confirmLabel,
  cancelText = "Cancel",
  variant = "destructive",
  isLoading = false
}) => {
  // Use either confirmText or confirmLabel (for backward compatibility)
  const buttonText = confirmText || confirmLabel || "Confirm";

  return (
    <div>
      {children}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-2">{title}</h3>
            {description && <p className="text-muted-foreground mb-4">{description}</p>}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>{cancelText}</Button>
              <Button variant={variant} onClick={onConfirm} disabled={isLoading}>
                {isLoading ? "Loading..." : buttonText}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmDialog;
