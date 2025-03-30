
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type UserRole = 'user' | 'staff' | 'manager' | 'admin';

interface AuthUser {
  id: string;
  email: string;
  app_metadata: {
    provider?: string;
  };
  user_metadata: {
    avatar_url?: string;
    full_name?: string;
  };
}

interface UserProfile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: UserRole | null;
  tenant_id: string | null;
  profile_image_url: string | null;
  created_at: string;
}

interface AuthContextType {
  user: AuthUser | null;
  userProfile: UserProfile | null;
  userRole: UserRole | null;
  tenantId: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any; user: any }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  userRole: null,
  tenantId: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null, user: null }),
  signOut: async () => {},
  refreshSession: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch user profile data from the breeder_profiles table
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('breeder_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  // Refresh the session and user data
  const refreshSession = async () => {
    try {
      setLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setUser(null);
        setUserProfile(null);
        return;
      }

      // Set the user from auth session
      setUser(session.user as AuthUser);

      // Fetch and set user profile
      const profile = await fetchUserProfile(session.user.id);
      if (profile) {
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initialize auth state on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      await refreshSession();
    };

    initializeAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setUser(session.user as AuthUser);
          const profile = await fetchUserProfile(session.user.id);
          if (profile) {
            setUserProfile(profile);
          }
        } else {
          setUser(null);
          setUserProfile(null);
        }
        setLoading(false);
      }
    );

    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: 'Sign In Error',
          description: error.message,
          variant: 'destructive',
        });
        return { error };
      }

      if (data.user) {
        const profile = await fetchUserProfile(data.user.id);
        if (profile) {
          setUserProfile(profile);
        }
      }

      return { error: null };
    } catch (error: any) {
      toast({
        title: 'Sign In Error',
        description: error.message,
        variant: 'destructive',
      });
      return { error };
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        toast({
          title: 'Sign Up Error',
          description: error.message,
          variant: 'destructive',
        });
        return { error, user: null };
      }

      if (data.user) {
        toast({
          title: 'Sign Up Success',
          description: 'Please check your email for a confirmation link.',
        });
      }

      return { error: null, user: data.user };
    } catch (error: any) {
      toast({
        title: 'Sign Up Error',
        description: error.message,
        variant: 'destructive',
      });
      return { error, user: null };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      setUser(null);
      setUserProfile(null);
    } catch (error: any) {
      toast({
        title: 'Sign Out Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        userRole: userProfile?.role,
        tenantId: userProfile?.tenant_id,
        loading,
        signIn,
        signUp,
        signOut,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
