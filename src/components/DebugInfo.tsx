import { useEffect } from 'react';

const DebugInfo = () => {
  useEffect(() => {
    console.log('=== DEBUG INFO ===');
    console.log('Environment:', {
      mode: import.meta.env.MODE,
      dev: import.meta.env.DEV,
      prod: import.meta.env.PROD,
      hasSupabaseUrl: !!import.meta.env.VITE_SUPABASE_URL,
      hasSupabaseKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL?.substring(0, 30) + '...',
    });
    
    console.log('Browser:', {
      userAgent: navigator.userAgent,
      localStorage: typeof localStorage !== 'undefined',
      sessionStorage: typeof sessionStorage !== 'undefined',
    });
    
    console.log('Page loaded at:', new Date().toISOString());
  }, []);

  return null;
};

export default DebugInfo;
