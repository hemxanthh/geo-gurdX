export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          email: string | null
          phone: string | null
          role: 'user' | 'admin' | 'manager'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          email?: string | null
          phone?: string | null
          role?: 'user' | 'admin' | 'manager'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          email?: string | null
          phone?: string | null
          role?: 'user' | 'admin' | 'manager'
          created_at?: string
          updated_at?: string
        }
      }
      vehicles: {
        Row: {
          id: string
          user_id: string
          name: string
          license_plate: string | null
          make: string | null
          model: string | null
          year: number | null
          device_id: string | null
          is_active: boolean
          color: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          license_plate?: string | null
          make?: string | null
          model?: string | null
          year?: number | null
          device_id?: string | null
          is_active?: boolean
          color?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          license_plate?: string | null
          make?: string | null
          model?: string | null
          year?: number | null
          device_id?: string | null
          is_active?: boolean
          color?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      trips: {
        Row: {
          id: string
          vehicle_id: string
          user_id: string
          start_location: Json
          end_location: Json | null
          start_time: string
          end_time: string | null
          route: Json
          status: 'active' | 'completed'
          distance: number
          duration: number
          max_speed: number
          avg_speed: number
          fuel_consumed: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          vehicle_id: string
          user_id: string
          start_location: Json
          end_location?: Json | null
          start_time?: string
          end_time?: string | null
          route?: Json
          status?: 'active' | 'completed'
          distance?: number
          duration?: number
          max_speed?: number
          avg_speed?: number
          fuel_consumed?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          vehicle_id?: string
          user_id?: string
          start_location?: Json
          end_location?: Json | null
          start_time?: string
          end_time?: string | null
          route?: Json
          status?: 'active' | 'completed'
          distance?: number
          duration?: number
          max_speed?: number
          avg_speed?: number
          fuel_consumed?: number
          created_at?: string
          updated_at?: string
        }
      }
      alerts: {
        Row: {
          id: string
          vehicle_id: string
          user_id: string
          type: 'unauthorized_movement' | 'ignition_tamper' | 'geofence_breach' | 'low_battery' | 'emergency' | 'engine_lock' | 'engine_unlock'
          message: string
          location: Json
          severity: 'low' | 'medium' | 'high' | 'critical'
          is_read: boolean
          acknowledged: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          vehicle_id: string
          user_id: string
          type: 'unauthorized_movement' | 'ignition_tamper' | 'geofence_breach' | 'low_battery' | 'emergency' | 'engine_lock' | 'engine_unlock'
          message: string
          location: Json
          severity?: 'low' | 'medium' | 'high' | 'critical'
          is_read?: boolean
          acknowledged?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          vehicle_id?: string
          user_id?: string
          type?: 'unauthorized_movement' | 'ignition_tamper' | 'geofence_breach' | 'low_battery' | 'emergency' | 'engine_lock' | 'engine_unlock'
          message?: string
          location?: Json
          severity?: 'low' | 'medium' | 'high' | 'critical'
          is_read?: boolean
          acknowledged?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      vehicle_status: {
        Row: {
          id: string
          vehicle_id: string
          user_id: string
          location: Json
          ignition_on: boolean
          engine_locked: boolean
          battery_level: number
          gsm_signal: number
          gps_signal: number
          is_moving: boolean
          speed: number
          temperature: number | null
          mileage: number
          last_update: string
          created_at: string
        }
        Insert: {
          id?: string
          vehicle_id: string
          user_id: string
          location: Json
          ignition_on?: boolean
          engine_locked?: boolean
          battery_level?: number
          gsm_signal?: number
          gps_signal?: number
          is_moving?: boolean
          speed?: number
          temperature?: number | null
          mileage?: number
          last_update?: string
          created_at?: string
        }
        Update: {
          id?: string
          vehicle_id?: string
          user_id?: string
          location?: Json
          ignition_on?: boolean
          engine_locked?: boolean
          battery_level?: number
          gsm_signal?: number
          gps_signal?: number
          is_moving?: boolean
          speed?: number
          temperature?: number | null
          mileage?: number
          last_update?: string
          created_at?: string
        }
      }
      remote_commands: {
        Row: {
          id: string
          vehicle_id: string
          user_id: string
          command: 'lock_engine' | 'unlock_engine' | 'get_status' | 'emergency_stop' | 'horn' | 'lights'
          status: 'pending' | 'sent' | 'acknowledged' | 'failed' | 'timeout'
          response: string | null
          executed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          vehicle_id: string
          user_id: string
          command: 'lock_engine' | 'unlock_engine' | 'get_status' | 'emergency_stop' | 'horn' | 'lights'
          status?: 'pending' | 'sent' | 'acknowledged' | 'failed' | 'timeout'
          response?: string | null
          executed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          vehicle_id?: string
          user_id?: string
          command?: 'lock_engine' | 'unlock_engine' | 'get_status' | 'emergency_stop' | 'horn' | 'lights'
          status?: 'pending' | 'sent' | 'acknowledged' | 'failed' | 'timeout'
          response?: string | null
          executed_at?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'user' | 'admin' | 'manager'
      trip_status: 'active' | 'completed'
      alert_severity: 'low' | 'medium' | 'high' | 'critical'
      alert_type: 'unauthorized_movement' | 'ignition_tamper' | 'geofence_breach' | 'low_battery' | 'emergency' | 'engine_lock' | 'engine_unlock'
      command_status: 'pending' | 'sent' | 'acknowledged' | 'failed' | 'timeout'
      command_type: 'lock_engine' | 'unlock_engine' | 'get_status' | 'emergency_stop' | 'horn' | 'lights'
    }
  }
}