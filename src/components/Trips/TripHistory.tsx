import React from 'react';
import { Calendar, Clock, Navigation, RefreshCw } from 'lucide-react';
import { useTrips } from '../../hooks/useTrips';
import { clsx } from 'clsx';

const TripHistory: React.FC = () => {
  const { trips, loading, fetchTrips } = useTrips();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trip History</h1>
          <p className="text-gray-600 mt-1">A record of all completed journeys.</p>
        </div>
        <button
          onClick={fetchTrips}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Recent Trips ({trips.length})</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="p-12 text-center text-gray-500">Loading...</div>
          ) : trips.length === 0 ? (
            <div className="p-12 text-center">
              <Navigation className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium">No trips recorded yet</h3>
              <p className="text-gray-500 mt-2">Start your engine to begin tracking trips</p>
            </div>
          ) : (
            trips.map((trip) => {
              const duration = trip.duration || 0; // in seconds
              const durationMinutes = Math.round(duration / 60);
              const distance = trip.distance || 0;

              return (
                <div key={trip.id} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <h3 className="font-medium text-gray-900">Trip #{String(trip.id).slice(-8)}</h3>
                        <p className="text-sm text-gray-500">Vehicle: {trip.vehicleId}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{distance.toFixed(1)} km</div>
                      <div className="text-sm text-gray-500">{durationMinutes} min</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">Start</div>
                        <div className="text-xs text-gray-500">
                          {trip.startTime.toLocaleDateString()} {trip.startTime.toLocaleTimeString()}
                        </div>
                        <div className="text-xs text-gray-400">
                          {trip.startLocation?.latitude && trip.startLocation?.longitude 
                            ? `${trip.startLocation.latitude.toFixed(6)}, ${trip.startLocation.longitude.toFixed(6)}`
                            : 'Location not available'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">End</div>
                        <div className="text-xs text-gray-500">
                          {trip.endTime.toLocaleDateString()} {trip.endTime.toLocaleTimeString()}
                        </div>
                        <div className="text-xs text-gray-400">
                          {trip.endLocation?.latitude && trip.endLocation?.longitude 
                            ? `${trip.endLocation.latitude.toFixed(6)}, ${trip.endLocation.longitude.toFixed(6)}`
                            : 'Location not available'}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{trip.startTime.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{durationMinutes} minutes</span>
                      </div>
                    </div>
                    <div className={clsx(
                      'px-2 py-1 rounded-full text-xs font-medium',
                      trip.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    )}>
                      {trip.status}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default TripHistory;