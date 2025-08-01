import React, { useState, useEffect } from 'react';
import { 
  Navigation, 
  Clock, 
  Fuel, 
  Gauge, 
  Shield, 
  AlertTriangle, 
  TrendingUp,
  MapPin,
  Car,
  Activity
} from 'lucide-react';
import { useSocket } from '../../contexts/SocketContext';
import { clsx } from 'clsx';

interface DashboardProps {
  onPageChange?: (page: string) => void;
  onTripCompleted?: () => void;
}

interface DashboardStats {
  totalTrips: number;
  totalDistance: number;
  avgSpeed: number;
  fuelEfficiency: number;
  activeAlerts: number;
  vehicleStatus: string;
}

export default function Dashboard({ onPageChange, onTripCompleted }: DashboardProps) {
  const { vehicleStatus } = useSocket();
  const [stats, setStats] = useState<DashboardStats>({
    totalTrips: 0,
    totalDistance: 0,
    avgSpeed: 0,
    fuelEfficiency: 0,
    activeAlerts: 0,
    vehicleStatus: 'Unknown'
  });

  const currentVehicle = Object.values(vehicleStatus)[0]; // Get first vehicle for demo

  useEffect(() => {
    // Simulate loading stats
    setStats({
      totalTrips: 24,
      totalDistance: 1247.5,
      avgSpeed: 45.2,
      fuelEfficiency: 12.8,
      activeAlerts: 0,
      vehicleStatus: currentVehicle?.ignitionOn ? 'Active' : 'Inactive'
    });
  }, [currentVehicle]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Vehicle monitoring and control center</p>
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

        {/* Fuel Efficiency */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Fuel className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Fuel Efficiency</h3>
                <p className="text-sm text-gray-500">Average</p>
              </div>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {stats.fuelEfficiency.toFixed(1)}
            <span className="text-lg text-gray-500 ml-1">km/l</span>
          </div>
          <div className="text-sm text-gray-500">
            Battery: {currentVehicle?.batteryLevel || 0}%
          </div>
        </div>
      </div>

      {/* Vehicle Status Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vehicle Status */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Car className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Vehicle Status</h3>
              <p className="text-sm text-gray-500">Current state</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <div>
                  <div className="font-medium text-green-800">All Systems Normal</div>
                  <div className="text-sm text-green-600">Vehicle is operational</div>
                </div>
              </div>
              <div className="text-xs text-green-600 font-medium">
                {new Date().toLocaleTimeString()}
              </div>
            </div>
            
            <div className="text-center py-4">
              <Activity className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <div className="text-sm text-gray-500">Vehicle is secure</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Quick Actions</h3>
              <p className="text-sm text-gray-500">Common tasks</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onPageChange?.('live-map')}
              className="p-3 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
            >
              <MapPin className="w-5 h-5 text-blue-600 mb-1" />
              <div className="text-sm font-medium text-blue-800">Live Map</div>
            </button>
            
            <button
              onClick={() => onPageChange?.('trips')}
              className="p-3 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors"
            >
              <Navigation className="w-5 h-5 text-green-600 mb-1" />
              <div className="text-sm font-medium text-green-800">Trip History</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 