#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <HardwareSerial.h>
#include <TinyGPS++.h>

// WiFi credentials - REPLACE WITH YOUR ACTUAL WiFi DETAILS
const char* ssid = "YourActualWiFiName";        // Replace with your home/office WiFi name
const char* password = "YourActualWiFiPassword"; // Replace with your WiFi password

// Supabase Edge Function endpoint - FROM YOUR .env FILE
const char* serverURL = "https://snavhslypetgxivdvdok.supabase.co/functions/v1/gps-tracker";

// Temporary test endpoint while Supabase has issues
// const char* serverURL = "https://httpbin.org/post";  // This will echo back your GPS data

// Supabase API Key - FROM YOUR .env FILE (VITE_SUPABASE_ANON_KEY)
const char* supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNuYXZoc2x5cGV0Z3hpdmR2ZG9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwMjIxNjgsImV4cCI6MjA2OTU5ODE2OH0.QYHgyhW1gbGwePUIidvLedxR7F0f_Z3w7ed-WapHcdI";

// GPS configuration
TinyGPSPlus gps;
HardwareSerial ss(2); // Use Serial2 for GPS

// For ESP32-S NodeMCU 38-pin board:
// GPS RX (receives data FROM ESP32) connects to ESP32 GPIO17 (TX2)
// GPS TX (sends data TO ESP32) connects to ESP32 GPIO16 (RX2)
// GPS VCC connects to ESP32 3.3V
// GPS GND connects to ESP32 GND

// Timing variables
unsigned long lastGPSTime = 0;
unsigned long lastSendTime = 0;
const unsigned long GPS_READ_INTERVAL = 1000;    // Read GPS every 1 second
const unsigned long SEND_INTERVAL = 30000;       // Send data every 30 seconds

// GPS data variables
double latitude = 0.0;
double longitude = 0.0;
double speed_kmh = 0.0;
bool gps_valid = false;

// Status variables
bool wifi_connected = false;
int send_count = 0;

void setup() {
  // Initialize serial communication
  Serial.begin(115200);
  Serial.println("ESP32 NavIC GPS Tracker Starting...");
  
  // Try 9600 baud (most common for GPS modules)
  ss.begin(9600, SERIAL_8N1, 16, 17); // RX=GPIO16, TX=GPIO17
  Serial.println("GPS Serial initialized on GPIO16(RX), GPIO17(TX) at 9600 baud");
  
  // Connect to WiFi
  connectToWiFi();
  
  Serial.println("Setup complete. Starting GPS tracking...");
  Serial.println("Waiting for GPS fix...");
}

void loop() {
  // Check WiFi connection
  checkWiFiConnection();
  
  // Read GPS data
  readGPSData();
  
  // Send data periodically if GPS is valid
  if (millis() - lastSendTime >= SEND_INTERVAL) {
    if (gps_valid) {
      sendGPSData();
    } else {
      Serial.println("Waiting for valid GPS fix...");
    }
    lastSendTime = millis();
  }
  
  // Small delay to prevent watchdog issues
  delay(100);
}

void connectToWiFi() {
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(1000);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    wifi_connected = true;
    Serial.println();
    Serial.println("WiFi connected!");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
    Serial.print("Signal strength: ");
    Serial.print(WiFi.RSSI());
    Serial.println(" dBm");
  } else {
    wifi_connected = false;
    Serial.println();
    Serial.println("WiFi connection failed!");
  }
}

void checkWiFiConnection() {
  if (WiFi.status() != WL_CONNECTED) {
    wifi_connected = false;
    Serial.println("WiFi disconnected. Reconnecting...");
    connectToWiFi();
  } else {
    wifi_connected = true;
  }
}

