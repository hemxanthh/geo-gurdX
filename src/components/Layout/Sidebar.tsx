import React from 'react';
import { X, Home, Map, Navigation, Zap, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: string;
  onPageChange: (page: string) => void;
}

import { useSocket } from '../../contexts/SocketContext';

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, currentPage, onPageChange }) => {
  const { alerts } = useSocket();
  const unreadAlerts = alerts.filter(a => !a.isRead).length;
  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: Home, 
      description: 'Overview & Analytics',
      gradient: 'from-primary-500 to-primary-600'
    },
    { 
      id: 'live-map', 
      label: 'Live Tracking', 
      icon: Map, 
      description: 'Real-time GPS Location',
      gradient: 'from-accent-emerald to-green-600',
      highlight: true
    },
    { 
      id: 'alerts',
      label: 'Alerts',
      icon: AlertTriangle,
      description: 'Security & System Alerts',
      gradient: 'from-red-500 to-orange-500',
      badge: unreadAlerts
    },
  ];

  const handlePageClick = (pageId: string) => {
    onPageChange(pageId);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={clsx(
        'fixed left-0 top-0 h-full w-80 bg-slate-50 shadow-xl z-50 transform transition-all duration-300 ease-out',
        'lg:relative lg:translate-x-0 lg:shadow-none border-r border-slate-200',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-slate-50">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-slate-400 to-accent-500 rounded-xl flex items-center justify-center shadow-md">
                  <Navigation className="w-7 h-7 text-slate-900" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent-500 rounded-full pulse-live border-2 border-slate-50"></div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">GeoGuard</h2>
                <p className="text-sm text-slate-500">Anti-Theft System</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="lg:hidden p-2 rounded-xl bg-slate-200 text-slate-500 hover:text-accent-red hover:bg-accent-red/10 transition-all duration-300"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-3 bg-slate-50">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handlePageClick(item.id)}
                  className={clsx(
                    'w-full flex items-center space-x-4 px-4 py-4 rounded-xl transition-all duration-300',
                    'text-left group relative overflow-hidden',
                    isActive
                      ? 'bg-slate-200 text-slate-900 shadow-lg scale-[1.02] border border-slate-300'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-100',
                    item.highlight && !isActive && 'border-accent-500/30 hover:border-accent-500/50'
                  )}
                >
                  <div className={clsx(
                    'relative p-2 rounded-xl transition-all duration-300',
                    isActive 
                      ? 'bg-slate-100' 
                      : 'bg-slate-200 group-hover:scale-110'
                  )}>
                    <Icon className="w-5 h-5 text-slate-900" />
                    {item.badge > 0 && (
                      <span className="absolute -top-2 -right-2 bg-accent-orange text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 relative z-10">
                    <div className={clsx(
                      'font-semibold text-sm',
                      isActive 
                        ? 'text-slate-900' 
                        : 'text-slate-700 group-hover:text-slate-900'
                    )}>
                      {item.label}
                      {item.highlight && (
                        <span className={clsx(
                          'ml-2 px-2 py-0.5 text-xs rounded-full font-medium',
                          isActive 
                            ? 'bg-accent-500/20 text-accent-500' 
                            : 'bg-accent-500/10 text-accent-500 group-hover:bg-accent-500/20 group-hover:text-accent-500'
                        )}>
                          LIVE
                        </span>
                      )}
                    </div>
                    <div className={clsx(
                      'text-xs',
                      isActive 
                        ? 'text-slate-600'
                        : 'text-slate-400 group-hover:text-slate-600'
                    )}>
                      {item.description}
                    </div>
                  </div>
                  {/* Active indicator */}
                  {isActive && (
                    <div className="w-1 h-8 bg-accent-500 rounded-full"></div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* System Status */}
          <div className="p-4 border-t border-slate-200 bg-slate-50">
            <div className="bg-slate-100 rounded-xl p-4 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-3 h-3 bg-accent-500 rounded-full pulse-live"></div>
                  <div className="absolute inset-0 bg-accent-500 rounded-full animate-ping opacity-40"></div>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm text-slate-800">System Online</div>
                  <div className="text-xs text-slate-500">All systems operational</div>
                </div>
                <Zap className="w-4 h-4 text-accent-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;