// Fix: Add Vite client types reference to fix import.meta.env errors.
/// <reference types="vite/client" />

// Fix: Declare google as a global variable to be used by Google Maps components.
declare var google: any;

// Fix: Moved Company enum here to break circular dependency with constants.tsx
export enum Company {
  NORDIK = 'Nordik',
  NWGTA = 'NWGTA',
  VERDUN = 'Verdun',
  LIPTON = 'Lipton',
}

export interface User {
  name: string;
  email: string;
  avatarUrl: string;
}

export interface ApiCredentials {
  fleetioApiKey: string;
  fleetioAccountToken: string;
  geotabUser: string;
  geotabPassword: string;
  geotabDatabase: string;
  googleMapsApiKey: string;
}

export interface Vehicle {
  id: string;
  name: string;
  driver: string | null;
  status: 'Active' | 'In-Shop' | 'Idle';
  location: {
    lat: number;
    lng: number;
  };
  model: string;
  licensePlate: string;
  vin: string;
}

export interface Driver {
  id: string;
  name: string;
  vehicleId: string | null;
  status: 'On-Duty' | 'Off-Duty';
  phone: string;
}

export interface MaintenanceTask {
  id: string;
  vehicleId: string; // This should correspond to our internal vehicle ID
  vehicleName: string;
  task: string;
  dueDate: string;
  status: 'Overdue' | 'Upcoming' | 'Completed';
  cost?: number;
  notes?: string;
}

export interface GmailMessage {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  timestamp: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
}

export enum WidgetType {
  METRICS = 'METRICS',
  VEHICLE_LIST = 'VEHICLE_LIST',
  DRIVER_LIST = 'DRIVER_LIST',
  MAINTENANCE = 'MAINTENANCE',
  VEHICLE_MAP = 'VEHICLE_MAP',
  GMAIL = 'GMAIL',
  CALENDAR = 'CALENDAR',
}