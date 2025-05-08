
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { formatInviteCodeForDisplay } from '@/utils/inviteUtils';

interface JoinFamilySectionProps {
  inviteCode: string;
  inviteCodeValid: boolean | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onValidate: () => Promise<void>;
  isLoading: boolean;
}

const JoinFamilySection: React.FC<JoinFamilySectionProps> = ({ 
  inviteCode, 
  inviteCodeValid, 
  onChange, 
  onValidate, 
  isLoading 
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-koffa-green">Invitation Code</label>
      <div className="flex space-x-2">
        <Input 
          name="inviteCode"
          value={formatInviteCodeForDisplay(inviteCode)}
          onChange={onChange}
          className="border-koffa-beige focus-visible:ring-koffa-green font-mono"
          placeholder="XXXX-XXXX"
          required
        />
        <Button 
          type="button" 
          variant="outline"
          onClick={onValidate}
          disabled={isLoading || !inviteCode}
        >
          Verify
        </Button>
      </div>
      {inviteCodeValid === true && (
        <p className="text-xs text-green-600 font-medium">
          Valid invitation code - you'll be added to a family
        </p>
      )}
      {inviteCodeValid === false && (
        <p className="text-xs text-red-500 font-medium">
          Invalid or expired invitation code
        </p>
      )}
    </div>
  );
};

export default JoinFamilySection;
