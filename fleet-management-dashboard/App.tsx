import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import MaintenancePage from './components/MaintenancePage';
import LoginPage from './components/LoginPage';
import { Company, User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [view, setView] = useState<'landing' | 'dashboard' | 'maintenance'>('landing');

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setView('landing');
  };

  const handleLogout = () => {
    setUser(null);
    setSelectedCompany(null);
  };

  const handleSelectCompany = (company: Company) => {
    setSelectedCompany(company);
    setView('dashboard');
  };

  const handleBackToHome = () => {
    setSelectedCompany(null);
    setView('landing');
  };
  
  const handleNavigateToMaintenance = () => {
    setView('maintenance');
  };
  
  const handleNavigateToDashboard = () => {
    setView('dashboard');
  };
  
  if (!user) {
    return <LoginPage onLoginSuccess={handleLogin} />;
  }
  
  const renderContent = () => {
    switch(view) {
      case 'landing':
        return <LandingPage onSelectCompany={handleSelectCompany} />;
      case 'dashboard':
        if (selectedCompany) {
          return <Dashboard 
                    user={user} 
                    company={selectedCompany} 
                    onBack={handleBackToHome} 
                    onNavigateToMaintenance={handleNavigateToMaintenance} 
                    onLogout={handleLogout}
                 />;
        }
        return <LandingPage onSelectCompany={handleSelectCompany} />; // Fallback
      case 'maintenance':
        if (selectedCompany) {
          return <MaintenancePage company={selectedCompany} onBack={handleNavigateToDashboard} />;
        }
        return <LandingPage onSelectCompany={handleSelectCompany} />; // Fallback
      default:
        return <LandingPage onSelectCompany={handleSelectCompany} />;
    }
  }

  return (
    <div className="min-h-screen">
      {renderContent()}
    </div>
  );
};

export default App;
