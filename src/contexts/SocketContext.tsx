import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { VehicleStatus, Alert, Trip } from '../types';
import { RealtimeChannel } from '@supabase/supabase-js';

// Authentication bypass flag - set to true to enable ESP32 without auth
const BYPASS_AUTH = true;

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

  useEffect(() => {
    console.log('SocketContext: Initializing for ESP32 (auth bypassed)');
    
    if (BYPASS_AUTH) {
      // Bypass authentication - directly initialize subscriptions for ESP32
      console.log('SocketContext: Initializing subscriptions without auth...');
      initializeRealtimeSubscriptions();
      loadInitialData();
      setConnected(true); // Force connected status for ESP32
      
      // Add sample ESP32 vehicle data for testing
      setVehicleStatus({
        'esp32-vehicle-1': {
          vehicleId: 'esp32-vehicle-1',
          location: {
            lat: 13.00686617,  // Your ESP32 coordinates
            lng: 77.52843383
          },
          ignitionOn: false,
          engineLocked: false,
          batteryLevel: 85,
          gsmSignal: 80,
          gpsSignal: 90,
          isMoving: false,
          lastUpdate: new Date(),
          temperature: 25,
          mileage: 15430
        }
      });
      
    } else {
      console.log('SocketContext: Authentication required but bypassed');
      setConnected(false);
      setVehicleStatus({});
      setAlerts([]);
      setActiveTrips([]);
    }

    return () => {
      console.log('SocketContext: Cleanup effect running...');
      channels.forEach(channel => {
        supabase.removeChannel(channel);
      });
    };
  }, []); // No dependencies - run once on mount

  const initializeRealtimeSubscriptions = () => {
    // Removed user check for ESP32 compatibility

    const newChannels: RealtimeChannel[] = [];

    // Subscribe to locations updates (GPS tracking)
    const locationsChannel = supabase
      .channel('locations_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'locations',
        },
        (payload) => {
          console.log('Location update:', payload);
          handleLocationUpdate(payload);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Subscribed to location updates');
          setConnected(true);
        }
      });

    // Subscribe to alerts (ESP32 - no user filtering)
    const alertsChannel = supabase
      .channel('alerts_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'alerts',
        },
        (payload) => {
          console.log('Alert update:', payload);
          handleAlertUpdate(payload);
        }
      )
      .subscribe();

    // Subscribe to trips (ESP32 - no user filtering)
    const tripsChannel = supabase
      .channel('trips_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trips',
        },
        (payload) => {
          console.log('Trip update:', payload);
          handleTripUpdate(payload);
        }
      )
      .subscribe();

    newChannels.push(locationsChannel, alertsChannel, tripsChannel);
    setChannels(newChannels);
  };

  const loadInitialData = async () => {
    // Removed user check for ESP32 compatibility

    try {
      // Load latest locations (ESP32 - all vehicles)
      const { data: locationsData } = await supabase
        .from('locations')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(1);

      if (locationsData && locationsData.length > 0) {
        const latestLocation = locationsData[0];
        const statusMap: Record<string, VehicleStatus> = {};
        
        // Create a default vehicle status from latest location
        statusMap['default-vehicle'] = {
          vehicleId: 'default-vehicle',
          location: {
            lat: latestLocation.lat,
            lng: latestLocation.lng,
            timestamp: new Date(latestLocation.recorded_at)
          },
          ignitionOn: latestLocation.ignition || false,
          engineLocked: false,
          batteryLevel: 100,
          gsmSignal: 100,
          gpsSignal: 100,
          isMoving: (latestLocation.speed || 0) > 0,
          lastUpdate: new Date(latestLocation.recorded_at),
          temperature: undefined,
          mileage: 0,
        };
        
        setVehicleStatus(statusMap);
      }

      // Load alerts
      const { data: alertsData } = await supabase
        .from('alerts')
        .select('*')
        .order('alert_at', { ascending: false })
        .limit(50);

      if (alertsData) {
        const formattedAlerts: Alert[] = alertsData.map((alert: any) => ({
          id: alert.id,
          vehicleId: '',
          type: alert.type,
          message: alert.message,
          location: { lat: alert.lat, lng: alert.lng, speed: alert.speed },
          timestamp: new Date(alert.alert_at),
          isRead: false,
          severity: 'medium',
          acknowledged: false,
        }));
        setAlerts(formattedAlerts);
      }

      // Load active trips (ESP32 - all trips)
      const { data: tripsData } = await supabase
        .from('trips')
        .select('*')
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

  const handleLocationUpdate = (payload: any) => {
    const { eventType, new: newRecord } = payload; // Removed unused oldRecord
    
    if (eventType === 'INSERT' || eventType === 'UPDATE') {
      const status: VehicleStatus = {
        vehicleId: 'default-vehicle',
        location: {
          lat: newRecord.lat,
          lng: newRecord.lng,
          timestamp: new Date(newRecord.recorded_at)
        },
        ignitionOn: newRecord.ignition || false,
        engineLocked: false,
        batteryLevel: 100,
        gsmSignal: 100,
        gpsSignal: 100,
        isMoving: (newRecord.speed || 0) > 0,
        lastUpdate: new Date(newRecord.recorded_at),
        temperature: undefined,
        mileage: 0,
      };
      
      setVehicleStatus(prev => ({
        ...prev,
        'default-vehicle': status,
      }));
    }
  };

  const handleAlertUpdate = (payload: any) => {
    const { eventType, new: newRecord } = payload;
    
    if (eventType === 'INSERT') {
      const alert: Alert = {
        id: newRecord.id,
  vehicleId: '',
        type: newRecord.type,
        message: newRecord.message,
        location: { lat: newRecord.lat, lng: newRecord.lng, speed: newRecord.speed },
        timestamp: new Date(newRecord.alert_at),
        isRead: false,
        severity: 'medium',
        acknowledged: false,
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
    // Removed user check for ESP32 compatibility

    try {
      const { data, error } = await supabase
        .from('remote_commands')
        .insert({
          vehicle_id: vehicleId,
          user_id: 'esp32-device', // Default user for ESP32 commands
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