
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
  if (!code) return '';
  
  // First, clean the code by removing non-alphanumeric characters
  const cleanedCode = code.replace(/[^A-Z0-9]/gi, '').toUpperCase();
  
  // Format it if it's long enough
  if (cleanedCode.length > 4) {
    return `${cleanedCode.substring(0, 4)}-${cleanedCode.substring(4, 8)}`;
  } else {
    return cleanedCode;
  }
};

export const normalizeInviteCode = (code: string) => {
  // Remove any non-alphanumeric characters and convert to uppercase
  return code.replace(/[^A-Z0-9]/gi, '').toUpperCase();
};
