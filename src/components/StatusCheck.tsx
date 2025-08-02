import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface StatusCheckProps {
  isOpen: boolean;
  onClose: () => void;
}

const StatusCheck: React.FC<StatusCheckProps> = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState<{
    env: 'checking' | 'ok' | 'error';
    supabase: 'checking' | 'ok' | 'error';
    auth: 'checking' | 'ok' | 'error';
    details: any;
  }>({
    env: 'checking',
    supabase: 'checking', 
    auth: 'checking',
    details: {}
  });

  useEffect(() => {
    if (isOpen) {
      runStatusCheck();
    }
  }, [isOpen]);

  const runStatusCheck = async () => {
    // Reset status
    setStatus({
      env: 'checking',
      supabase: 'checking',
      auth: 'checking',
      details: {}
    });

    const details: any = {};

    // Check environment variables
    try {
      const hasSupabaseUrl = !!import.meta.env.VITE_SUPABASE_URL;
      const hasSupabaseKey = !!import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      details.env = {
        mode: import.meta.env.MODE,
        hasSupabaseUrl,
        hasSupabaseKey,
        supabaseUrl: hasSupabaseUrl ? import.meta.env.VITE_SUPABASE_URL?.substring(0, 30) + '...' : 'Missing'
      };

      setStatus(prev => ({ 
        ...prev, 
        env: hasSupabaseUrl && hasSupabaseKey ? 'ok' : 'error',
        details 
      }));
    } catch (error: any) {
      details.env = { error: error?.message || 'Unknown error' };
      setStatus(prev => ({ ...prev, env: 'error', details }));
    }

    // Check Supabase connection
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        details.supabase = { error: error.message };
        setStatus(prev => ({ ...prev, supabase: 'error', details }));
      } else {
        details.supabase = { 
          connected: true, 
          hasSession: !!data.session,
          sessionUser: data.session?.user?.email || null
        };
        setStatus(prev => ({ ...prev, supabase: 'ok', details }));
      }
    } catch (error: any) {
      details.supabase = { error: error?.message || 'Unknown error' };
      setStatus(prev => ({ ...prev, supabase: 'error', details }));
    }

    // Check auth state
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        details.auth = { error: error.message };
        setStatus(prev => ({ ...prev, auth: 'error', details }));
      } else {
        details.auth = {
          hasUser: !!user,
          userEmail: user?.email || null,
          userMetadata: user?.user_metadata || {}
        };
        setStatus(prev => ({ ...prev, auth: 'ok', details }));
      }
    } catch (error: any) {
      details.auth = { error: error?.message || 'Unknown error' };
      setStatus(prev => ({ ...prev, auth: 'error', details }));
    }
  };

  const getStatusIcon = (checkStatus: string) => {
    switch (checkStatus) {
      case 'checking': return '⏳';
      case 'ok': return '✅';
      case 'error': return '❌';
      default: return '❓';
    }
  };

  const getStatusColor = (checkStatus: string) => {
    switch (checkStatus) {
      case 'checking': return 'text-yellow-600';
      case 'ok': return 'text-green-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl max-h-[80vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">System Status Check</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div className="border rounded p-3">
            <div className={`flex items-center gap-2 ${getStatusColor(status.env)}`}>
              <span>{getStatusIcon(status.env)}</span>
              <span className="font-medium">Environment Variables</span>
            </div>
            {status.details.env && (
              <pre className="text-xs mt-2 bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(status.details.env, null, 2)}
              </pre>
            )}
          </div>

          <div className="border rounded p-3">
            <div className={`flex items-center gap-2 ${getStatusColor(status.supabase)}`}>
              <span>{getStatusIcon(status.supabase)}</span>
              <span className="font-medium">Supabase Connection</span>
            </div>
            {status.details.supabase && (
              <pre className="text-xs mt-2 bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(status.details.supabase, null, 2)}
              </pre>
            )}
          </div>

          <div className="border rounded p-3">
            <div className={`flex items-center gap-2 ${getStatusColor(status.auth)}`}>
              <span>{getStatusIcon(status.auth)}</span>
              <span className="font-medium">Authentication</span>
            </div>
            {status.details.auth && (
              <pre className="text-xs mt-2 bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(status.details.auth, null, 2)}
              </pre>
            )}
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <button
            onClick={runStatusCheck}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Re-run Check
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusCheck;
