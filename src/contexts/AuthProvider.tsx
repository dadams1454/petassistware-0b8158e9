
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
  tenantId: string | null;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  userRole: null,
  tenantId: null,
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
  const [tenantId, setTenantId] = useState<string | null>(null);

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

  const refreshSession = async () => {
    try {
      console.log('Refreshing session...');
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
        setLoading(false);
        return;
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
    }
  };

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
    // Set initial loading state
    setLoading(true);
    
    // Set up auth listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event, newSession?.user?.id);
        
        // Update session state immediately
        setSession(newSession);
        setUser(newSession?.user || null);

        // Only fetch role if we have a user
        if (newSession?.user) {
          await fetchUserRole(newSession.user.id);
        } else {
          setUserRole(null);
          setTenantId(null);
        }
        
        // Always ensure loading state is updated
        setLoading(false);
      }
    );

    // Then check current session
    refreshSession();

    // Cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      userRole, 
      tenantId,
      signOut, 
      refreshSession 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
