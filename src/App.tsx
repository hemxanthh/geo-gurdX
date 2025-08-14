import React, { useState } from 'react';
import { SocketProvider } from './contexts/SocketContext';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import LiveMap from './components/Map/LiveMap';
import Settings from './components/Settings/Settings';
import AlertsPage from './components/Alerts/AlertsPage';

// Toggle this to enable/disable authentication
const ENABLE_AUTH = false; // Set to true to enable login/registration forms

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Authentication is disabled - always show main app

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