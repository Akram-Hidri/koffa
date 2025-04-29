
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const ProtectedRoute = () => {
  const { session, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-koffa-beige-light">
        <div className="animate-pulse p-8 rounded-full bg-koffa-green/10">
          <div className="h-12 w-12 rounded-full border-4 border-koffa-green border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }
  
  if (!session) {
    return <Navigate to="/auth" replace />;
  }
  
  return <Outlet />;
};

export default ProtectedRoute;
