/**
 * Supabase Auth Hook
 * Provides authentication state and profile management using Supabase
 */

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User, Session, AuthError } from '@supabase/supabase-js';

interface Profile {
  id: string;
  email: string | null;
  role: 'client' | 'worker' | 'employee' | 'admin';
  created_at: string;
  updated_at: string;
}

interface SupabaseAuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const SupabaseAuthContext = createContext<SupabaseAuthContextType | undefined>(undefined);

interface SupabaseAuthProviderProps {
  children: ReactNode;
}

// PostgreSQL error code for "no rows returned"
const PGRST_NO_ROWS_ERROR = 'PGRST116';

export const SupabaseAuthProvider = ({ children }: SupabaseAuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        // If profile doesn't exist, create it defensively
        if (error.code === PGRST_NO_ROWS_ERROR) {
          console.log('Profile not found, creating new profile...');
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([{ id: userId, role: 'client' }])
            .select()
            .single();

          if (createError) {
            console.error('Error creating profile:', createError);
            return null;
          }
          return newProfile;
        }
        console.error('Error fetching profile:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Unexpected error fetching profile:', err);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setProfile(null);
  };

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);
        setUser(initialSession?.user ?? null);

        if (initialSession?.user) {
          const profileData = await fetchProfile(initialSession.user.id);
          setProfile(profileData);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          const profileData = await fetchProfile(currentSession.user.id);
          setProfile(profileData);
        } else {
          setProfile(null);
        }

        // Always set loading to false after state change
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <SupabaseAuthContext.Provider
      value={{
        session,
        user,
        profile,
        loading,
        refreshProfile,
        signOut
      }}
    >
      {children}
    </SupabaseAuthContext.Provider>
  );
};

export const useSupabaseAuth = () => {
  const context = useContext(SupabaseAuthContext);
  if (!context) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  return context;
};
