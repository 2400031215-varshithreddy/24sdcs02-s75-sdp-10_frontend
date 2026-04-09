import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from "react";
import { apiGet, apiPost } from "@/lib/api";

interface AuthContextType {
  role: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (role: string) => void;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Check if the user has a valid session by calling GET /api/auth/me.
   * This endpoint validates the HttpOnly JWT cookie and returns the user's role.
   */
  const refreshAuth = useCallback(async () => {
    try {
      const data = await apiGet<{ role: string; message: string }>("/api/auth/me");
      if (data && data.role) {
        setRole(data.role);
        setIsAuthenticated(true);
      } else {
        setRole(null);
        setIsAuthenticated(false);
      }
    } catch {
      setRole(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // On mount, verify existing session
  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  const login = (role: string) => {
    setRole(role);
    setIsAuthenticated(true);
    setIsLoading(false);
  };

  const logout = async () => {
    try {
      await apiPost("/api/auth/logout", {});
    } catch {
      // ignore logout errors
    }
    setRole(null);
    setIsAuthenticated(false);
  };

  const value = useMemo(() => ({
    role,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshAuth,
  }), [role, isAuthenticated, isLoading, refreshAuth]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
