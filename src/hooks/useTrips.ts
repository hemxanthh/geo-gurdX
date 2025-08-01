import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Trip } from '../types';

export const useTrips = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchTrips();
    }
  }, [user]);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedTrips: Trip[] = (data || []).map((trip: any) => ({
        id: trip.id,
        vehicleId: trip.vehicle_id,
        startLocation: trip.start_location,
        endLocation: trip.end_location,
        startTime: new Date(trip.start_time),
        endTime: trip.end_time ? new Date(trip.end_time) : new Date(),
        route: trip.route || [],
        status: trip.status,
        distance: trip.distance || 0,
        duration: trip.duration || 0,
        maxSpeed: trip.max_speed || 0,
        avgSpeed: trip.avg_speed || 0,
        fuelConsumed: trip.fuel_consumed || 0,
      }));
      
      setTrips(formattedTrips);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startTrip = async (vehicleId: string, startLocation: any) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('trips')
        .insert({
          vehicle_id: vehicleId,
          user_id: user.id,
          start_location: startLocation,
          status: 'active',
        })
        .select()
        .single();

      if (error) throw error;
      
      const newTrip: Trip = {
        id: data.id,
        vehicleId: data.vehicle_id,
        startLocation: data.start_location,
        endLocation: data.end_location,
        startTime: new Date(data.start_time),
        endTime: data.end_time ? new Date(data.end_time) : new Date(),
        route: data.route || [],
        status: data.status,
        distance: data.distance || 0,
        duration: data.duration || 0,
        maxSpeed: data.max_speed || 0,
        avgSpeed: data.avg_speed || 0,
        fuelConsumed: data.fuel_consumed || 0,
      };
      
      setTrips(prev => [newTrip, ...prev]);
      return { success: true, data: newTrip };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const endTrip = async (tripId: string, endLocation: any, stats: any) => {
    try {
      const { data, error } = await supabase
        .from('trips')
        .update({
          end_location: endLocation,
          end_time: new Date().toISOString(),
          status: 'completed',
          ...stats,
        })
        .eq('id', tripId)
        .select()
        .single();

      if (error) throw error;
      
      const updatedTrip: Trip = {
        id: data.id,
        vehicleId: data.vehicle_id,
        startLocation: data.start_location,
        endLocation: data.end_location,
        startTime: new Date(data.start_time),
        endTime: new Date(data.end_time),
        route: data.route || [],
        status: data.status,
        distance: data.distance || 0,
        duration: data.duration || 0,
        maxSpeed: data.max_speed || 0,
        avgSpeed: data.avg_speed || 0,
        fuelConsumed: data.fuel_consumed || 0,
      };
      
      setTrips(prev => prev.map(t => t.id === tripId ? updatedTrip : t));
      return { success: true, data: updatedTrip };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  return {
    trips,
    loading,
    error,
    fetchTrips,
    startTrip,
    endTrip,
  };
};