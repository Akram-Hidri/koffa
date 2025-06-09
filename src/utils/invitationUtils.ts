
import { supabase } from '@/integrations/supabase/client';
import { generateInviteCode, normalizeInviteCode, validateInviteCodeFormat } from './inviteUtils';
import { toast } from 'sonner';

/**
 * Creates a new invitation for a family
 */
export const createFamilyInvitation = async (familyId: string, userId: string) => {
  try {
    const code = generateInviteCode();
    
    const { data, error } = await supabase
      .from('invitations')
      .insert({
        code,
        family_id: familyId,
        created_by: userId
      })
      .select();
    
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error("Error creating family invitation:", error);
    throw error;
  }
};

/**
 * Verifies if an invite code is valid and returns family information
 */
export const verifyInviteCode = async (code: string) => {
  try {
    // Validate format first
    const { isValid, cleanCode, errors } = validateInviteCodeFormat(code);
    
    if (!isValid) {
      console.log("Invalid invite code format:", errors);
      return { valid: false, familyId: null, error: errors[0] };
    }
    
    console.log("Verifying cleaned invite code:", cleanCode);
    
    // Check if the invitation exists and is valid
    const { data: inviteData, error: inviteError } = await supabase
      .from('invitations')
      .select('*')
      .eq('code', cleanCode)
      .eq('is_used', false)
      .single();
      
    if (inviteError || !inviteData) {
      console.log("No valid invitation found with code:", cleanCode);
      return { valid: false, familyId: null, error: "Invalid invitation code" };
    }
    
    // Check if the code is expired
    const isExpired = new Date(inviteData.expires_at) <= new Date();
    
    if (isExpired) {
      console.log("Invitation has expired:", inviteData.expires_at);
      return { valid: false, familyId: null, error: "Invitation has expired" };
    }
    
    console.log("Invitation found and valid:", { 
      isValid: true, 
      isUsed: inviteData.is_used,
      expires: inviteData.expires_at,
      currentTime: new Date().toISOString()
    });
    
    return { 
      valid: true, 
      familyId: inviteData.family_id,
      invitation: inviteData
    };
  } catch (error) {
    console.error('Error verifying invite code:', error);
    return { valid: false, familyId: null, error: "Failed to verify invitation code" };
  }
};

/**
 * Processes and uses an invitation code to join a family
 */
export const useInviteCode = async (code: string, userId: string) => {
  try {
    // Validate and normalize the code
    const { isValid, cleanCode, errors } = validateInviteCodeFormat(code);
    
    if (!isValid) {
      throw new Error(errors[0]);
    }
    
    // Verify the invitation is valid
    const verification = await verifyInviteCode(cleanCode);
    
    if (!verification.valid) {
      throw new Error(verification.error || 'Invalid invitation code');
    }
    
    const familyId = verification.familyId;
    
    // Begin transaction-like operations
    const { error: updateError } = await supabase
      .from('invitations')
      .update({ is_used: true })
      .eq('code', cleanCode);
      
    if (updateError) throw updateError;
    
    // Update user's profile with family_id
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ family_id: familyId })
      .eq('id', userId);
      
    if (profileError) throw profileError;
    
    // Add user as family member
    const { error: memberError } = await supabase
      .from('family_members')
      .insert({
        family_id: familyId,
        user_id: userId,
        role: 'member'
      });
      
    if (memberError) throw memberError;
    
    return { success: true, familyId };
  } catch (error) {
    console.error('Error using invite code:', error);
    throw error;
  }
};

/**
 * Gets all pending invitations for a family
 */
export const getFamilyInvitations = async (familyId: string) => {
  const { data, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('family_id', familyId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

/**
 * Gets invitation statistics for a family
 */
export const getInvitationStats = async (familyId: string) => {
  const { data, error } = await supabase
    .from('invitations')
    .select('is_used, expires_at')
    .eq('family_id', familyId);
  
  if (error) throw error;
  
  const now = new Date();
  const stats = {
    total: data.length,
    active: data.filter(inv => !inv.is_used && new Date(inv.expires_at) > now).length,
    used: data.filter(inv => inv.is_used).length,
    expired: data.filter(inv => !inv.is_used && new Date(inv.expires_at) <= now).length
  };
  
  return stats;
};
