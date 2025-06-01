
import { supabase } from '@/integrations/supabase/client';
import { generateInviteCode } from './inviteUtils';

export const createNewFamily = async (familyName: string, userId: string) => {
  try {
    // Create the family
    const { data: family, error: familyError } = await supabase
      .from('families')
      .insert({ name: familyName })
      .select()
      .single();

    if (familyError) throw familyError;

    // Update the user's profile with the family_id
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ family_id: family.id })
      .eq('id', userId);

    if (profileError) throw profileError;

    // Add the user as a family member with admin role
    const { error: memberError } = await supabase
      .from('family_members')
      .insert({
        family_id: family.id,
        user_id: userId,
        role: 'admin'
      });

    if (memberError) throw memberError;

    return family;
  } catch (error) {
    console.error('Error creating family:', error);
    throw error;
  }
};

export const getFamilyForUser = async (userId: string) => {
  try {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('family_id')
      .eq('id', userId)
      .single();

    if (profileError) throw profileError;

    if (!profile.family_id) return null;

    const { data: family, error: familyError } = await supabase
      .from('families')
      .select('*')
      .eq('id', profile.family_id)
      .single();

    if (familyError) throw familyError;

    return family;
  } catch (error) {
    console.error('Error getting family for user:', error);
    return null;
  }
};

export const useInviteCode = async (code: string, userId: string) => {
  try {
    // Get the invitation
    const { data: invitation, error: invitationError } = await supabase
      .from('invitations')
      .select('family_id, is_used, expires_at')
      .eq('code', code)
      .single();

    if (invitationError) throw invitationError;

    if (invitation.is_used || new Date(invitation.expires_at) < new Date()) {
      throw new Error('Invalid or expired invitation code');
    }

    // Update the invitation as used
    const { error: updateError } = await supabase
      .from('invitations')
      .update({ is_used: true })
      .eq('code', code);

    if (updateError) throw updateError;

    // Update user's profile with family_id
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ family_id: invitation.family_id })
      .eq('id', userId);

    if (profileError) throw profileError;

    // Add user as family member
    const { error: memberError } = await supabase
      .from('family_members')
      .insert({
        family_id: invitation.family_id,
        user_id: userId,
        role: 'member'
      });

    if (memberError) throw memberError;

    return { success: true, familyId: invitation.family_id };
  } catch (error) {
    console.error('Error using invite code:', error);
    throw error;
  }
};

export const verifyInviteCode = async (code: string) => {
  try {
    const { data: invitation, error } = await supabase
      .from('invitations')
      .select('family_id, is_used, expires_at')
      .eq('code', code)
      .single();

    if (error) {
      console.error('Error verifying invite code:', error);
      return { valid: false, familyId: null };
    }

    const isValid = !invitation.is_used && new Date(invitation.expires_at) > new Date();

    return {
      valid: isValid,
      familyId: isValid ? invitation.family_id : null
    };
  } catch (error) {
    console.error('Error verifying invite code:', error);
    return { valid: false, familyId: null };
  }
};

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
      .select()
      .single();

    if (error) throw error;
    return code;
  } catch (error) {
    console.error('Error creating family invitation:', error);
    throw error;
  }
};
