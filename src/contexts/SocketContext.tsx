import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { VehicleStatus, Alert, Trip } from '../types';
import { SOCKET_URL } from '../config/api';

interface SocketContextType {
  connected: boolean;
  vehicleStatus: Record<string, VehicleStatus>;
  alerts: Alert[];
  activeTrips: Trip[];
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  // Return a default value if context is undefined instead of throwing
  if (context === undefined) {
    console.warn('useSocket used outside of SocketProvider, returning default values');
    return {
      connected: false,
      vehicleStatus: {},
      alerts: [],
      activeTrips: [],
    };
  }
  return context;
};

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [vehicleStatus, setVehicleStatus] = useState<Record<string, VehicleStatus>>({});
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [activeTrips, setActiveTrips] = useState<Trip[]>([]);
  
  // This is the line that was missing. It gets the user data.
  const { user } = useAuth(); 

  useEffect(() => {
    // Now the 'if (user)' check will work correctly.
    if (user) {
      const newSocket = io(SOCKET_URL);
      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log('Successfully connected to backend socket server with ID:', newSocket.id);
        setConnected(true);
      });
      
      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setConnected(false);
      });
      
      newSocket.on('welcome', (message: string) => {
        console.log('Message from server:', message);
      });

      newSocket.on('vehicleUpdate', (status: VehicleStatus) => {
        console.log('Received vehicle update:', status);
        setVehicleStatus({ [status.vehicleId]: status });
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from backend socket server.');
        setConnected(false);
      });

      newSocket.on('error', (error) => {
        console.error('Socket error:', error);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user]);

  const value = {
    connected,
    vehicleStatus,
    alerts,
    activeTrips,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};