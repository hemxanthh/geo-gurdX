import React from 'react';
import { X, Home, Map, History, Navigation, Zap } from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, currentPage, onPageChange }) => {
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
      id: 'trips', 
      label: 'Trip History', 
      icon: History, 
      description: 'Past Journeys & Routes',
      gradient: 'from-accent-cyan to-blue-600'
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
        'fixed left-0 top-0 h-full w-80 glass-effect z-50 transform transition-all duration-300 ease-out',
        'lg:relative lg:translate-x-0 lg:shadow-none border-r border-white/10',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-cyan rounded-xl flex items-center justify-center glow-effect">
                  <Navigation className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent-emerald rounded-full pulse-live border-2 border-dark-bg"></div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gradient">GeoGuard</h2>
                <p className="text-sm text-dark-text-muted">Anti-Theft System</p>
              </div>
            </div>
            
            <button 
              onClick={onClose}
              className="lg:hidden p-2 rounded-xl bg-dark-card/50 text-dark-text-muted hover:text-accent-red hover:bg-accent-red/10 transition-all duration-300"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handlePageClick(item.id)}
                  className={clsx(
                    'w-full flex items-center space-x-4 px-4 py-4 rounded-2xl transition-all duration-300',
                    'text-left group relative overflow-hidden',
                    isActive
                      ? `bg-gradient-to-r ${item.gradient} text-white shadow-2xl glow-effect transform scale-[1.02]`
                      : 'text-dark-text hover:bg-white/5 hover:text-white border border-white/5',
                    item.highlight && !isActive && 'border-accent-emerald/30 hover:border-accent-emerald/50'
                  )}
                >
                  {/* Animated background for non-active items */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  )}
                  
                  <div className={clsx(
                    'relative p-2 rounded-xl transition-all duration-300',
                    isActive 
                      ? 'bg-white/20' 
                      : `bg-gradient-to-br ${item.gradient} group-hover:scale-110`
                  )}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  
                  <div className="flex-1 relative z-10">
                    <div className={clsx(
                      'font-semibold text-sm',
                      isActive 
                        ? 'text-white' 
                        : 'text-dark-text group-hover:text-white'
                    )}>
                      {item.label}
                      {item.highlight && (
                        <span className={clsx(
                          'ml-2 px-2 py-0.5 text-xs rounded-full font-medium',
                          isActive 
                            ? 'bg-white/20 text-white' 
                            : 'bg-accent-emerald/20 text-accent-emerald group-hover:bg-white/20 group-hover:text-white'
                        )}>
                          LIVE
                        </span>
                      )}
                    </div>
                    <div className={clsx(
                      'text-xs',
                      isActive 
                        ? 'text-white/80'
                        : 'text-dark-text-muted group-hover:text-white/80'
                    )}>
                      {item.description}
                    </div>
                  </div>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="w-1 h-8 bg-white/50 rounded-full"></div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* System Status */}
          <div className="p-4 border-t border-white/10">
            <div className="modern-card p-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-3 h-3 bg-accent-emerald rounded-full pulse-live"></div>
                  <div className="absolute inset-0 bg-accent-emerald rounded-full animate-ping opacity-40"></div>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm text-dark-text">System Online</div>
                  <div className="text-xs text-dark-text-muted">All systems operational</div>
                </div>
                <Zap className="w-4 h-4 text-accent-emerald" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;