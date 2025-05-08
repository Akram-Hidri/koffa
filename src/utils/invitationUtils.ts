
import { supabase } from '@/integrations/supabase/client';
import { generateInviteCode, normalizeInviteCode } from './inviteUtils';
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
    return code;
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
    // Clean the code before verifying
    const cleanCode = normalizeInviteCode(code);
    
    console.log("Verifying cleaned invite code:", cleanCode);
    
    // Check if code exists and is not used
    const { data, error } = await supabase
      .rpc('is_valid_invite_code', { code_param: cleanCode });
      
    if (error) {
      console.error("Error verifying invite code:", error);
      throw error;
    }
    
    // Get family info if valid
    let familyId = null;
    if (data) {
      const { data: inviteData, error: inviteError } = await supabase
        .from('invitations')
        .select('family_id')
        .eq('code', cleanCode)
        .single();
        
      if (!inviteError && inviteData) {
        familyId = inviteData.family_id;
      }
    }
    
    // Return validity and family info
    return { valid: !!data, familyId };
  } catch (error) {
    console.error('Error verifying invite code:', error);
    return { valid: false, familyId: null };
  }
};

/**
 * Processes and uses an invitation code to join a family
 */
export const useInviteCode = async (code: string, userId: string) => {
  try {
    // Normalize the code
    const cleanCode = normalizeInviteCode(code);
    
    // Get the invitation details
    const { data: invitation, error: invitationError } = await supabase
      .from('invitations')
      .select('family_id, is_used, expires_at')
      .eq('code', cleanCode)
      .maybeSingle();
      
    if (invitationError) throw invitationError;
    
    if (!invitation || invitation.is_used || new Date(invitation.expires_at) < new Date()) {
      throw new Error('Invalid or expired invitation code');
    }
    
    const familyId = invitation.family_id;
    
    // Begin transaction to update invitation and user profile
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
