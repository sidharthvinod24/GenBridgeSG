import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminRole } from "@/hooks/useAdminRole";
import { useProfileComplete } from "@/hooks/useProfileComplete";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireCompleteProfile?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  requireAdmin = false,
  requireCompleteProfile = false 
}: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminRole();
  const { isComplete, loading: profileLoading } = useProfileComplete();
  const location = useLocation();

  // Show loading while checking auth
  const isLoading = loading || 
    (requireAdmin && adminLoading) || 
    (requireCompleteProfile && profileLoading);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in - redirect to auth
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Logged in but not admin, trying to access admin route - redirect to dashboard
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // Profile incomplete and trying to access routes that require complete profile
  // Don't redirect if already on dashboard (to allow them to complete profile there)
  if (requireCompleteProfile && !isComplete && location.pathname !== "/dashboard") {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
