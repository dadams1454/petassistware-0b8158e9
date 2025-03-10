
import React from "react";
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onCancel: () => void;
  isLoading: boolean;
  isEditMode: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({ 
  onCancel, 
  isLoading, 
  isEditMode 
}) => {
  return (
    <div className="flex justify-between pt-4">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : isEditMode ? "Update Customer" : "Add Customer"}
      </Button>
    </div>
  );
};

export default FormActions;
