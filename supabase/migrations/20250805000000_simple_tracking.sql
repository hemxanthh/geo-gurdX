/*
  # Simple Vehicle Tracking Schema
  
  Just 3 essential tables for single vehicle tracking:
  1. vehicles - Basic vehicle information
  2. locations - Real-time GPS coordinates 
  3. trips - Trip records with start/end points
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create simple enum types
CREATE TYPE trip_status AS ENUM ('active', 'completed');

-- Vehicles table (simplified)
CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL DEFAULT 'My Vehicle',
  device_id text UNIQUE,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Locations table (real-time GPS data)
CREATE TABLE IF NOT EXISTS locations (
  id serial PRIMARY KEY,
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  lat float8 NOT NULL,
  lng float8 NOT NULL,
  speed float8 DEFAULT 0,
  ignition boolean DEFAULT false,
  recorded_at timestamptz DEFAULT now()
);

-- Trips table (simplified)
CREATE TABLE IF NOT EXISTS trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  start_time timestamptz DEFAULT now(),
  end_time timestamptz,
  start_lat float8,
  start_lng float8,
  end_lat float8,
  end_lng float8,
  distance_km float8 DEFAULT 0,
  status trip_status DEFAULT 'active'
);

-- Enable Row Level Security
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

-- Simple policies - users can only see their own data
CREATE POLICY "Users can manage own vehicles"
  ON vehicles FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage own locations"
  ON locations FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage own trips"
  ON trips FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vehicles_user_id ON vehicles(user_id);
CREATE INDEX IF NOT EXISTS idx_locations_vehicle_id ON locations(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_locations_recorded_at ON locations(recorded_at);
CREATE INDEX IF NOT EXISTS idx_trips_vehicle_id ON trips(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);
