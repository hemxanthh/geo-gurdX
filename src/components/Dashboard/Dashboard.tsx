import React from 'react';
import { Car, Clock, TrendingUp, Navigation, MapPin } from 'lucide-react';
import { useSocket } from '../../contexts/SocketContext';
import clsx from 'clsx';

const Dashboard: React.FC = () => {
  const { connected } = useSocket();

  const stats = {
    totalTrips: 24,
    totalDistance: 1247.5,
    averageSpeed: 42.3,
    lastUpdate: new Date().toLocaleTimeString()
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gradient mb-2">Vehicle Dashboard</h1>
        <p className="text-dark-text-muted">Real-time tracking and analytics</p>
      </div>

      {/* Live Status Banner */}
      <div className={clsx(
        "modern-card p-6 border-2 transition-all duration-300",
        connected ? "border-accent-emerald/30 glow-effect" : "border-accent-red/30"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={clsx(
              "relative p-3 rounded-xl",
              connected ? "bg-accent-emerald/20" : "bg-accent-red/20"
            )}>
              <Navigation className={clsx(
                "w-8 h-8",
                connected ? "text-accent-emerald" : "text-accent-red"
              )} />
              {connected && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent-emerald rounded-full pulse-live"></div>
              )}
            </div>
            <div>
              <h2 className={clsx(
                "text-xl font-bold",
                connected ? "text-accent-emerald" : "text-accent-red"
              )}>
                {connected ? "LIVE TRACKING ACTIVE" : "TRACKING OFFLINE"}
              </h2>
              <p className="text-dark-text-muted">
                {connected ? "Vehicle location updating in real-time" : "Reconnecting to GPS system..."}
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
    </div>
  );
};

export default Dashboard;
