
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Copy, Plus, Users } from 'lucide-react';
import { toast } from 'sonner';
import PageLayout from '@/components/PageLayout';
import { formatInviteCodeForDisplay } from '@/utils/inviteUtils';
import { getFamilyInvitations, createFamilyInvitation, getFamilyForUser } from '@/utils/familyUtils';
import { useAuth } from '@/contexts/AuthContext';

interface Family {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
}

interface Invitation {
  id: string;
  code: string;
  family_id: string;
  created_by: string;
  created_at: string;
  expires_at: string;
  is_used: boolean;
}

const FamilyPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [family, setFamily] = useState<Family | null>(null);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [newInviteCode, setNewInviteCode] = useState<string>('');

  useEffect(() => {
    if (user) {
      loadFamilyData();
    }
  }, [user]);

  const loadFamilyData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Get user's family
      const familyData = await getFamilyForUser(user.id);
      
      if (familyData) {
        setFamily(familyData);
        
        // Get invitations for this family
        const invitationsData = await getFamilyInvitations(familyData.id);
        setInvitations(invitationsData);
      }
    } catch (error) {
      console.error('Error loading family data:', error);
      toast.error('Failed to load family information');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvitation = async () => {
    if (!family || !user) return;
    
    try {
      const invitation = await createFamilyInvitation(family.id, user.id);
      setNewInviteCode(invitation.code);
      await loadFamilyData(); // Refresh the invitations list
      toast.success('New invitation code created!');
    } catch (error) {
      toast.error('Failed to create invitation');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  if (loading) {
    return (
      <PageLayout title="Family">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-koffa-green"></div>
        </div>
      </PageLayout>
    );
  }

  if (!family) {
    return (
      <PageLayout title="Family">
        <div className="text-center py-8">
          <Users className="mx-auto h-12 w-12 text-koffa-green-dark mb-4" />
          <h2 className="text-xl font-semibold text-koffa-green mb-2">No Family Found</h2>
          <p className="text-koffa-green-dark mb-4">You're not currently part of a family.</p>
          <Button onClick={() => navigate('/create-family')} className="bg-koffa-green hover:bg-koffa-green-dark">
            Create a Family
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Family">
      <div className="space-y-6">
        {/* Family Info */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-koffa-green">{family.name}</h2>
            <Badge variant="secondary">Family</Badge>
          </div>
          <p className="text-koffa-green-dark">Family ID: {family.id}</p>
        </Card>

        {/* New Invite Code Display */}
        {newInviteCode && (
          <Card className="p-6 bg-koffa-accent-blue/10 border-koffa-accent-blue">
            <h3 className="text-lg font-semibold text-koffa-green mb-2">New Invitation Code</h3>
            <div className="flex items-center gap-2">
              <Input
                value={formatInviteCodeForDisplay(newInviteCode)}
                readOnly
                className="font-mono text-lg"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(formatInviteCodeForDisplay(newInviteCode))}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-koffa-green-dark mt-2">
              Share this code with family members to invite them.
            </p>
          </Card>
        )}

        {/* Create New Invitation */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-koffa-green mb-4">Invite Family Members</h3>
          <p className="text-koffa-green-dark mb-4">
            Create a new invitation code to invite family members to join.
          </p>
          <Button onClick={handleCreateInvitation} className="bg-koffa-green hover:bg-koffa-green-dark">
            <Plus className="h-4 w-4 mr-2" />
            Create Invitation
          </Button>
        </Card>

        {/* Active Invitations */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-koffa-green mb-4">Active Invitations</h3>
          {invitations.length === 0 ? (
            <p className="text-koffa-green-dark">No active invitations.</p>
          ) : (
            <div className="space-y-3">
              {invitations.map((invitation) => (
                <div key={invitation.id} className="flex items-center justify-between p-3 bg-koffa-beige-light rounded-lg">
                  <div>
                    <code className="text-sm font-mono bg-white px-2 py-1 rounded">
                      {formatInviteCodeForDisplay(invitation.code)}
                    </code>
                    <p className="text-xs text-koffa-green-dark mt-1">
                      Created: {new Date(invitation.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(formatInviteCodeForDisplay(invitation.code))}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </PageLayout>
  );
};

export default FamilyPage;
