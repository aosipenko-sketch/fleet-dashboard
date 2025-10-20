import React from 'react';
import { Company, Vehicle, Driver, MaintenanceTask, WidgetType, GmailMessage, CalendarEvent } from './types';

export const COMPANIES = [
  { id: Company.NORDIK, name: 'Nordik Windows Inc' },
  { id: Company.NWGTA, name: 'NWGTA' },
  { id: Company.VERDUN, name: 'Verdun' },
  { id: Company.LIPTON, name: 'Lipton' },
];

const generateMockData = (
  companyName: string,
  vehicleCount: number
): { vehicles: Vehicle[], drivers: Driver[], maintenance: MaintenanceTask[] } => {
  const vehicles: Vehicle[] = [];
  const drivers: Driver[] = [];
  const maintenance: MaintenanceTask[] = [];

  const firstNames = ['John', 'Jane', 'Alex', 'Emily', 'Chris', 'Katie'];
  const lastNames = ['Smith', 'Doe', 'Johnson', 'Williams', 'Brown', 'Davis'];
  const vehicleModels = ['Ford Transit', 'Mercedes Sprinter', 'Dodge Ram ProMaster', 'Chevy Express'];
  const maintenanceTasks = ['Oil Change', 'Tire Rotation', 'Brake Inspection', 'Engine Check'];

  for (let i = 1; i <= vehicleCount; i++) {
    const driverName = `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`;
    drivers.push({
      id: `${companyName}-D${i}`,
      name: driverName,
      vehicleId: `${companyName}-V${i}`,
      status: i % 3 === 0 ? 'Off-Duty' : 'On-Duty',
      phone: `555-01${String(i).padStart(2, '0')}`
    });

    vehicles.push({
      id: `${companyName}-V${i}`,
      name: `Unit ${i}`,
      driver: driverName,
      status: i % 5 === 0 ? 'In-Shop' : (i % 2 === 0 ? 'Active' : 'Idle'),
      location: { lat: 45.4215 + (Math.random() - 0.5) * 0.2, lng: -75.6972 + (Math.random() - 0.5) * 0.3 },
      model: vehicleModels[i % vehicleModels.length],
      licensePlate: `AB${String(i).padStart(2, '0')}CD`,
      vin: `VIN${companyName.substring(0,2).toUpperCase()}${String(i).padStart(4, '0')}`
    });
    
    // Upcoming / Overdue Tasks
    if (i % 4 === 0) {
        const dueDate = new Date();
        const days = Math.random() > 0.5 ? Math.floor(Math.random() * 10) : -Math.floor(Math.random() * 5);
        dueDate.setDate(dueDate.getDate() + days);
        maintenance.push({
            id: `${companyName}-M${i}`,
            vehicleId: `${companyName}-V${i}`,
            vehicleName: `Unit ${i}`,
            task: maintenanceTasks[i % maintenanceTasks.length],
            dueDate: dueDate.toISOString().split('T')[0],
            status: days < 0 ? 'Overdue' : 'Upcoming',
            cost: Math.floor(Math.random() * 400) + 75,
            notes: 'Scheduled check. Follow standard procedure.'
        });
    }

    // Completed Tasks
    if (i % 7 === 0) {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() - (Math.floor(Math.random() * 30) + 15)); // 15-45 days ago
        maintenance.push({
            id: `${companyName}-MC${i}`,
            vehicleId: `${companyName}-V${i}`,
            vehicleName: `Unit ${i}`,
            task: maintenanceTasks[(i + 1) % maintenanceTasks.length],
            dueDate: dueDate.toISOString().split('T')[0],
            status: 'Completed',
            cost: Math.floor(Math.random() * 300) + 75,
            notes: 'Completed successfully. No issues found.'
        });
    }
  }

  return { vehicles, drivers, maintenance };
};

export const MOCK_DATA: Record<Company, { vehicles: Vehicle[], drivers: Driver[], maintenance: MaintenanceTask[] }> = {
  [Company.NORDIK]: generateMockData('Nordik', 25),
  [Company.NWGTA]: generateMockData('NWGTA', 15),
  [Company.VERDUN]: generateMockData('Verdun', 35),
  [Company.LIPTON]: generateMockData('Lipton', 10),
};