void readGPSData() {
  // Read GPS data from Serial2
  static unsigned long lastDebugTime = 0;
  static String gpsBuffer = "";
  
  while (ss.available() > 0) {
    char c = ss.read();
    gpsBuffer += c;
    
    // Debug: Print raw GPS data every 10 seconds
    if (millis() - lastDebugTime >= 10000) {
      Serial.println("Raw GPS data received:");
      Serial.println(gpsBuffer);
      gpsBuffer = ""; // Clear buffer
      lastDebugTime = millis();
    }
    
    if (gps.encode(c)) {
      // New GPS sentence received and parsed
      if (gps.location.isValid()) {
        latitude = gps.location.lat();
        longitude = gps.location.lng();
        gps_valid = true;
        
        // Get speed (convert from m/s to km/h)
        if (gps.speed.isValid()) {
          speed_kmh = gps.speed.kmph();
        } else {
          speed_kmh = 0.0;
        }
        
        // Print GPS info every 5 seconds
        if (millis() - lastGPSTime >= 5000) {
          printGPSInfo();
          lastGPSTime = millis();
        }
      } else {
        // GPS sentence parsed but location not valid yet
        Serial.print("GPS parsing... Satellites: ");
        Serial.print(gps.satellites.value());
        Serial.print(", HDOP: ");
        Serial.println(gps.hdop.hdop());
      }
    }
  }
  
  // Check if GPS module is sending any data
  if (millis() - lastDebugTime >= 15000 && ss.available() == 0) {
    Serial.println("WARNING: No GPS data received! Check wiring.");
    lastDebugTime = millis();
  }
  
  // Check for GPS timeout (no valid data for 10 seconds)
  if (gps_valid && millis() - gps.location.age() > 10000) {
    gps_valid = false;
    Serial.println("GPS signal lost!");
  }
}

void printGPSInfo() {
  Serial.println("=== GPS Information ===");
  Serial.print("Location: ");
  Serial.print(latitude, 6);
  Serial.print(", ");
  Serial.println(longitude, 6);
  Serial.print("Speed: ");
  Serial.print(speed_kmh, 2);
  Serial.println(" km/h");
  Serial.print("Satellites: ");
  Serial.println(gps.satellites.value());
  Serial.print("HDOP: ");
  Serial.println(gps.hdop.hdop(), 2);
  Serial.print("Age: ");
  Serial.print(gps.location.age());
  Serial.println(" ms");
  Serial.println("========================");
}

void sendGPSData() {
  if (!wifi_connected) {
    Serial.println("Cannot send data: WiFi not connected");
    return;
  }
  
  if (!gps_valid) {
    Serial.println("Cannot send data: GPS not valid");
    return;
  }
  
  Serial.println("Preparing to send GPS data...");
  
  HTTPClient http;
  http.begin(serverURL);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", String("Bearer ") + supabaseKey);
  http.addHeader("apikey", supabaseKey);
  http.setTimeout(10000); // 10 second timeout
  
  // Create JSON payload
  StaticJsonDocument<200> doc;
  doc["lat"] = latitude;
  doc["lng"] = longitude;
  doc["speed"] = speed_kmh;
  doc["ignition"] = (speed_kmh > 1.0); // Assume ignition on if moving
  
  String jsonString;
  serializeJson(doc, jsonString);
  
  Serial.println("Sending GPS data...");
  Serial.print("URL: ");
  Serial.println(serverURL);
  Serial.print("Payload: ");
  Serial.println(jsonString);
  
  // Send HTTP POST request
  int httpResponseCode = http.POST(jsonString);
  
  Serial.print("HTTP Response code: ");
  Serial.println(httpResponseCode);
  
  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.print("Response: ");
    Serial.println(response);
    
    if (httpResponseCode == 200) {
      send_count++;
      Serial.print("✅ Data sent successfully! Count: ");
      Serial.println(send_count);
    } else {
      Serial.print("❌ Server error! Code: ");
      Serial.println(httpResponseCode);
    }
  } else {
    Serial.print("❌ HTTP Error: ");
    Serial.println(httpResponseCode);
    Serial.println("Possible causes:");
    Serial.println("- Wrong URL");
    Serial.println("- Edge Function not deployed");
    Serial.println("- Network timeout");
  }
  
  http.end();
}

// Debug function to print raw GPS data
void printRawGPSData() {
  Serial.println("Raw GPS data:");
  while (ss.available() > 0) {
    Serial.write(ss.read());
  }
}
