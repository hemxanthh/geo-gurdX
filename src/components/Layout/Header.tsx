import React, { useState } from 'react';
import { Bell, Menu, Navigation, Zap, Wifi, WifiOff, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';
import AlertsPanel from '../Alerts/AlertsPanel';
import clsx from 'clsx';

interface HeaderProps {
  onMenuClick: () => void;
  onSettingsClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, onSettingsClick }) => {
  const { profile, logout } = useAuth();
  const { connected, alerts } = useSocket();
  const [showProfile, setShowProfile] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="bg-slate-50 border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Live Status Indicator */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className={clsx(
              "flex items-center space-x-3 px-4 py-2 rounded-full transition-all duration-300",
              connected 
                ? "bg-gradient-to-r from-accent-emerald/20 to-accent-emerald/10 border border-accent-emerald/30" 
                : "bg-gradient-to-r from-accent-red/20 to-accent-red/10 border border-accent-red/30"
            )}>
              {connected ? (
                <>
                  <div className="relative">
                    <Wifi className="w-5 h-5 text-accent-emerald" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent-emerald rounded-full pulse-live"></div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-accent-emerald">LIVE TRACKING</span>
                    <div className="text-xs text-dark-text-muted">
                      Real-time GPS monitoring
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <WifiOff className="w-5 h-5 text-accent-red" />
                  <span className="text-sm font-medium text-accent-red">OFFLINE</span>
                </>
              )}
            </div>
          </div>

          {/* Center - Logo and Mobile Menu */}
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="relative mr-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-400 to-accent-500 flex items-center justify-center shadow-md">
                  <Navigation className="w-6 h-6 text-slate-900" />
                </div>
                {connected && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent-500 rounded-full pulse-live border-2 border-slate-50"></div>
                )}
              </div>
              <div className="hidden sm:block text-left">
                <h1 className="text-xl font-bold text-slate-800">GeoGuard</h1>
                <p className="text-xs text-slate-500">NavIC-Powered Anti-Theft System</p>
              </div>
            </div>
            <button
              onClick={onMenuClick}
              className="lg:hidden ml-4 p-2 rounded-xl bg-slate-200 text-slate-700 hover:text-accent-500 hover:bg-accent-500/10 transition-all duration-300 hover:scale-105 active:scale-95"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Right side - Actions and User menu */}
          <div className="flex items-center space-x-3">
            {/* Mobile Status Indicator */}
            <div className="lg:hidden">
              <div className={clsx(
                "p-2 rounded-xl transition-all duration-300",
                connected 
                  ? "bg-accent-emerald/20 text-accent-emerald status-online" 
                  : "bg-accent-red/20 text-accent-red"
              )}>
                {connected ? (
                  <Wifi className="w-5 h-5" />
                ) : (
                  <WifiOff className="w-5 h-5" />
                )}
              </div>
            </div>

            {/* Settings */}
            <button 
              onClick={onSettingsClick}
              className="p-2 rounded-xl bg-slate-200 text-slate-500 hover:text-accent-500 hover:bg-accent-500/10 transition-all duration-300 border border-slate-200"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* Notifications */}
            <button 
              onClick={() => setShowAlerts(!showAlerts)}
              className="relative p-2 rounded-xl bg-slate-200 text-slate-500 hover:text-accent-500 hover:bg-accent-500/10 transition-all duration-300 border border-slate-200"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              {alerts.filter(alert => !alert.isRead).length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent-orange rounded-full text-xs flex items-center justify-center text-white font-medium">
                  {alerts.filter(alert => !alert.isRead).length}
                </span>
              )}
            </button>

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center space-x-3 p-2 rounded-xl bg-slate-200 hover:bg-accent-500/10 transition-all duration-300 border border-slate-200"
                aria-label="User menu"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-400 to-accent-500 flex items-center justify-center">
                  <span className="text-slate-900 font-semibold text-sm">
                    {profile?.username?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium text-slate-800">
                    {profile?.username || 'User'}
                  </div>
                  <div className="text-xs text-slate-500">Driver</div>
                </div>
              </button>

              {/* Dropdown Menu */}
              {showProfile && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-50 border border-slate-200 rounded-xl shadow-lg py-2 z-50">
                  <div className="px-4 py-3 border-b border-slate-200">
                    <div className="text-sm font-medium text-slate-800">
                      {profile?.username || 'User'}
                    </div>
                    <div className="text-xs text-slate-500">
                      {profile?.email}
                    </div>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={handleSignOut}
                      disabled={isLoggingOut}
                      className={`w-full text-left px-4 py-3 text-sm transition-colors duration-200 flex items-center space-x-3 ${
                        isLoggingOut 
                          ? 'text-slate-400 cursor-not-allowed' 
                          : 'text-slate-800 hover:bg-accent-red/10 hover:text-accent-red'
                      }`}
                    >
                      {isLoggingOut ? (
                        <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Zap className="w-4 h-4" />
                      )}
                      <span>{isLoggingOut ? 'Signing out...' : 'Sign Out'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Live Status Bar */}
      <div className="lg:hidden border-t border-slate-200 px-4 py-2 bg-slate-50">
        <div className={clsx(
          "flex items-center justify-center space-x-2 text-sm",
          connected ? "text-accent-500" : "text-accent-red"
        )}>
          {connected ? (
            <>
              <div className="w-2 h-2 bg-accent-500 rounded-full pulse-live"></div>
              <span className="font-medium">LIVE TRACKING ACTIVE</span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 bg-accent-red rounded-full"></div>
              <span className="font-medium">TRACKING OFFLINE</span>
            </>
          )}
        </div>
      </div>

      {/* Background overlay for mobile profile */}
      {showProfile && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowProfile(false)}
        />
      )}

      {/* Alerts Panel */}
      <AlertsPanel 
        isOpen={showAlerts}
        onClose={() => setShowAlerts(false)}
      />
    </header>
  );
};

export default Header;