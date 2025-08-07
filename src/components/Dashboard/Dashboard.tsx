
import React, { useState, useEffect } from 'react';
import { 
  Navigation, 
  Clock, 
  Gauge, 
  MapPin
} from 'lucide-react';
import { useSocket } from '../../contexts/SocketContext';
import { clsx } from 'clsx';

interface DashboardStats {
  totalTrips: number;
  totalDistance: number;
  avgSpeed: number;
}

export default function Dashboard() {
  const { vehicleStatus } = useSocket();
  const [stats, setStats] = useState<DashboardStats>({
    totalTrips: 0,
    totalDistance: 0,
    avgSpeed: 0
  });

  const currentVehicle = Object.values(vehicleStatus)[0]; // Get first vehicle for demo

  useEffect(() => {
    // Simulate loading stats
    setStats({
      totalTrips: 24,
      totalDistance: 1247.5,
      avgSpeed: 45.2
    });
  }, [currentVehicle]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Vehicle monitoring and tracking center</p>
        </div>
        
        {currentVehicle && (
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <div className={clsx(
              'px-3 py-2 rounded-lg text-sm font-medium',
              currentVehicle.ignitionOn 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            )}>
              Engine: {currentVehicle.ignitionOn ? 'ON' : 'OFF'}
            </div>
            <div className={clsx(
              'px-3 py-2 rounded-lg text-sm font-medium',
              currentVehicle.isMoving 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-800'
            )}>
              Status: {currentVehicle.isMoving ? 'MOVING' : 'STOPPED'}
            </div>
          </div>
        )}
      </div>

      {/* Stats Grid - Only 3 cards now */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Trips */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Navigation className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Total Trips</h3>
                <p className="text-sm text-gray-500">All time</p>
              </div>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {stats.totalTrips}
          </div>
          <div className="text-sm text-gray-500">
            Last trip: 2 hours ago
          </div>
        </div>

        {/* Total Distance */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Total Distance</h3>
                <p className="text-sm text-gray-500">All time</p>
              </div>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {stats.totalDistance.toFixed(1)}
            <span className="text-lg text-gray-500 ml-1">km</span>
          </div>
          <div className="text-sm text-gray-500">
            Last updated: {currentVehicle?.lastUpdate ? new Date(currentVehicle.lastUpdate).toLocaleTimeString() : "N/A"}
          </div>
        </div>

        {/* Average Speed */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Gauge className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Avg Speed</h3>
                <p className="text-sm text-gray-500">This month</p>
              </div>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {stats.avgSpeed.toFixed(1)}
            <span className="text-lg text-gray-500 ml-1">km/h</span>
          </div>
          <div className="text-sm text-gray-500">
            Current: {(currentVehicle as any)?.speed || 0} km/h
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Quick Actions</h3>
            <p className="text-sm text-gray-500">Manage your tracking system</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 text-left bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors">
            <div className="font-medium text-blue-900">View Live Map</div>
            <div className="text-sm text-blue-600 mt-1">Real-time location tracking</div>
          </button>
          
          <button className="p-4 text-left bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors">
            <div className="font-medium text-green-900">Trip History</div>
            <div className="text-sm text-green-600 mt-1">View past journeys</div>
          </button>
          
          <button className="p-4 text-left bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors">
            <div className="font-medium text-purple-900">Settings</div>
            <div className="text-sm text-purple-600 mt-1">Configure tracking options</div>
          </button>
        </div>
      </div>
    </div>
  );
} 