import React, { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import LoginForm from './components/Auth/LoginForm';
import RegistrationForm from './components/Auth/RegistrationForm';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import LiveMap from './components/Map/LiveMap';
import Settings from './components/Settings/Settings';
import AlertsPage from './components/Alerts/AlertsPage';

// Toggle this to enable/disable authentication
const ENABLE_AUTH = false; // Set to true to enable login/registration forms

const App: React.FC = () => {
  const { user, profile, isLoading } = ENABLE_AUTH ? useAuth() : { user: null, profile: null, isLoading: false };
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showRegister, setShowRegister] = useState(false);

  // If authentication is enabled, show loading and login forms
  if (ENABLE_AUTH) {
    if (isLoading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-dark-bg via-primary-900 to-dark-bg flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent border-solid rounded-full spinner-modern mx-auto mb-6"></div>
            <div className="modern-card p-6 max-w-md">
              <h3 className="text-xl font-bold text-gradient mb-2">GeoGuard Initializing</h3>
              <p className="text-dark-text-muted text-sm">Setting up your anti-theft dashboard</p>
            </div>
          </div>
        </div>
      );
    }

    if (!user) {
      return (
        <div className="fade-in">
          {showRegister ? (
            <RegistrationForm onSwitchToLogin={() => setShowRegister(false)} />
          ) : (
            <LoginForm onSwitchToRegister={() => setShowRegister(true)} />
          )}
        </div>
      );
    }
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigateToMap={() => setCurrentPage('live-map')} />;
      case 'live-map':
        return <LiveMap />;
      case 'settings':
        return <Settings />;
      case 'alerts':
        return <AlertsPage />;
      default:
        return <Dashboard onNavigateToMap={() => setCurrentPage('live-map')} />;
    }
  };

  return (
    <SocketProvider>
      <div className="min-h-screen bg-gradient-to-br from-dark-bg via-primary-900/20 to-dark-bg">
        <Header 
          onMenuClick={() => setSidebarOpen(true)} 
          onSettingsClick={() => setCurrentPage('settings')}
        />
        <div className="flex">
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
          <main className="flex-1 p-4 sm:p-6 lg:ml-0 mobile-content">
            <div className="max-w-7xl mx-auto fade-in">
              {renderCurrentPage()}
            </div>
          </main>
        </div>
      </div>
    </SocketProvider>
  );
};

export default App;