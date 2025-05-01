
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
