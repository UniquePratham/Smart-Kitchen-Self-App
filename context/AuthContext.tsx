import createContextHook from "@nkzw/create-context-hook";
import { useState, useEffect, useMemo, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery } from "@tanstack/react-query";
import api, { AuthResponse } from "@/utils/api";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  loginError: string | null;
  signupError: string | null;
}

export const [AuthProvider, useAuth] = createContextHook((): AuthContextValue => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [signupError, setSignupError] = useState<string | null>(null);

  const checkAuthQuery = useQuery({
    queryKey: ["auth-check"],
    queryFn: async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        try {
          const response = await api.get<User>("/api/users/me");
          return { user: response.data, token };
        } catch (error) {
          console.log("[Auth] Token invalid, clearing storage");
          await AsyncStorage.removeItem("authToken");
          return null;
        }
      }
      return null;
    },
    retry: false,
  });

  useEffect(() => {
    if (checkAuthQuery.data?.user) {
      setUser(checkAuthQuery.data.user);
      setIsAuthenticated(true);
    }
  }, [checkAuthQuery.data]);

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      setLoginError(null);
      const response = await api.post<AuthResponse>("/auth/login", { email, password });
      return response.data;
    },
    onSuccess: async (data) => {
      console.log("[Auth] Login successful");
      await AsyncStorage.setItem("authToken", data.token);
      if (data.user) {
        setUser(data.user);
      }
      setIsAuthenticated(true);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || "Login failed";
      console.error("[Auth] Login error:", message);
      setLoginError(message);
    },
  });

  const signupMutation = useMutation({
    mutationFn: async ({ email, password, name }: { email: string; password: string; name?: string }) => {
      setSignupError(null);
      const response = await api.post<AuthResponse>("/auth/register", { email, password, name });
      return response.data;
    },
    onSuccess: async (data) => {
      console.log("[Auth] Signup successful");
      if (data.token) {
        await AsyncStorage.setItem("authToken", data.token);
        if (data.user) {
          setUser(data.user);
        }
        setIsAuthenticated(true);
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || "Signup failed";
      console.error("[Auth] Signup error:", message);
      setSignupError(message);
    },
  });

  const { mutateAsync: loginAsync } = loginMutation;
  const { mutateAsync: signupAsync } = signupMutation;

  const login = useCallback(async (email: string, password: string) => {
    await loginAsync({ email, password });
  }, [loginAsync]);

  const signup = useCallback(async (email: string, password: string, name?: string) => {
    await signupAsync({ email, password, name });
  }, [signupAsync]);

  const logout = useCallback(async () => {
    console.log("[Auth] Logging out");
    await AsyncStorage.removeItem("authToken");
    setUser(null);
    setIsAuthenticated(false);
    setLoginError(null);
    setSignupError(null);
  }, []);

  return useMemo(() => ({
    user,
    isAuthenticated,
    isLoading: checkAuthQuery.isLoading || loginMutation.isPending || signupMutation.isPending,
    login,
    signup,
    logout,
    loginError,
    signupError,
  }), [user, isAuthenticated, checkAuthQuery.isLoading, loginMutation.isPending, signupMutation.isPending, login, signup, logout, loginError, signupError]);
});
