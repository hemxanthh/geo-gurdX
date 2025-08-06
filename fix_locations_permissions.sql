-- Disable RLS and allow public access to locations table
ALTER TABLE public.locations DISABLE ROW LEVEL SECURITY;

-- Grant necessary permissions for anonymous users to insert GPS data
GRANT ALL ON public.locations TO anon;
GRANT ALL ON public.locations TO authenticated;

-- Allow sequence usage for auto-incrementing IDs
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
