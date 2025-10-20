import React from 'react';
import { Vehicle, Driver, MaintenanceTask } from '../../types';

interface MetricsWidgetProps {
  vehicles: Vehicle[];
  drivers: Driver[];
  maintenance: MaintenanceTask[];
}

const MetricCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div className="bg-gray-700/50 p-4 rounded-lg flex items-center space-x-4">
    <div className="bg-indigo-500/20 p-3 rounded-full">{icon}</div>
    <div>
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </div>
);

const MetricsWidget: React.FC<MetricsWidgetProps> = ({ vehicles, drivers, maintenance }) => {
  const totalVehicles = vehicles.length;
  const totalDrivers = drivers.length;
  const maintenanceDue = maintenance.filter(m => m.status === 'Overdue' || m.status === 'Upcoming').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <MetricCard title="Total Vehicles" value={totalVehicles} icon={<CarIcon />} />
      <MetricCard title="Total Drivers" value={totalDrivers} icon={<UserGroupIcon />} />
      <MetricCard title="Maintenance Alerts" value={maintenanceDue} icon={<WrenchIcon />} />
    </div>
  );
};

// SVG Icons
const CarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17H6.5A2.5 2.5 0 014 14.5V11a2.5 2.5 0 012.5-2.5h11A2.5 2.5 0 0120 11v3.5a2.5 2.5 0 01-2.5 2.5H13" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8.5V6a1 1 0 011-1h8a1 1 0 011 1v2.5" /></svg>;
const UserGroupIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.224-1.26-.62-1.751M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.224-1.26.62-1.751m0 0A5.002 5.002 0 0112 13a5.002 5.002 0 014.38 2.249M12 13a5 5 0 100-10 5 5 0 000 10zm-7 7a3 3 0 013-3h8a3 3 0 013 3z" /></svg>;
const WrenchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;

export default MetricsWidget;
