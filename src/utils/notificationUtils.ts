
import { supabase } from '@/integrations/supabase/client';
import { createFamilyInvitation } from './invitationUtils';

/**
 * Sends an email invitation to join a family
 */
export const sendEmailInvitation = async (email: string, familyId: string, inviterId: string) => {
  try {
    const code = await createFamilyInvitation(familyId, inviterId);
    
    // This would integrate with an email service
    console.log(`Would send invitation email to ${email} with code ${code}`);
    
    return { success: true, code };
  } catch (error) {
    console.error('Error sending email invitation:', error);
    throw error;
  }
};

/**
 * Sends an SMS invitation to join a family
 */
export const sendSMSInvitation = async (phoneNumber: string, familyId: string, inviterId: string) => {
  try {
    const code = await createFamilyInvitation(familyId, inviterId);
    
    // This would integrate with an SMS service
    console.log(`Would send invitation SMS to ${phoneNumber} with code ${code}`);
    
    return { success: true, code };
  } catch (error) {
    console.error('Error sending SMS invitation:', error);
    throw error;
  }
};
