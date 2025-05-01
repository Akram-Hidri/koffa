
import { supabase } from '@/integrations/supabase/client';
import { generateInviteCode } from './inviteUtils';

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
  // Check if code exists and is not used
  const { data, error } = await supabase
    .from('invitations')
    .select('family_id, is_used, expires_at')
    .eq('code', code)
    .maybeSingle();
    
  if (error) throw error;
  
  // If no data found or code is used or expired
  if (!data || data.is_used || new Date(data.expires_at) < new Date()) {
    return { valid: false, familyId: null };
  }
  
  // Code is valid
  return { valid: true, familyId: data.family_id };
};

export const useInviteCode = async (code: string, userId: string) => {
  // First verify the code
  const { valid, familyId } = await verifyInviteCode(code);
  
  if (!valid || !familyId) {
    throw new Error('Invalid or expired invitation code');
  }
  
  // Begin transaction
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
};
