
import { supabase } from '@/integrations/supabase/client';
import { createFamilyInvitation } from './invitationUtils';

/**
 * Creates a new family and assigns the creator as the owner
 */
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
