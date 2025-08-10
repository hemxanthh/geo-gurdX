import React from 'react';
import { Car, Clock, TrendingUp, Navigation, MapPin, AlertTriangle, Shield, Bell, ExternalLink } from 'lucide-react';
import { useSocket } from '../../contexts/SocketContext';
import clsx from 'clsx';

interface DashboardProps {
  onNavigateToMap?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigateToMap }) => {
  const { connected, alerts } = useSocket();

  const stats = {
    totalTrips: 24,
    totalDistance: 1247.5,
    averageSpeed: 42.3,
    lastUpdate: new Date().toLocaleTimeString()
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'unauthorized_movement':
      case 'geofence_breach':
        return AlertTriangle;
      case 'ignition_tamper':
      case 'low_battery':
        return Bell;
      case 'emergency':
        return AlertTriangle;
      default:
        return Shield;
    }
  };

  return (
    <div className="space-y-8 p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Vehicle Dashboard</h1>
        <p className="text-slate-500">Real-time tracking and analytics</p>
      </div>

      {/* Live Status Banner */}
      <div className={clsx(
        "bg-slate-100 p-6 border-2 rounded-xl shadow-md transition-all duration-300 cursor-pointer hover:scale-[1.01]",
        connected ? "border-accent-500" : "border-accent-red"
      )} onClick={onNavigateToMap}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={clsx(
              "relative p-3 rounded-xl",
              connected ? "bg-accent-500/20" : "bg-accent-red/20"
            )}>
              <Navigation className={clsx(
                "w-8 h-8",
                connected ? "text-accent-500" : "text-accent-red"
              )} />
              {connected && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent-500 rounded-full pulse-live"></div>
              )}
            </div>
            <div>
              <h2 className={clsx(
                "text-xl font-bold flex items-center gap-2",
                connected ? "text-accent-500" : "text-accent-red"
              )}>
                {connected ? "LIVE TRACKING ACTIVE" : "TRACKING OFFLINE"}
                {connected && <ExternalLink className="w-5 h-5 text-accent-500/60" />}
              </h2>
              <p className="text-slate-500">
                {connected ? "Click to view real-time location on map" : "Reconnecting to GPS system..."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Trips */}
        <div className="modern-card p-6 animated-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-dark-text">Total Trips</h3>
                <p className="text-sm text-dark-text-muted">All time journeys</p>
              </div>
            </div>
          </div>
          <div className="text-3xl font-bold text-gradient mb-2">
            {stats.totalTrips}
          </div>
          <div className="text-sm text-accent-emerald">+3 this week</div>
        </div>

        {/* Total Distance */}
        <div className="modern-card p-6 animated-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-accent-cyan to-blue-600 rounded-xl">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-dark-text">Total Distance</h3>
                <p className="text-sm text-dark-text-muted">Kilometers traveled</p>
              </div>
            </div>
          </div>
          <div className="text-3xl font-bold text-gradient mb-2">
            {stats.totalDistance.toLocaleString()} km
          </div>
          <div className="text-sm text-accent-cyan">+127 km this week</div>
        </div>

        {/* Average Speed */}
        <div className="modern-card p-6 animated-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-accent-emerald to-green-600 rounded-xl">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-dark-text">Average Speed</h3>
                <p className="text-sm text-dark-text-muted">Across all trips</p>
              </div>
            </div>
          </div>
          <div className="text-3xl font-bold text-gradient mb-2">
            {stats.averageSpeed} km/h
          </div>
          <div className="text-sm text-accent-emerald">Optimal range</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="modern-card p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-primary-500 to-accent-cyan rounded-lg">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-dark-text">Recent Activity</h3>
            <p className="text-sm text-dark-text-muted">Latest system events</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-accent-emerald/10 to-transparent rounded-xl border border-accent-emerald/20">
            <div className="w-3 h-3 bg-accent-emerald rounded-full pulse-live"></div>
            <div className="flex-1">
              <div className="font-medium text-dark-text">GPS Signal Acquired</div>
              <div className="text-sm text-dark-text-muted">NavIC satellite connection established</div>
            </div>
            <div className="text-sm text-dark-text-muted">{stats.lastUpdate}</div>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-primary-500/10 to-transparent rounded-xl border border-primary-500/20">
            <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
            <div className="flex-1">
              <div className="font-medium text-dark-text">Trip Completed</div>
              <div className="text-sm text-dark-text-muted">Journey from Home to Office (15.2 km)</div>
            </div>
            <div className="text-sm text-dark-text-muted">2 hours ago</div>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-accent-cyan/10 to-transparent rounded-xl border border-accent-cyan/20">
            <div className="w-3 h-3 bg-accent-cyan rounded-full"></div>
            <div className="flex-1">
              <div className="font-medium text-dark-text">System Status Check</div>
              <div className="text-sm text-dark-text-muted">All systems operational</div>
            </div>
            <div className="text-sm text-dark-text-muted">5 hours ago</div>
          </div>
        </div>
      </div>

      {/* Security Alerts Section */}
      <div className="modern-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-dark-text text-lg">Security Alerts</h3>
              <p className="text-sm text-dark-text-muted">Vehicle security and safety notifications</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {alerts.filter(alert => !alert.isRead).length > 0 && (
              <div className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm font-medium">
                {alerts.filter(alert => !alert.isRead).length} Unread
              </div>
            )}
            <div className="bg-primary-500/20 text-primary-400 px-3 py-1 rounded-full text-sm font-medium">
              {alerts.length} Total
            </div>
          </div>
        </div>
        
        {alerts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-accent-emerald/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-accent-emerald" />
            </div>
            <h4 className="text-lg font-semibold text-dark-text mb-2">All Clear!</h4>
            <p className="text-dark-text-muted">No security alerts detected. Your vehicle is secure.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.slice(0, 5).map((alert) => {
              const IconComponent = getAlertIcon(alert.type);
              return (
                <div key={alert.id} className={clsx(
                  "flex items-center space-x-4 p-4 rounded-xl border transition-all duration-200 hover:scale-[1.01]",
                  getSeverityColor(alert.severity),
                  !alert.isRead && "ring-1 ring-current"
                )}>
                  <div className={clsx(
                    "p-2 rounded-lg",
                    alert.severity === 'critical' ? 'bg-red-500/30' :
                    alert.severity === 'high' ? 'bg-orange-500/30' :
                    alert.severity === 'medium' ? 'bg-yellow-500/30' :
                    'bg-blue-500/30'
                  )}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div className="font-medium text-dark-text capitalize">
                        {alert.type.replace('_', ' ')}
                      </div>
                      {!alert.isRead && (
                        <div className="w-2 h-2 bg-current rounded-full"></div>
                      )}
                    </div>
                    <div className="text-sm text-dark-text-muted">{alert.message}</div>
                    {alert.location && (
                      <div className="text-xs text-dark-text-muted mt-1 flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>Location: {alert.location.lat?.toFixed(4)}, {alert.location.lng?.toFixed(4)}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-right space-y-1">
                    <div className={clsx(
                      "text-xs font-semibold px-2 py-1 rounded-full",
                      alert.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                      alert.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                      alert.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-blue-500/20 text-blue-400'
                    )}>
                      {alert.severity.toUpperCase()}
                    </div>
                    <div className="text-sm text-dark-text-muted">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </div>
                    <div className="text-xs text-dark-text-muted">
                      {new Date(alert.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              );
            })}
            {alerts.length > 5 && (
              <div className="text-center pt-4">
                <div className="text-sm text-dark-text-muted">
                  Showing 5 of {alerts.length} alerts
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
