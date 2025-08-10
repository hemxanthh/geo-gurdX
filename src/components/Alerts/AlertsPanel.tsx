import React, { useState } from 'react';
import { useSocket } from '../../contexts/SocketContext';
import { AlertTriangle, Clock, MapPin, X, Check, Eye } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import clsx from 'clsx';

interface AlertsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({ isOpen, onClose }) => {
  const { alerts } = useSocket();
  const [loading, setLoading] = useState(false);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-100 border-blue-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'unauthorized_movement':
      case 'geofence_breach':
        return <MapPin className="w-4 h-4" />;
      case 'ignition_tamper':
      case 'engine_lock':
      case 'engine_unlock':
        return <AlertTriangle className="w-4 h-4" />;
      case 'low_battery':
        return <AlertTriangle className="w-4 h-4" />;
      case 'emergency':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      'unauthorized_movement': 'Unauthorized Movement',
      'ignition_tamper': 'Ignition Tamper',
      'geofence_breach': 'Geofence Breach',
      'low_battery': 'Low Battery',
      'emergency': 'Emergency Alert',
      'engine_lock': 'Engine Locked',
      'engine_unlock': 'Engine Unlocked'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const markAsRead = async (alertId: string) => {
    setLoading(true);
    try {
      await supabase
        .from('alerts')
        .update({ is_read: true })
        .eq('id', alertId);
    } catch (error) {
      console.error('Error marking alert as read:', error);
    } finally {
      setLoading(false);
    }
  };

  const acknowledgeAlert = async (alertId: string) => {
    setLoading(true);
    try {
      await supabase
        .from('alerts')
        .update({ acknowledged: true, is_read: true })
        .eq('id', alertId);
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    setLoading(true);
    try {
      const unreadAlerts = alerts.filter(alert => !alert.isRead);
      if (unreadAlerts.length > 0) {
        await supabase
          .from('alerts')
          .update({ is_read: true })
          .in('id', unreadAlerts.map(alert => alert.id));
      }
    } catch (error) {
      console.error('Error marking all alerts as read:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const unreadCount = alerts.filter(alert => !alert.isRead).length;
  const criticalAlerts = alerts.filter(alert => alert.severity === 'critical' && !alert.acknowledged);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="absolute right-4 top-20 w-96 max-h-[80vh] modern-card overflow-hidden animate-slide-up" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-accent-orange" />
            <div>
              <h3 className="font-semibold text-dark-text">Security Alerts</h3>
              <p className="text-sm text-dark-text-muted">
                {unreadCount} unread {criticalAlerts.length > 0 && `• ${criticalAlerts.length} critical`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                disabled={loading}
                className="text-xs px-2 py-1 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 text-dark-text-muted hover:text-accent-red transition-colors"
              title="Close alerts panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Alerts List */}
        <div className="max-h-96 overflow-y-auto">
          {alerts.length === 0 ? (
            <div className="p-8 text-center">
              <AlertTriangle className="w-12 h-12 text-dark-text-muted mx-auto mb-3 opacity-50" />
              <p className="text-dark-text-muted">No alerts to display</p>
              <p className="text-sm text-dark-text-muted mt-1">Your vehicle security system is monitoring</p>
            </div>
          ) : (
            <div className="p-2 space-y-2">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={clsx(
                    "p-3 rounded-lg border transition-all duration-200",
                    getSeverityColor(alert.severity),
                    !alert.isRead && "ring-2 ring-primary-500/50",
                    alert.acknowledged && "opacity-60"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="mt-0.5">
                        {getAlertIcon(alert.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-sm">
                            {getTypeLabel(alert.type)}
                          </h4>
                          <span className={clsx(
                            "text-xs px-2 py-0.5 rounded-full font-medium",
                            getSeverityColor(alert.severity)
                          )}>
                            {alert.severity.toUpperCase()}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-700 mb-2">
                          {alert.message}
                        </p>
                        
                        <div className="flex items-center text-xs text-gray-500 space-x-4">
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
                        
                        {/* Action Buttons */}
                        <div className="flex items-center space-x-2 mt-3">
                          {!alert.isRead && (
                            <button
                              onClick={() => markAsRead(alert.id)}
                              disabled={loading}
                              className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center space-x-1"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Mark Read</span>
                            </button>
                          )}
                          
                          {!alert.acknowledged && (alert.severity === 'high' || alert.severity === 'critical') && (
                            <button
                              onClick={() => acknowledgeAlert(alert.id)}
                              disabled={loading}
                              className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center space-x-1"
                            >
                              <Check className="w-3 h-3" />
                              <span>Acknowledge</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Status indicators */}
                  <div className="flex items-center space-x-2 mt-2 pt-2 border-t border-gray-200">
                    {alert.isRead && (
                      <span className="text-xs text-green-600 flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>Read</span>
                      </span>
                    )}
                    {alert.acknowledged && (
                      <span className="text-xs text-blue-600 flex items-center space-x-1">
                        <Check className="w-3 h-3" />
                        <span>Acknowledged</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertsPanel;
