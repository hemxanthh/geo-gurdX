import React, { useState } from 'react';
import { useSocket } from '../../contexts/SocketContext';
import { AlertTriangle, Clock, MapPin, Check, Eye, X, Undo2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import clsx from 'clsx';

const AlertsPage: React.FC = () => {
  const { alerts } = useSocket();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const markAsUnread = async (alertId: string) => {
    setLoading(true);
    setError(null);
    try {
      await supabase
        .from('alerts')
        .update({ is_read: false })
        .eq('id', alertId);
    } catch (err: any) {
      setError('Failed to mark as unread');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 bg-slate-50 min-h-screen">
      <div className="flex items-center space-x-3 mb-6">
        <AlertTriangle className="w-7 h-7 text-accent-red" />
        <h2 className="text-2xl font-bold text-slate-800">Security Alerts</h2>
      </div>
      {error && <div className="text-accent-red mb-4">{error}</div>}
      {alerts.length === 0 ? (
        <div className="p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-50" />
          <p className="text-slate-500">No alerts to display</p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map(alert => (
            <div key={alert.id} className={clsx(
              'p-4 rounded-xl border transition-all duration-200 shadow-sm',
              alert.isRead ? 'bg-slate-100 border-slate-200' : 'bg-accent-red/10 border-accent-red',
              alert.acknowledged && 'opacity-60'
            )}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-accent-red" />
                  <span className="font-semibold text-lg text-slate-800">{alert.type}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-accent-red/20 text-accent-red ml-2">{alert.severity}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {alert.isRead ? (
                    <button
                      className="text-xs px-2 py-1 bg-accent-500/10 text-accent-500 rounded hover:bg-accent-500/20 transition"
                      disabled={loading}
                      onClick={() => markAsUnread(alert.id)}
                    >
                      <Undo2 className="inline w-4 h-4 mr-1" /> Mark as Unread
                    </button>
                  ) : (
                    <span className="text-xs text-accent-red font-bold">Unread</span>
                  )}
                </div>
              </div>
              <div className="mb-2 text-slate-700">{alert.message}</div>
              <div className="flex items-center text-xs text-slate-500 space-x-4">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{alert.timestamp.toLocaleString()}</span>
                </div>
                {alert.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>
                      {alert.location.lat !== undefined && alert.location.lng !== undefined
                        ? `${alert.location.lat?.toFixed(4)}, ${alert.location.lng?.toFixed(4)}`
                        : 'No location'}
                    </span>
                    {alert.location.speed !== undefined && (
                      <span className="ml-2">Speed: {alert.location.speed} km/h</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertsPage;
