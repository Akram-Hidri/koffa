
import { supabase } from '@/integrations/supabase/client';
import { generateInviteCode } from './inviteUtils';
import { toast } from 'sonner';

export const createFamilyInvitation = async (familyId: string, userId: string) => {
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
  return data?.[0]?.code || code;
};

export const getFamilyForUser = async (userId: string) => {
  try {
    // First check if user has a family in their profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('family_id')
      .eq('id', userId)
      .maybeSingle();
      
    if (profileError) throw profileError;
    
    // If user has a family_id in their profile
    if (profileData?.family_id) {
      const { data: familyData, error: familyError } = await supabase
        .from('families')
        .select('*')
        .eq('id', profileData.family_id)
        .single();
        
      if (familyError) throw familyError;
      return familyData;
    }
    
    // User has no family
    return null;
  } catch (error) {
    console.error('Error getting family:', error);
    return null;
  }
};

export const getFamilyInvitations = async (familyId: string) => {
  const { data, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('family_id', familyId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const verifyInviteCode = async (code: string) => {
  try {
    // Check if code exists and is not used
    const { data, error } = await supabase
      .rpc('is_valid_invite_code', { code_param: code });
      
    if (error) throw error;
    
    // Return validity and family info
    return { valid: !!data, familyId: null };
  } catch (error) {
    console.error('Error verifying invite code:', error);
    return { valid: false, familyId: null };
  }
};

export const useInviteCode = async (code: string, userId: string) => {
  try {
    // Get the invitation details
    const { data: invitation, error: invitationError } = await supabase
      .from('invitations')
      .select('family_id, is_used, expires_at')
      .eq('code', code)
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
      .eq('code', code);
      
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

export const createNewFamily = async (familyName: string, userId: string) => {
  try {
    // Create the family
    const { data, error } = await supabase
      .from('families')
      .insert({
        name: familyName,
        created_by: userId
      })
      .select();
    
    if (error) throw error;
    
    const familyId = data?.[0]?.id;
    
    if (!familyId) throw new Error('Failed to create family');
    
    // Add the user as a family member with owner role
    const { error: memberError } = await supabase
      .from('family_members')
      .insert({
        family_id: familyId,
        user_id: userId,
        role: 'owner'
      });
    
    if (memberError) throw memberError;
    
    // Update user's profile with the family_id
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ family_id: familyId })
      .eq('id', userId);
    
    if (profileError) throw profileError;
    
    // Create initial invitation code
    await createFamilyInvitation(familyId, userId);
    
    return data[0];
  } catch (error) {
    console.error('Error creating family:', error);
    throw error;
  }
};
