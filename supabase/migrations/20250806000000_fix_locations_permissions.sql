-- Fix permissions for locations table to allow ESP32 GPS data insertion

-- First, make sure the table exists with correct structure
CREATE TABLE IF NOT EXISTS public.locations (
    id BIGSERIAL PRIMARY KEY,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    speed DOUBLE PRECISION DEFAULT 0,
    ignition BOOLEAN DEFAULT false,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable Row Level Security to allow anonymous access
ALTER TABLE public.locations DISABLE ROW LEVEL SECURITY;

-- Grant permissions to anonymous and authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON public.locations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.locations TO authenticated;

-- Grant sequence permissions for auto-incrementing ID
GRANT USAGE, SELECT ON SEQUENCE public.locations_id_seq TO anon;
GRANT USAGE, SELECT ON SEQUENCE public.locations_id_seq TO authenticated;
