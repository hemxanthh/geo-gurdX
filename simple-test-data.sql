-- Simple test data for your 3 tables: locations, alerts, trips
-- Add some sample location data

INSERT INTO locations (lat, lng, speed, ignition, recorded_at) 
VALUES 
  -- Bangalore coordinates - vehicle moving
  (12.9716, 77.5946, 45, true, NOW() - interval '5 minutes'),
  (12.9720, 77.5950, 42, true, NOW() - interval '4 minutes'),
  (12.9725, 77.5955, 38, true, NOW() - interval '3 minutes'),
  (12.9730, 77.5960, 35, true, NOW() - interval '2 minutes'),
  (12.9735, 77.5965, 0, false, NOW() - interval '1 minute'),
  -- Latest position (current) - vehicle stopped
  (12.9740, 77.5970, 0, false, NOW());

-- Add sample trip data
INSERT INTO trips (start_time, end_time, start_lat, start_lng, end_lat, end_lng, distance_km) 
VALUES 
  (NOW() - interval '10 minutes', NOW(), 12.9716, 77.5946, 12.9740, 77.5970, 2.5);

-- Add sample alert (if you have alert structure defined)
-- INSERT INTO alerts (type, message, alert_at, lat, lng, speed) 
-- VALUES 
--   ('unauthorized_movement', 'Vehicle moved without ignition', NOW() - interval '1 hour', 12.9716, 77.5946, 0);
