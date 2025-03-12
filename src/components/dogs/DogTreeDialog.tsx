
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil, Plus } from "lucide-react";
import DogDetails from './DogDetails';
import { useNavigate } from 'react-router-dom';

interface DogTreeDialogProps {
  dog: any;
  isOpen: boolean;
  onClose: () => void;
}

const DogTreeDialog = ({ dog, isOpen, onClose }: DogTreeDialogProps) => {
  const navigate = useNavigate();

  const handleEditDog = () => {
    navigate(`/dogs/${dog.id}/edit`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Dog Details</span>
            <div className="space-x-2">
              <Button variant="outline" size="sm" onClick={handleEditDog}>
                <Pencil className="h-4 w-4 mr-1" /> Edit
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        <DogDetails dog={dog} />
      </DialogContent>
    </Dialog>
  );
};

export default DogTreeDialog;
