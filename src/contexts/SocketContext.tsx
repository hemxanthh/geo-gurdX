import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';
import { VehicleStatus, Alert, Trip } from '../types';
import { RealtimeChannel } from '@supabase/supabase-js';

interface SocketContextType {
  connected: boolean;
  vehicleStatus: Record<string, VehicleStatus>;
  alerts: Alert[];
  activeTrips: Trip[];
  sendCommand: (vehicleId: string, command: string) => Promise<boolean>;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    console.warn('useSocket used outside of SocketProvider, returning default values');
    return {
      connected: false,
      vehicleStatus: {},
      alerts: [],
      activeTrips: [],
      sendCommand: async () => false,
    };
  }
  return context;
};

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [vehicleStatus, setVehicleStatus] = useState<Record<string, VehicleStatus>>({});
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [activeTrips, setActiveTrips] = useState<Trip[]>([]);
  const [channels, setChannels] = useState<RealtimeChannel[]>([]);
  
  const { user, profile } = useAuth();

  useEffect(() => {
    if (user && profile) {
      initializeRealtimeSubscriptions();
      loadInitialData();
    } else {
      // Cleanup subscriptions when user logs out
      channels.forEach(channel => {
        supabase.removeChannel(channel);
      });
      setChannels([]);
      setConnected(false);
      setVehicleStatus({});
      setAlerts([]);
      setActiveTrips([]);
    }

    return () => {
      channels.forEach(channel => {
        supabase.removeChannel(channel);
      });
    };
  }, [user, profile]);

  const initializeRealtimeSubscriptions = () => {
    if (!user) return;

    const newChannels: RealtimeChannel[] = [];

    // Subscribe to vehicle status updates
    const vehicleStatusChannel = supabase
      .channel('vehicle_status_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'vehicle_status',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Vehicle status update:', payload);
          handleVehicleStatusUpdate(payload);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Subscribed to vehicle status updates');
          setConnected(true);
        }
      });

    // Subscribe to alerts
    const alertsChannel = supabase
      .channel('alerts_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'alerts',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Alert update:', payload);
          handleAlertUpdate(payload);
        }
      )
      .subscribe();

    // Subscribe to trips
    const tripsChannel = supabase
      .channel('trips_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trips',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Trip update:', payload);
          handleTripUpdate(payload);
        }
      )
      .subscribe();

    newChannels.push(vehicleStatusChannel, alertsChannel, tripsChannel);
    setChannels(newChannels);
  };

  const loadInitialData = async () => {
    if (!user) return;

    try {
      // Load vehicle status
      const { data: vehicleStatusData } = await supabase
        .from('vehicle_status')
        .select('*')
        .eq('user_id', user.id);

      if (vehicleStatusData) {
        const statusMap: Record<string, VehicleStatus> = {};
        vehicleStatusData.forEach((status: any) => {
          statusMap[status.vehicle_id] = {
            vehicleId: status.vehicle_id,
            location: status.location as any,
            ignitionOn: status.ignition_on,
            engineLocked: status.engine_locked,
            batteryLevel: status.battery_level,
            gsmSignal: status.gsm_signal,
            gpsSignal: status.gps_signal,
            isMoving: status.is_moving,
            lastUpdate: new Date(status.last_update),
            temperature: status.temperature,
            mileage: status.mileage,
          };
        });
        setVehicleStatus(statusMap);
      }

      // Load alerts
      const { data: alertsData } = await supabase
        .from('alerts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (alertsData) {
        const formattedAlerts: Alert[] = alertsData.map((alert: any) => ({
          id: alert.id,
          vehicleId: alert.vehicle_id,
          type: alert.type,
          message: alert.message,
          location: alert.location as any,
          timestamp: new Date(alert.created_at),
          isRead: alert.is_read,
          severity: alert.severity,
          acknowledged: alert.acknowledged,
        }));
        setAlerts(formattedAlerts);
      }

      // Load active trips
      const { data: tripsData } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (tripsData) {
        const formattedTrips: Trip[] = tripsData.map((trip: any) => ({
          id: trip.id,
          vehicleId: trip.vehicle_id,
          startLocation: trip.start_location as any,
          endLocation: trip.end_location as any,
          startTime: new Date(trip.start_time),
          endTime: trip.end_time ? new Date(trip.end_time) : new Date(),
          route: trip.route as any,
          status: trip.status,
          distance: trip.distance,
          duration: trip.duration,
          maxSpeed: trip.max_speed,
          avgSpeed: trip.avg_speed,
          fuelConsumed: trip.fuel_consumed,
        }));
        setActiveTrips(formattedTrips);
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const handleVehicleStatusUpdate = (payload: any) => {
    const { eventType, new: newRecord, old: oldRecord } = payload;
    
    if (eventType === 'INSERT' || eventType === 'UPDATE') {
      const status: VehicleStatus = {
        vehicleId: newRecord.vehicle_id,
        location: newRecord.location,
        ignitionOn: newRecord.ignition_on,
        engineLocked: newRecord.engine_locked,
        batteryLevel: newRecord.battery_level,
        gsmSignal: newRecord.gsm_signal,
        gpsSignal: newRecord.gps_signal,
        isMoving: newRecord.is_moving,
        lastUpdate: new Date(newRecord.last_update),
        temperature: newRecord.temperature,
        mileage: newRecord.mileage,
      };
      
      setVehicleStatus(prev => ({
        ...prev,
        [newRecord.vehicle_id]: status,
      }));
    } else if (eventType === 'DELETE') {
      setVehicleStatus(prev => {
        const updated = { ...prev };
        delete updated[oldRecord.vehicle_id];
        return updated;
      });
    }
  };

  const handleAlertUpdate = (payload: any) => {
    const { eventType, new: newRecord } = payload;
    
    if (eventType === 'INSERT') {
      const alert: Alert = {
        id: newRecord.id,
        vehicleId: newRecord.vehicle_id,
        type: newRecord.type,
        message: newRecord.message,
        location: newRecord.location,
        timestamp: new Date(newRecord.created_at),
        isRead: newRecord.is_read,
        severity: newRecord.severity,
        acknowledged: newRecord.acknowledged,
      };
      
      setAlerts(prev => [alert, ...prev.slice(0, 49)]);
    }
  };

  const handleTripUpdate = (payload: any) => {
    const { eventType, new: newRecord } = payload;
    
    if (eventType === 'INSERT' || eventType === 'UPDATE') {
      const trip: Trip = {
        id: newRecord.id,
        vehicleId: newRecord.vehicle_id,
        startLocation: newRecord.start_location,
        endLocation: newRecord.end_location,
        startTime: new Date(newRecord.start_time),
        endTime: newRecord.end_time ? new Date(newRecord.end_time) : new Date(),
        route: newRecord.route,
        status: newRecord.status,
        distance: newRecord.distance,
        duration: newRecord.duration,
        maxSpeed: newRecord.max_speed,
        avgSpeed: newRecord.avg_speed,
        fuelConsumed: newRecord.fuel_consumed,
      };
      
      if (newRecord.status === 'active') {
        setActiveTrips(prev => {
          const filtered = prev.filter(t => t.id !== newRecord.id);
          return [...filtered, trip];
        });
      } else {
        setActiveTrips(prev => prev.filter(t => t.id !== newRecord.id));
      }
    }
  };

  const sendCommand = async (vehicleId: string, command: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('remote_commands')
        .insert({
          vehicle_id: vehicleId,
          user_id: user.id,
          command: command as any,
          status: 'pending',
        })
        .select()
        .single();

      if (error) {
        console.error('Error sending command:', error);
        return false;
      }

      // Simulate command execution (in a real app, this would be handled by your IoT backend)
      setTimeout(async () => {
        await supabase
          .from('remote_commands')
          .update({
            status: 'acknowledged',
            response: 'Command executed successfully',
            executed_at: new Date().toISOString(),
          })
          .eq('id', data.id);

        // Simulate vehicle status update based on command
        if (command === 'lock_engine' || command === 'unlock_engine') {
          const engineLocked = command === 'lock_engine';
          await supabase
            .from('vehicle_status')
            .update({
              engine_locked: engineLocked,
              last_update: new Date().toISOString(),
            })
            .eq('vehicle_id', vehicleId);
        }
      }, 2000);

      return true;
    } catch (error) {
      console.error('Error sending command:', error);
      return false;
    }
  };

  const value = {
    connected,
    vehicleStatus,
    alerts,
    activeTrips,
    sendCommand,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};