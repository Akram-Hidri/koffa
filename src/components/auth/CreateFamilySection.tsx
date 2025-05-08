
import React from 'react';
import { Input } from '@/components/ui/input';

interface CreateFamilySectionProps {
  familyName: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CreateFamilySection: React.FC<CreateFamilySectionProps> = ({ familyName, onChange }) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-koffa-green">Family Name</label>
      <Input 
        name="familyName"
        value={familyName}
        onChange={onChange}
        className="border-koffa-beige focus-visible:ring-koffa-green"
        placeholder="Your family name"
        required
      />
    </div>
  );
};

export default CreateFamilySection;
