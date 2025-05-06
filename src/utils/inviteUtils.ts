
import { formatInviteCode } from "@/contexts/settings/settingsUtils";

export const generateInviteCode = () => {
  // Generate a random 8-character alphanumeric code
  const characters = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789'; // Removed confusing chars like O/0
  let code = '';
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }
  return code;
};

export const formatInviteCodeForDisplay = (code: string) => {
  // Format like XXXX-XXXX for better readability
  if (code.length === 8) {
    return `${code.substring(0, 4)}-${code.substring(4)}`;
  }
  return code;
};
