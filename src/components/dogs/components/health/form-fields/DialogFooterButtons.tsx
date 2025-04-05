
import { Button } from "@/components/ui/button";

interface DialogFooterButtonsProps {
  onCancel: () => void;
  isSubmitting: boolean;
  isEdit?: boolean;
  disabled?: boolean;
}

const DialogFooterButtons = ({
  onCancel,
  isSubmitting,
  isEdit = false,
  disabled = false
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
        {isSubmitting ? 'Saving...' : isEdit ? 'Update' : 'Save'}
      </Button>
    </div>
  );
};

export default DialogFooterButtons;
