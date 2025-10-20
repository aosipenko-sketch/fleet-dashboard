import React, { useState, useRef, useCallback } from 'react';
import { Company, WidgetType, User } from '../types';
import { useMockData } from '../hooks/useMockData';
import WidgetWrapper from './WidgetWrapper';
import MetricsWidget from './widgets/MetricsWidget';
import VehicleListWidget from './widgets/VehicleListWidget';
import DriverListWidget from './widgets/DriverListWidget';
import MaintenanceWidget from './widgets/MaintenanceWidget';
import VehicleMapWidget from './widgets/VehicleMapWidget';
import GmailWidget from './widgets/GmailWidget';
import CalendarWidget from './widgets/CalendarWidget';
import { DEFAULT_WIDGETS, WIDGET_CONFIG } from '../constants';

interface DashboardProps {
  company: Company;
  user: User;
  onBack: () => void;
  onNavigateToMaintenance: () => void;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ company, user, onBack, onNavigateToMaintenance, onLogout }) => {
  const { vehicles, drivers, maintenance, loading, apiError } = useMockData(company);
  const [isEditMode, setIsEditMode] = useState(false);
  const [widgets, setWidgets] = useState<WidgetType[]>(DEFAULT_WIDGETS);
  const [showApiError, setShowApiError] = useState(true);
  
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };

  const handleDrop = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    const newWidgets = [...widgets];
    const draggedItemContent = newWidgets.splice(dragItem.current, 1)[0];
    newWidgets.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setWidgets(newWidgets);
  };
  
  const handleRemoveWidget = useCallback((widgetToRemove: WidgetType) => {
    setWidgets(prev => prev.filter(w => w !== widgetToRemove));
  }, []);
  
  const renderWidget = (widgetType: WidgetType) => {
    switch (widgetType) {
      case WidgetType.METRICS:
        return <MetricsWidget vehicles={vehicles} drivers={drivers} maintenance={maintenance} />;
      case WidgetType.VEHICLE_LIST:
        return <VehicleListWidget vehicles={vehicles} />;
      case WidgetType.DRIVER_LIST:
        return <DriverListWidget drivers={drivers} />;
      case WidgetType.MAINTENANCE:
        return <MaintenanceWidget tasks={maintenance} vehicles={vehicles} onManageClick={onNavigateToMaintenance} />;
      case WidgetType.VEHICLE_MAP:
        return <VehicleMapWidget vehicles={vehicles} />;
      case WidgetType.GMAIL:
        return <GmailWidget />;
      case WidgetType.CALENDAR:
        return <CalendarWidget />;
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-2xl">Loading Dashboard...</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div>
          <button onClick={onBack} className="text-sm text-indigo-400 hover:text-indigo-300 mb-1">&larr; Change Company</button>
          <h1 className="text-3xl font-bold text-white">{company} Dashboard</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">Edit Dashboard</span>
            <label htmlFor="edit-toggle" className="flex items-center cursor-pointer">
              <div className="relative">
                <input type="checkbox" id="edit-toggle" className="sr-only" checked={isEditMode} onChange={() => setIsEditMode(!isEditMode)} />
                <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isEditMode ? 'transform translate-x-full bg-indigo-400' : ''}`}></div>
              </div>
            </label>
          </div>
          <div className="w-px h-8 bg-gray-600"></div>
          <div className="flex items-center space-x-3">
            <div className="text-right">
                <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
            <img src={user.avatarUrl} alt="User Avatar" className="w-10 h-10 rounded-full border-2 border-gray-600"/>
            <button onClick={onLogout} className="px-4 py-2 text-sm font-semibold rounded-md transition bg-red-500/20 text-red-300 hover:bg-red-500/30">
                Logout
            </button>
          </div>
        </div>
      </header>
      
      {apiError && showApiError && (
        <div className="bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 px-4 py-3 rounded-md relative mb-6" role="alert">
          <strong className="font-bold">API Warning: </strong>
          <span className="block sm:inline">{apiError}</span>
          <button onClick={() => setShowApiError(false)} className="absolute top-0 bottom-0 right-0 px-4 py-3">
            <svg className="fill-current h-6 w-6 text-yellow-400" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
          </button>
        </div>
      )}
      
      <main className="grid grid-cols-12 gap-6" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
        {widgets.map((widgetType, index) => (
          <div
            key={widgetType}
            className={`${WIDGET_CONFIG[widgetType].gridSpan} ${isEditMode ? 'animate-pulse-slow' : ''}`}
            draggable={isEditMode}
            onDragStart={() => handleDragStart(index)}
            onDragEnter={() => handleDragEnter(index)}
            onDragEnd={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <WidgetWrapper
              title={WIDGET_CONFIG[widgetType].title}
              isEditMode={isEditMode}
              onRemove={() => handleRemoveWidget(widgetType)}
            >
              {renderWidget(widgetType)}
            </WidgetWrapper>
          </div>
        ))}
      </main>
    </div>
  );
};

export default Dashboard;
