
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface VerificationSectionProps {
  completedBy: string;
  setCompletedBy: (value: string) => void;
  verifiedBy: string;
  setVerifiedBy: (value: string) => void;
  comments: string;
  setComments: (value: string) => void;
  onSave: () => void;
}

const VerificationSection: React.FC<VerificationSectionProps> = ({
  completedBy,
  setCompletedBy,
  verifiedBy,
  setVerifiedBy,
  comments,
  setComments,
  onSave,
}) => {
  return (
    <>
      {/* Signature and Verification */}
      <div className="p-4 border-t mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">Completed By:</h3>
            <Input
              value={completedBy}
              onChange={(e) => setCompletedBy(e.target.value)}
              className="mb-1"
            />
            <div className="text-center mt-1 text-sm">Signature</div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Verified By:</h3>
            <Input
              value={verifiedBy}
              onChange={(e) => setVerifiedBy(e.target.value)}
              className="mb-1"
            />
            <div className="text-center mt-1 text-sm">Supervisor Signature</div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="p-4 border-t">
        <h3 className="font-semibold mb-2">Additional Comments or Issues:</h3>
        <Textarea
          className="w-full h-24"
          placeholder="Enter any issues, special circumstances, or follow-up items here..."
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />
      </div>

      {/* Save Button */}
      <div className="p-4 border-t flex justify-end">
        <Button onClick={onSave} className="gap-2">
          <CheckCircle className="h-4 w-4" />
          Save Checklist
        </Button>
      </div>
    </>
  );
};

export default VerificationSection;
