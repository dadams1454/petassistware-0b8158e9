
import React, { useState, createContext, useContext, ReactNode } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface ConfirmDialogProps {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

interface ConfirmContextProps {
  showConfirmation: (props: ConfirmDialogProps) => void;
}

const ConfirmContext = createContext<ConfirmContextProps | undefined>(undefined);

export const ConfirmProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogProps, setDialogProps] = useState<ConfirmDialogProps | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const showConfirmation = (props: ConfirmDialogProps) => {
    setDialogProps(props);
    setDialogOpen(true);
  };

  const handleConfirm = async () => {
    if (!dialogProps) return;
    
    setIsLoading(true);
    try {
      await dialogProps.onConfirm();
    } finally {
      setIsLoading(false);
      setDialogOpen(false);
    }
  };

  const handleCancel = () => {
    if (dialogProps?.onCancel) {
      dialogProps.onCancel();
    }
    setDialogOpen(false);
  };

  return (
    <ConfirmContext.Provider value={{ showConfirmation }}>
      {children}
      
      {dialogProps && (
        <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{dialogProps.title}</AlertDialogTitle>
              <AlertDialogDescription>
                {dialogProps.description}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancel} disabled={isLoading}>
                {dialogProps.cancelLabel || 'Cancel'}
              </AlertDialogCancel>
              <Button 
                variant={dialogProps.variant || 'default'}
                onClick={handleConfirm}
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {dialogProps.confirmLabel || 'Confirm'}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (context === undefined) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context;
};
