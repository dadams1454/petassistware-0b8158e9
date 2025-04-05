
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface DialogFooterButtonsProps {
  onCancel: () => void;
  isSubmitting: boolean;
  isEdit?: boolean;
  disabled?: boolean;
  submitLabel?: string; // Added for compatibility
}

const DialogFooterButtons = ({
  onCancel,
  isSubmitting,
  isEdit = false,
  disabled = false,
  submitLabel
}: DialogFooterButtonsProps) => {
  return (
    <div className="flex justify-end space-x-2 mt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting || disabled}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={isSubmitting || disabled}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : submitLabel || (isEdit ? 'Update' : 'Save')}
      </Button>
    </div>
  );
};

export default DialogFooterButtons;
