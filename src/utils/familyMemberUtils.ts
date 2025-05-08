
import { supabase } from '@/integrations/supabase/client';

/**
 * Gets family information for a user
 */
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