export const MOCK_GMAIL_DATA: GmailMessage[] = [
    { id: 'gm1', from: 'alerts@fleet.io', subject: 'Maintenance Alert: Unit 12 - Brakes', snippet: 'Brake pad replacement is due in 5 days for Unit 12 (AB12CD). Please schedule service.', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString()},
    { id: 'gm2', from: 'dispatch@fleet.com', subject: 'New Route Assignment - JD04', snippet: 'John Doe, please see your updated route for tomorrow, March 15th. The new manifest is attached.', timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString()},
    { id: 'gm3', from: 'geotab@alerts.com', subject: 'Harsh Braking Event: Unit 08', snippet: 'A harsh braking event was detected for Unit 08 near downtown. Please review the trip details.', timestamp: new Date(Date.now() - 1000 * 60 * 58).toISOString()},
    { id: 'gm4', from: 'HR Department', subject: 'Q2 Driver Training Schedule', snippet: 'The schedule for Q2 mandatory driver safety training is now available. Please sign up for a slot.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString()},
];

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const dayAfter = new Date(today);
dayAfter.setDate(dayAfter.getDate() + 2);

export const MOCK_CALENDAR_DATA: CalendarEvent[] = [
    { id: 'cal1', title: 'Unit 12 - Brake Inspection', start: new Date(today.setHours(14, 0, 0, 0)).toISOString(), end: new Date(today.setHours(15, 0, 0, 0)).toISOString() },
    { id: 'cal2', title: 'Team Safety Meeting', start: new Date(tomorrow.setHours(9, 0, 0, 0)).toISOString(), end: new Date(tomorrow.setHours(10, 0, 0, 0)).toISOString() },
    { id: 'cal3', title: 'Unit 22 - Tire Rotation', start: new Date(tomorrow.setHours(11, 30, 0, 0)).toISOString(), end: new Date(tomorrow.setHours(12, 0, 0, 0)).toISOString() },
    { id: 'cal4', title: 'Management Sync-up', start: new Date(dayAfter.setHours(10, 0, 0, 0)).toISOString(), end: new Date(dayAfter.setHours(10, 30, 0, 0)).toISOString() },
];


export const DEFAULT_WIDGETS: WidgetType[] = [
  WidgetType.METRICS,
  WidgetType.MAINTENANCE,
  WidgetType.CALENDAR,
  WidgetType.GMAIL,
  WidgetType.VEHICLE_MAP,
  WidgetType.VEHICLE_LIST,
  WidgetType.DRIVER_LIST,
];

export const WIDGET_CONFIG: Record<WidgetType, { title: string, gridSpan: string }> = {
    [WidgetType.METRICS]: { title: 'Fleet Overview', gridSpan: 'col-span-12' },
    [WidgetType.MAINTENANCE]: { title: 'Maintenance Due', gridSpan: 'col-span-12 lg:col-span-4' },
    [WidgetType.VEHICLE_MAP]: { title: 'Live Vehicle Map', gridSpan: 'col-span-12 lg:col-span-8' },
    [WidgetType.VEHICLE_LIST]: { title: 'Vehicle Directory', gridSpan: 'col-span-12 md:col-span-6' },
    [WidgetType.DRIVER_LIST]: { title: 'Driver Directory', gridSpan: 'col-span-12 md:col-span-6' },
    [WidgetType.GMAIL]: { title: 'Gmail Inbox', gridSpan: 'col-span-12 lg:col-span-4' },
    [WidgetType.CALENDAR]: { title: 'Google Calendar', gridSpan: 'col-span-12 lg:col-span-4' },
};


// ICONS
export const DragHandleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 cursor-grab text-gray-500"><circle cx="9" cy="12" r="1"></circle><circle cx="9" cy="5" r="1"></circle><circle cx="9" cy="19" r="1"></circle><circle cx="15" cy="12" r="1"></circle><circle cx="15" cy="5" r="1"></circle><circle cx="15" cy="19" r="1"></circle></svg>
);
export const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

export const GmailIcon = () => (
    <svg className="h-6 w-6 text-indigo-300" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M22 5.889V18C22 19.104 21.104 20 20 20H4C2.896 20 2 19.104 2 18V5.889L11.438 12.645C11.789 12.891 12.211 12.891 12.562 12.645L22 5.889Z" /><path d="M12.281 11.45L21.8 5.213C21.586 4.474 20.856 4 20 4H4C3.144 4 2.414 4.474 2.2 5.213L11.719 11.45C11.894 11.565 12.106 11.565 12.281 11.45Z" /></svg>
);
export const CalendarIcon = () => (
    <svg className="h-6 w-6 text-indigo-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
);

export const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M44.5 24.3H42V24H24V29H35.2C34.2 32.5 31.3 35.4 27.5 36.7V41.3H33.8C39.1 36.6 42.4 30.1 42.4 22.8C42.4 21.6 42.3 20.5 42.1 19.4H44.5V24.3Z" fill="#4285F4"/>
        <path d="M24 48C30.9 48 36.8 45.6 41.3 41.3L33.8 36.7C31.5 38.3 28.5 39.3 24 39.3C17.3 39.3 11.8 35 9.8 29.2L2.1 34.1C6.5 42.7 14.6 48 24 48Z" fill="#34A853"/>
        <path d="M9.8 18.8C9.3 17.3 9 15.7 9 14C9 12.3 9.3 10.7 9.8 9.2L2.1 4.3C0.7 7.3 0 10.5 0 14C0 17.5 0.7 20.7 2.1 23.7L9.8 18.8Z" fill="#FBBC05"/>
        <path d="M24 8.7C27.4 8.7 30.2 9.8 32.4 11.9L40.4 4.4C36.8 0.9 30.9 0 24 0C14.6 0 6.5 5.3 2.1 13.9L9.8 18.8C11.8 13 17.3 8.7 24 8.7Z" fill="#EA4335"/>
    </svg>
);