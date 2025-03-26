
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

// Define a type for user role
export type UserRole = 'admin' | 'manager' | 'staff' | 'viewer';

// Extended AuthContextType with roles
type AuthContextType = {
  session: Session | null;
  user: User | null;
  userRole: UserRole | null;
  tenantId: string | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch user role and tenant from breeder_profiles
  const fetchUserRole = async (userId: string) => {
    try {
      console.log('Fetching user role for userId:', userId);
      const { data, error } = await supabase
        .from('breeder_profiles')
        .select('role, id')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        return;
      }

      // Set the role - default to 'viewer' if not found
      if (data) {
        console.log('User role data:', data);
        setUserRole((data.role as UserRole) || 'viewer');
        setTenantId(data.id);
      } else {
        console.log('No user role found, defaulting to viewer');
        setUserRole('viewer');
      }
    } catch (error) {
      console.error('Error in fetchUserRole:', error);
      setUserRole('viewer'); // Default fallback
    }
  };

  const refreshSession = useCallback(async () => {
    console.log('Refreshing session...');
    setLoading(true);
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log('Session refresh result:', session, error);
      
      if (error) throw error;
      
      setSession(session);
      setUser(session?.user ?? null);
      
      // Also refresh the user role if we have a session
      if (session?.user) {
        await fetchUserRole(session.user.id);
      } else {
        // Clear role and tenant if no session
        setUserRole(null);
        setTenantId(null);
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    async function loadSession() {
      console.log('AuthProvider: Loading session...');
      setLoading(true);
      try {
        // First, set up the auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, newSession) => {
            console.log('Auth state changed:', event, newSession?.user?.id);
            
            setSession(newSession);
            setUser(newSession?.user ?? null);
            
            // Reset role when user logs out
            if (event === 'SIGNED_OUT') {
              console.log('User signed out, resetting role and tenant');
              setUserRole(null);
              setTenantId(null);
            }
            
            // Fetch role when user signs in
            if (newSession?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
              await fetchUserRole(newSession.user.id);
            }
            
            setLoading(false);
          }
        );
        
        // Then, get the current session
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        console.log('Current session:', currentSession?.user?.id);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        // If we have a user, fetch their role
        if (currentSession?.user) {
          await fetchUserRole(currentSession.user.id);
        }
        
        // Set loading to false even if no session to prevent infinite loading
        setLoading(false);
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error loading session:', error);
        setLoading(false);
      }
    }

    // Set a timeout to force loading to false after 5 seconds
    // This prevents infinite loading if there's an issue with session fetching
    const timeout = setTimeout(() => {
      if (loading) {
        console.log('Loading timeout reached, forcing loading state to false');
        setLoading(false);
      }
    }, 5000);

    loadSession();

    return () => clearTimeout(timeout);
  }, []);

  const signOut = async () => {
    console.log('Signing out user...');
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error during sign out:', error);
        throw error;
      }
      
      console.log('Sign out successful, clearing state');
      // Explicitly clear state
      setUserRole(null);
      setTenantId(null);
      setUser(null);
      setSession(null);
      
      console.log('State cleared after sign out');
      return Promise.resolve();
    } catch (error) {
      console.error('Error signing out:', error);
      return Promise.reject(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        userRole,
        tenantId,
        loading,
        signOut,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
