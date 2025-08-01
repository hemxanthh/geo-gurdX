import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, ensureProfileExists } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import { Database } from '../lib/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, username: string) => Promise<{ success: boolean; error?: string; needsEmailConfirmation?: boolean }>;
  logout: () => Promise<void>;
  isLoading: boolean;
  updateProfile: (updates: Partial<Profile>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.email);
      
      if (event === 'SIGNED_OUT') {
        console.log('User signed out, clearing all state...');
        setSession(null);
        setUser(null);
        setProfile(null);
        setIsLoading(false);
        return;
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await loadUserProfile(session.user.id);
      } else {
        console.log('User logged out, clearing profile...');
        setProfile(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      console.log('Loading profile for user:', userId);
      
      // Try to load profile with retry logic for newly registered users
      let profile = null;
      let retries = 0;
      const maxRetries = 3;
      
      while (retries < maxRetries) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) {
          console.error(`Error loading profile (attempt ${retries + 1}):`, error);
          
          // If profile doesn't exist yet (for newly registered users), wait and retry
          if (error.code === 'PGRST116') {
            retries++;
            if (retries < maxRetries) {
              console.log(`Profile not found, retrying in ${retries * 1000}ms...`);
              await new Promise(resolve => setTimeout(resolve, retries * 1000));
              continue;
            } else {
              // Final attempt: try to create profile manually
              console.log('Attempting to create profile manually...');
              const user = await supabase.auth.getUser();
              if (user.data.user) {
                const username = user.data.user.user_metadata?.username || 
                               user.data.user.email?.split('@')[0] || 
                               'user';
                profile = await ensureProfileExists(userId, username, user.data.user.email || '');
                if (profile) {
                  console.log('Profile created manually:', profile);
                  break;
                }
              }
            }
          }
          return;
        }

        profile = data;
        console.log('Profile loaded successfully:', profile);
        break;
      }

      setProfile(profile);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Wait for profile to be loaded
      if (data.user) {
        await loadUserProfile(data.user.id);
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, username: string): Promise<{ success: boolean; error?: string; needsEmailConfirmation?: boolean }> => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Check if email confirmation is required
      const needsEmailConfirmation = !!(data.user && data.user.email_confirmed_at === null);

      // For immediate login after registration, ensure profile exists
      if (data.user) {
        // Try to ensure profile exists (in case trigger failed)
        await ensureProfileExists(data.user.id, username, email);
        await loadUserProfile(data.user.id);
      }

      return { 
        success: true, 
        needsEmailConfirmation 
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('Starting logout process...');
      setIsLoading(true);
      
      // Clear local storage session data
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.removeItem('supabase.auth.token');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        throw error;
      }
      
      console.log('Supabase signOut successful, clearing local state...');
      
      // Clear local state
      setUser(null);
      setProfile(null);
      setSession(null);
      
      console.log('Logout completed successfully');
      
      // Force a page refresh to ensure clean state
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error: any) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'No user logged in' };
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      setProfile(data);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    profile,
    session,
    login,
    register,
    logout,
    isLoading,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};