import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Users, Plus, Copy, Check } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { 
  createFamilyInvitation, 
  getFamilyInvitations,
  getFamilyForUser 
} from '@/utils/familyUtils';

interface Family {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

const FamilyPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [family, setFamily] = useState<Family | null>(null);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadFamilyData();
    }
  }, [user]);

  const loadFamilyData = async () => {
    if (!user) return;
    
    try {
      const familyData = await getFamilyForUser(user.id);
      
      if (familyData) {
        // Add created_by if it doesn't exist
        const familyWithCreatedBy: Family = {
          id: familyData.id,
          name: familyData.name,
          created_at: familyData.created_at,
          updated_at: familyData.updated_at,
          created_by: user.id
        };
        setFamily(familyWithCreatedBy);
        
        const invitationsData = await getFamilyInvitations(familyData.id);
        setInvitations(invitationsData);
      }
    } catch (error) {
      console.error('Error loading family data:', error);
      toast.error('Failed to load family data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvitation = async () => {
    if (!family?.id || !user?.id) return;
    
    try {
      const invitation = await createFamilyInvitation(family.id, user.id);
      setInvitations([...invitations, invitation]);
      toast.success('Invitation created!');
    } catch (error) {
      console.error('Error creating invitation:', error);
      toast.error('Failed to create invitation');
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success('Code copied to clipboard!');
    
    setTimeout(() => {
      setCopiedCode(null);
    }, 3000);
  };

  if (loading) {
    return (
      <PageLayout title="Family">
        <div className="flex justify-center items-center h-full">
          Loading family data...
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Family">
      <div className="space-y-6">
        {family ? (
          <>
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-gray-500" />
                  <h2 className="text-lg font-semibold">Your Family: {family.name}</h2>
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Plus className="h-5 w-5 text-gray-500" />
                  <h3 className="text-md font-semibold">Family Invitations</h3>
                </div>
                <Button size="sm" onClick={handleCreateInvitation}>
                  Create Invitation
                </Button>
              </div>
              
              {invitations.length > 0 ? (
                <div className="space-y-2">
                  {invitations.map((invitation) => (
                    <Card key={invitation.id} className="p-4 flex items-center justify-between">
                      <span>Invitation Code: {invitation.code}</span>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleCopyCode(invitation.code)}
                          disabled={copiedCode === invitation.code}
                        >
                          {copiedCode === invitation.code ? (
                            <>
                              <Check className="h-4 w-4 mr-2" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4 mr-2" />
                              Copy Code
                            </>
                          )}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500">No invitations created yet.</div>
              )}
            </Card>
          </>
        ) : (
          <Card className="p-6 text-center">
            <p className="text-gray-500">You are not currently in a family.</p>
            <Button onClick={() => navigate('/family/create')}>Create or Join a Family</Button>
          </Card>
        )}
      </div>
    </PageLayout>
  );
};

export default FamilyPage;
