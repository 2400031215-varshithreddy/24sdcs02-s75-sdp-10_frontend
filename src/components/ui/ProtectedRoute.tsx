import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function ProtectedRoute({ children, reqRole }: { children?: React.ReactNode, reqRole?: string }) {
  const { role, isAuthenticated, isLoading } = useAuth();

  // Wait for session validation before making routing decisions
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-white/20 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (reqRole && role !== reqRole) {
    return <Navigate to="/dashboard" replace />;
  }

  // Support both children (for layout wraps) and Outlet (for nested routes)
  return children ? <>{children}</> : <Outlet />;
}
