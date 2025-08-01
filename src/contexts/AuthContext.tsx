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
    let mounted = true;
    
    // Safety timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      if (mounted && isLoading) {
        console.warn('Auth initialization timed out, setting loading to false');
        setIsLoading(false);
      }
    }, 10000); // 10 second timeout

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setIsLoading(false);
          }
          return;
        }

        console.log('Initial session:', session?.user?.email || 'No session');
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            await loadUserProfile(session.user.id);
          } else {
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.email);
      
      if (!mounted) return;

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

    return () => {
      mounted = false;
      clearTimeout(loadingTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      console.log('Loading profile for user:', userId);
      setIsLoading(true);
      
      // First attempt to load profile
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error loading profile:', error);
        
        // If profile doesn't exist, try to create it
        if (error.code === 'PGRST116') {
          console.log('Profile not found, attempting to create...');
          const user = await supabase.auth.getUser();
          if (user.data.user) {
            const username = user.data.user.user_metadata?.username || 
                           user.data.user.email?.split('@')[0] || 
                           'user';
            const profile = await ensureProfileExists(userId, username, user.data.user.email || '');
            if (profile) {
              console.log('Profile created successfully:', profile);
              setProfile(profile);
              setIsLoading(false);
              return;
            }
          }
        }
        
        // If we still can't load/create profile, continue anyway
        console.warn('Could not load or create profile, continuing without profile');
        setProfile(null);
        setIsLoading(false);
        return;
      }

      console.log('Profile loaded successfully:', data);
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
      setProfile(null);
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