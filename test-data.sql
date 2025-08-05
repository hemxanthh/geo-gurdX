-- Add test data for live tracking demo

-- First, let's add a test vehicle 
-- Replace 'your-user-id' with your actual user ID from auth.users
INSERT INTO vehicles (user_id, name, device_id, is_active) 
VALUES (
  (SELECT id FROM auth.users LIMIT 1), -- Gets your user ID
  'Test Vehicle',
  'ESP32-001',
  true
) ON CONFLICT (device_id) DO NOTHING;

-- Get the vehicle ID we just created
-- Add some sample location data (Bangalore coordinates)
INSERT INTO locations (vehicle_id, user_id, lat, lng, speed, ignition, recorded_at) 
VALUES 
  -- Vehicle moving through Bangalore
  ((SELECT id FROM vehicles WHERE device_id = 'ESP32-001'), (SELECT id FROM auth.users LIMIT 1), 12.9716, 77.5946, 45, true, NOW() - interval '5 minutes'),
  ((SELECT id FROM vehicles WHERE device_id = 'ESP32-001'), (SELECT id FROM auth.users LIMIT 1), 12.9720, 77.5950, 42, true, NOW() - interval '4 minutes'),
  ((SELECT id FROM vehicles WHERE device_id = 'ESP32-001'), (SELECT id FROM auth.users LIMIT 1), 12.9725, 77.5955, 38, true, NOW() - interval '3 minutes'),
  ((SELECT id FROM vehicles WHERE device_id = 'ESP32-001'), (SELECT id FROM auth.users LIMIT 1), 12.9730, 77.5960, 35, true, NOW() - interval '2 minutes'),
  ((SELECT id FROM vehicles WHERE device_id = 'ESP32-001'), (SELECT id FROM auth.users LIMIT 1), 12.9735, 77.5965, 0, false, NOW() - interval '1 minute'),
  -- Latest position (current)
  ((SELECT id FROM vehicles WHERE device_id = 'ESP32-001'), (SELECT id FROM auth.users LIMIT 1), 12.9740, 77.5970, 0, false, NOW());

-- Add a sample trip
INSERT INTO trips (vehicle_id, user_id, start_time, start_lat, start_lng, distance_km, status)
VALUES (
  (SELECT id FROM vehicles WHERE device_id = 'ESP32-001'),
  (SELECT id FROM auth.users LIMIT 1),
  NOW() - interval '10 minutes',
  12.9716,
  77.5946,
  2.5,
  'active'
);
