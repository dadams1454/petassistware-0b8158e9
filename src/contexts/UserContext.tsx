
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role?: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUser = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setUser(null);
        return;
      }
      
      const { data: profile, error: profileError } = await supabase
        .from('breeder_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        setError(profileError.message);
        return;
      }
      
      setUser({
        id: session.user.id,
        email: session.user.email || '',
        first_name: profile?.first_name,
        last_name: profile?.last_name,
        role: profile?.role
      });
    } catch (err) {
      console.error('Error loading user:', err);
      setError(err instanceof Error ? err.message : 'Failed to load user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      loadUser();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const refreshUser = async () => {
    await loadUser();
  };

  return (
    <UserContext.Provider value={{ user, loading, error, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
