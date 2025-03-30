
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

// Define UserRole type and export it
export type UserRole = 'user' | 'staff' | 'manager' | 'admin' | 'owner';

export interface AuthContextType {
  user: User | null;
  userRole: UserRole | null;
  tenantId: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userRole: null,
  tenantId: null,
  signIn: async () => {},
  signOut: async () => {},
  loading: true,
  error: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check active sessions and sets the user
    const getSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        const user = data.session?.user || null;
        setUser(user);
        
        if (user) {
          await fetchUserProfile(user.id);
        }
      } catch (err: any) {
        console.error('Error checking auth session:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    getSession();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user || null;
        setUser(currentUser);
        
        if (currentUser) {
          await fetchUserProfile(currentUser.id);
        } else {
          setUserRole(null);
          setTenantId(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('breeder_profiles')
        .select('role, tenant_id')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      
      // Validate and set the user role
      const role = data.role as string;
      setUserRole(
        role === 'user' || role === 'staff' || role === 'manager' || 
        role === 'admin' || role === 'owner' ? (role as UserRole) : 'user'
      );
      setTenantId(data.tenant_id);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setUserRole('user'); // Default to user role if there's an error
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // User will be set by the auth state change listener
    } catch (err: any) {
      console.error('Error signing in:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      // User will be set to null by the auth state change listener
    } catch (err: any) {
      console.error('Error signing out:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userRole,
        tenantId,
        signIn,
        signOut,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
