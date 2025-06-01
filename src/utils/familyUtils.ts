
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const createFamilyInvitation = async (familyId: string, createdBy: string) => {
  try {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const { data, error } = await supabase
      .from('invitations')
      .insert({
        family_id: familyId,
        code,
        created_by: createdBy
      })
      .select()
      .single();

    if (error) throw error;
    
    return data;
  } catch (error: any) {
    console.error('Error creating invitation:', error);
    toast.error('Failed to create invitation');
    throw error;
  }
};

export const getFamilyInvitations = async (familyId: string) => {
  try {
    const { data, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('family_id', familyId)
      .eq('is_used', false)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data || [];
  } catch (error: any) {
    console.error('Error fetching invitations:', error);
    toast.error('Failed to load invitations');
    return [];
  }
};

export const useInvitation = async (code: string, userId: string) => {
  try {
    // First get the invitation
    const { data: invitation, error: inviteError } = await supabase
      .from('invitations')
      .select('*, families(*)')
      .eq('code', code)
      .eq('is_used', false)
      .single();

    if (inviteError || !invitation) {
      throw new Error('Invalid or expired invitation code');
    }

    // Check if invitation is expired
    if (new Date(invitation.expires_at) < new Date()) {
      throw new Error('Invitation has expired');
    }

    // Mark invitation as used
    const { error: updateError } = await supabase
      .from('invitations')
      .update({ is_used: true })
      .eq('id', invitation.id);

    if (updateError) throw updateError;

    // Add user to family
    const { error: memberError } = await supabase
      .from('family_members')
      .insert({
        user_id: userId,
        family_id: invitation.family_id,
        role: 'member'
      });

    if (memberError) throw memberError;

    // Update user profile with family_id
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ family_id: invitation.family_id })
      .eq('id', userId);

    if (profileError) throw profileError;

    return invitation.families;
  } catch (error: any) {
    console.error('Error using invitation:', error);
    toast.error(error.message || 'Failed to join family');
    throw error;
  }
};
