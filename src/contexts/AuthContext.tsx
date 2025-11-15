import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAutoLogin } from "../services/auth/hook";
import { useAuthStore } from "../store/authStore";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { isSignedIn, isLoading } = useAuthStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Use auto-login hook to handle authentication on app start
  useAutoLogin();

  useEffect(() => {
    setIsAuthenticated(isSignedIn);
  }, [isSignedIn]);

  const login = () => {
    console.log("AuthContext: User logged in");
    setIsAuthenticated(true);
  };

  const logout = () => {
    console.log("AuthContext: User logged out");
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
