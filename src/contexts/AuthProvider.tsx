
import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// Define user roles
export type UserRole = 'admin' | 'manager' | 'staff' | 'user';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userRole: UserRole | null;
  tenantId: string | null;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  isRefreshingSession: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  userRole: null,
  tenantId: null,
  signOut: async () => {},
  refreshSession: async () => {},
  isRefreshingSession: false,
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [isRefreshingSession, setIsRefreshingSession] = useState<boolean>(false);
  
  // Use a ref to track ongoing refresh operations to prevent multiple concurrent refreshes
  const refreshInProgress = useRef<boolean>(false);

  const fetchUserRole = async (userId: string) => {
    try {
      console.log('Fetching user role for userId:', userId);
      const { data, error } = await supabase
        .from('breeder_profiles')
        .select('role, tenant_id')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user role:', error);
        setUserRole('user'); // Default role if profile not found
        setTenantId(null);
        return;
      }

      if (data) {
        if (data.role) {
          console.log('User role found:', data.role);
          setUserRole(data.role.toLowerCase() as UserRole);
        } else {
          console.log('No role found, defaulting to user');
          setUserRole('user');
        }

        if (data.tenant_id) {
          console.log('Tenant ID found:', data.tenant_id);
          setTenantId(data.tenant_id);
        } else {
          setTenantId(null);
        }
      } else {
        console.log('No role or tenant data found, defaulting to user role and null tenantId');
        setUserRole('user');
        setTenantId(null);
      }
    } catch (error) {
      console.error('Error in fetchUserRole:', error);
      setUserRole('user');
      setTenantId(null);
    }
  };

  const refreshSession = useCallback(async () => {
    // Prevent multiple concurrent refresh operations
    if (refreshInProgress.current) {
      console.log('Session refresh already in progress, skipping');
      return;
    }
    
    try {
      console.log('Refreshing session...');
      refreshInProgress.current = true;
      setIsRefreshingSession(true);
      setLoading(true);
      
      // Check for current session
      console.log('AuthProvider: Loading session...');
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        setSession(null);
        setUser(null);
        setUserRole(null);
        setTenantId(null);
        return;
      }
      
      if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
        
        // Fetch user role once we have a user
        if (data.session.user) {
          await fetchUserRole(data.session.user.id);
        }
        console.log('Session refresh complete, user authenticated');
      } else {
        // Clear user data if no session
        console.log('No session found, clearing user data');
        setSession(null);
        setUser(null);
        setUserRole(null);
        setTenantId(null);
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
      setSession(null);
      setUser(null);
      setUserRole(null);
      setTenantId(null);
    } finally {
      setLoading(false);
      setIsRefreshingSession(false);
      refreshInProgress.current = false;
    }
  }, []);

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      }
      setUser(null);
      setSession(null);
      setUserRole(null);
      setTenantId(null);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('AuthProvider initializing...');
    let mounted = true;
    
    // This function will handle auth state changes from the Supabase client
    const handleAuthChange = (newSession: Session | null) => {
      if (!mounted) return;
      
      console.log('Auth state update: session=', newSession?.user?.id || 'null');
      
      if (newSession) {
        setSession(newSession);
        setUser(newSession.user);
        // Don't fetch the user role here - that might cause a race condition
        // Just update the session and user states
      } else {
        setSession(null);
        setUser(null);
        setUserRole(null);
        setTenantId(null);
      }
    };
    
    // Set up auth state change listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event, newSession?.user?.id || 'null');
        
        if (event === 'SIGNED_OUT') {
          console.log('User signed out, clearing state');
          handleAuthChange(null);
          setLoading(false);
          return;
        }
        
        // Update session and user state immediately
        handleAuthChange(newSession);
        
        // Safely fetch additional user data if we have a session
        if (newSession?.user && mounted) {
          try {
            // Use setTimeout to prevent race conditions with other Supabase operations
            setTimeout(async () => {
              if (mounted) {
                await fetchUserRole(newSession.user.id);
                setLoading(false);
              }
            }, 0);
          } catch (err) {
            console.error('Error fetching user role after auth state change:', err);
            if (mounted) setLoading(false);
          }
        } else {
          if (mounted) setLoading(false);
        }
      }
    );

    // Then check for the current session
    const getInitialSession = async () => {
      try {
        console.log('Getting initial session...');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
          if (mounted) setLoading(false);
          return;
        }
        
        if (data?.session && mounted) {
          console.log('Initial session found for user:', data.session.user.id);
          setSession(data.session);
          setUser(data.session.user);
          
          // Fetch user role for the current user
          try {
            await fetchUserRole(data.session.user.id);
          } catch (error) {
            console.error('Error fetching initial user role:', error);
          }
        }
        
        if (mounted) setLoading(false);
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        if (mounted) setLoading(false);
      }
    };

    // Get the initial session
    getInitialSession();
    
    // Cleanup function
    return () => {
      console.log('AuthProvider cleanup');
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      userRole, 
      tenantId,
      signOut, 
      refreshSession,
      isRefreshingSession
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
