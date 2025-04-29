
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Bell, Settings, Copy } from 'lucide-react';
import Logo from '@/components/Logo';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { formatInviteCodeForDisplay } from '@/utils/inviteUtils';
import PageNavigation from '@/components/PageNavigation';

const FamilyInvitationsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchInvitations();
    }
  }, [user]);

  const fetchInvitations = async () => {
    try {
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('created_by', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setInvitations(data || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load invitations');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code)
      .then(() => {
        toast.success('Invitation code copied to clipboard');
      })
      .catch(() => {
        toast.error('Failed to copy code');
      });
  };
  
  return (
    <div className="min-h-screen bg-koffa-beige-light pb-24">
      {/* Header */}
      <div className="bg-koffa-beige-light p-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            className="p-2 h-auto w-auto"
            onClick={() => navigate('/family')}
          >
            <ArrowLeft size={20} className="text-koffa-green" />
          </Button>
          <Logo size="sm" />
        </div>
        
        <h1 className="text-xl font-semibold text-koffa-green">Family Invitations</h1>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            className="rounded-full p-2 h-auto w-auto"
          >
            <Bell size={20} className="text-koffa-green" />
          </Button>
          <Button 
            variant="ghost" 
            className="rounded-full p-2 h-auto w-auto"
            onClick={() => navigate('/settings')}
          >
            <Settings size={20} className="text-koffa-green" />
          </Button>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-6">
          <p className="text-koffa-green-dark mb-2">
            You currently have {invitations.length} active invitation{invitations.length !== 1 ? 's' : ''}.
          </p>
          <Button 
            className="bg-koffa-green text-white hover:bg-koffa-green-dark"
            onClick={() => navigate('/family')}
          >
            Go back to Family Page
          </Button>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin h-8 w-8 border-4 border-koffa-green border-t-transparent rounded-full"></div>
          </div>
        ) : invitations.length > 0 ? (
          <div className="space-y-4">
            {invitations.map(invitation => (
              <Card key={invitation.id} className="p-4 border-koffa-beige/30">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-medium text-koffa-green">Invitation Code:</p>
                    <p className="text-xl font-mono font-semibold">{formatInviteCodeForDisplay(invitation.code)}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(invitation.code)}
                    className="flex items-center gap-1"
                  >
                    <Copy size={14} />
                    Copy
                  </Button>
                </div>
                
                <div className="mt-3 text-sm text-koffa-green-dark">
                  <p>Created: {new Date(invitation.created_at).toLocaleDateString()}</p>
                  <p>Expires: {new Date(invitation.expires_at).toLocaleDateString()}</p>
                  <p>Status: {invitation.is_used ? 'Used' : 'Active'}</p>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-6 border-koffa-beige/30 text-center">
            <p className="text-lg font-medium text-koffa-green mb-2">No Active Invitations</p>
            <p className="text-sm text-gray-500 mb-6">You don't have any pending invitations at the moment.</p>
            
            <Button
              className="bg-koffa-green text-white hover:bg-koffa-green-dark"
              onClick={() => navigate('/family')}
            >
              Return to Family
            </Button>
          </Card>
        )}
      </div>
      
      {/* Use PageNavigation Component */}
      <PageNavigation />
    </div>
  );
};

export default FamilyInvitationsPage;
