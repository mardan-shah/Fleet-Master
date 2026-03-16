"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";

interface AuthUser {
  id: string;
  email: string;
  name: string | undefined;
  avatar: string | undefined;
  role: string | undefined;
  organization: string | undefined;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string, role: string, organization?: string) => Promise<void>;
  updateProfile: (updates: Partial<AuthUser>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
} 

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status, update } = useSession();
  const [user, setUser] = useState<AuthUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setUser({
        id: (session.user as any).id,
        email: session.user.email!,
        name: session.user.name!,
        avatar: (session.user as any).avatar,
        role: (session.user as any).role,
        organization: (session.user as any).company,
      });
    } else {
      setUser(null);
    }
  }, [session, status]);

  const login = async (email: string, password: string) => {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      throw new Error(result.error);
    }

    router.push("/pages/dashboard");
  };

  const register = async (email: string, password: string, name: string, role: string, organization?: string) => {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        name,
        role,
        company: organization,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Registration failed");
    }

    // After successful registration, we can either auto-login or redirect to sign-in
    router.push("/pages/signin");
  };

  const logout = async () => {
    await signOut({ redirect: false });
    setUser(null);
    router.push("/pages/signin");
  };

  const updateProfile = async (updates: Partial<AuthUser>) => {
    // This would typically be an API call to update the user in the DB
    // and then updating the session
    const response = await fetch("/api/user/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Profile update failed");
    }

    await update(); // Update NextAuth session
  };

  const resetPassword = async (email: string) => {
    // Standard Postgres setup would need an email service for this.
    // For now, I'll just throw a "Not Implemented" error or similar.
    throw new Error("Reset password functionality requires an email service provider.");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: status === "loading",
        isAuthenticated: status === "authenticated",
        login,
        logout,
        register,
        updateProfile,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
