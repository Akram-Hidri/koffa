
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { formatInviteCodeForDisplay, normalizeInviteCode, isValidInviteCodeCharacter } from '@/utils/inviteUtils';
import { cn } from '@/lib/utils';

interface InviteCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidChange?: (isValid: boolean) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const InviteCodeInput: React.FC<InviteCodeInputProps> = ({
  value,
  onChange,
  onValidChange,
  placeholder = "XXXX-XXXX",
  className,
  disabled = false
}) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.toUpperCase();
    
    // Filter out invalid characters
    const validChars = inputValue
      .split('')
      .filter(char => isValidInviteCodeCharacter(char) || char === '-')
      .join('');
    
    // Limit to 9 characters (8 chars + 1 hyphen)
    const limitedValue = validChars.slice(0, 9);
    
    // Get the clean code for validation
    const cleanCode = normalizeInviteCode(limitedValue);
    
    // Update local state with formatted display value
    const displayValue = formatInviteCodeForDisplay(cleanCode);
    setLocalValue(displayValue);
    
    // Call onChange with clean code
    onChange(cleanCode);
    
    // Call onValidChange if provided
    if (onValidChange) {
      onValidChange(cleanCode.length === 8);
    }
  };

  const isValid = normalizeInviteCode(localValue).length === 8;
  const isEmpty = !localValue.trim();

  return (
    <Input
      type="text"
      value={localValue}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      className={cn(
        'font-mono tracking-wider text-center transition-colors',
        !isEmpty && isValid && 'border-green-500 focus:border-green-500',
        !isEmpty && !isValid && 'border-red-500 focus:border-red-500',
        className
      )}
      maxLength={9}
    />
  );
};

export default InviteCodeInput;
