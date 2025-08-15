import React from 'react';
import { Car, Clock, Wrench, Calendar, BarChart3, Users, MapPin, Zap } from 'lucide-react';

const FleetControlCentre: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="relative inline-block">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
              <Car className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
              <Zap className="w-4 h-4 text-yellow-900" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Fleet Control Centre
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Advanced Rental Vehicle Management Platform
          </p>
          
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-full font-semibold text-lg shadow-lg">
            <Clock className="w-6 h-6 mr-2" />
            Coming Soon
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Fleet Analytics */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Fleet Analytics</h3>
            <p className="text-slate-600 text-sm">
              Real-time insights on vehicle utilization, revenue tracking, and performance metrics
            </p>
            <div className="mt-4 text-xs text-blue-600 font-medium">Revenue • Utilization • KPIs</div>
          </div>

          {/* Customer Management */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Customer Management</h3>
            <p className="text-slate-600 text-sm">
              Manage rental customers, booking history, and customer service interactions
            </p>
            <div className="mt-4 text-xs text-green-600 font-medium">Bookings • History • Support</div>
          </div>

          {/* Maintenance Scheduler */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center mb-4">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Smart Maintenance</h3>
            <p className="text-slate-600 text-sm">
              Predictive maintenance scheduling and service history tracking for your fleet
            </p>
            <div className="mt-4 text-xs text-orange-600 font-medium">Predictive • Scheduling • History</div>
          </div>

          {/* Route Optimization */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Route Intelligence</h3>
            <p className="text-slate-600 text-sm">
              AI-powered route optimization and location-based services for better efficiency
            </p>
            <div className="mt-4 text-xs text-purple-600 font-medium">AI Routes • Efficiency • Optimization</div>
          </div>

          {/* Booking Calendar */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Booking Calendar</h3>
            <p className="text-slate-600 text-sm">
              Advanced calendar system for managing reservations and vehicle availability
            </p>
            <div className="mt-4 text-xs text-indigo-600 font-medium">Reservations • Availability • Calendar</div>
          </div>

          {/* Security Hub */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Security Hub</h3>
            <p className="text-slate-600 text-sm">
              Advanced anti-theft protection and real-time security monitoring for your fleet
            </p>
            <div className="mt-4 text-xs text-red-600 font-medium">Anti-theft • Monitoring • Alerts</div>
          </div>
        </div>

        {/* Launch Timeline */}
        <div className="bg-white rounded-xl p-8 shadow-lg border border-slate-200 text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Development Timeline</h2>
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-slate-600">Core Features - Q1 2025</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className="text-slate-600">Beta Testing - Q2 2025</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span className="text-slate-600">Full Launch - Q3 2025</span>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg">
            <p className="text-slate-700 font-medium">
              🚀 Be the first to know when Fleet Control Centre launches!
            </p>
            <p className="text-slate-600 text-sm mt-2">
              Advanced rental management features are being developed to help you maximize your fleet's potential.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FleetControlCentre;
