
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// Define user roles
export type UserRole = 'admin' | 'manager' | 'staff' | 'user';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userRole: UserRole | null;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  userRole: null,
  signOut: async () => {},
  refreshSession: async () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  const fetchUserRole = async (userId: string) => {
    try {
      console.log('Fetching user role for userId:', userId);
      const { data, error } = await supabase
        .from('breeder_profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        setUserRole('user'); // Default role if profile not found
        return;
      }

      if (data && data.role) {
        console.log('User role found:', data.role);
        setUserRole(data.role.toLowerCase() as UserRole);
      } else {
        console.log('No role found, defaulting to user');
        setUserRole('user');
      }
    } catch (error) {
      console.error('Error in fetchUserRole:', error);
      setUserRole('user');
    }
  };

  const refreshSession = async () => {
    try {
      console.log('Refreshing session...');
      setLoading(true);
      
      // Check for current session
      console.log('AuthProvider: Loading session...');
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        throw error;
      }
      
      if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
        
        // Fetch user role once we have a user
        if (data.session.user) {
          await fetchUserRole(data.session.user.id);
        }
      } else {
        // Clear user data if no session
        setSession(null);
        setUser(null);
        setUserRole(null);
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
    } finally {
      // Set a timeout to force-set loading to false after 5 seconds
      // This prevents UI from being stuck in loading state if something goes wrong
      const timeout = setTimeout(() => {
        console.log('Loading timeout reached, forcing loading state to false');
        setLoading(false);
      }, 5000);
      
      // But ideally we set it to false right away
      setLoading(false);
      
      // Clean up the timeout to prevent memory leaks
      clearTimeout(timeout);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setUserRole(null);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial session check
    refreshSession();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user.id);
        setSession(session);
        setUser(session?.user || null);

        // Fetch user role when auth state changes with a valid user
        if (session?.user) {
          await fetchUserRole(session.user.id);
        } else {
          setUserRole(null);
        }

        // Update loading state based on the event
        if (event === 'SIGNED_OUT') {
          setLoading(false);
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setLoading(false);
        }
      }
    );

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading, userRole, signOut, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
