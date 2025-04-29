
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
      
      {/* Floating Navigation Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-lg px-6 py-3 w-[80%] max-w-sm border border-koffa-beige/20 transition-all duration-300 hover:shadow-xl">
        <div className="flex justify-around items-center">
          <Button 
            variant="ghost" 
            className="p-2 h-auto w-14 hover:bg-koffa-beige-light rounded-full transition-all duration-300"
            onClick={() => navigate('/home')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-koffa-green-dark">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </Button>
          
          {navItems.slice(1, 4).map((item, index) => (
            <Button 
              key={index}
              variant="ghost" 
              className={`p-2 h-auto w-14 hover:bg-koffa-beige-light rounded-full transition-all duration-300 ${item === 'family' ? 'bg-koffa-beige-light' : ''}`}
              onClick={() => navigate(`/${item}`)}
            >
              {item === 'pantry' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-koffa-green-dark">
                  <path d="M21 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3" />
                  <path d="M3 8v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8" />
                  <path d="M10 2v9" />
                </svg>
              ) : item === 'shopping' || item === 'lists' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-koffa-green-dark">
                  <path d="M8 5h8l2 13H6z" />
                  <path d="M5 8l14 1" />
                  <path d="M9 3v2" />
                  <path d="M15 3v2" />
                  <path d="M11 23a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
                  <path d="M17 23a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
                </svg>
              ) : item === 'spaces' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-koffa-green-dark">
                  <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                  <path d="M3 9V6a2 2 0 0 1 2-2h2" />
                </svg>
              ) : item === 'family' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-koffa-green">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-koffa-green-dark">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              )}
            </Button>
          ))}
          
          <Button 
            variant="ghost" 
            className="p-2 h-auto w-14 hover:bg-koffa-beige-light rounded-full transition-all duration-300"
            onClick={() => navigate('/profile')}
          >
            <div className="w-8 h-8 rounded-full bg-koffa-beige flex items-center justify-center text-sm font-medium text-koffa-green">
              JD
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FamilyInvitationsPage;
