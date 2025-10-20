import { useState, useEffect } from 'react';
import { Company, Vehicle, Driver, MaintenanceTask } from '../types';
import { MOCK_DATA } from '../constants';

interface AppData {
  vehicles: Vehicle[];
  drivers: Driver[];
  maintenance: MaintenanceTask[];
}

// Securely get credentials from Vite's environment variables
const credentials = {
  fleetioApiKey: import.meta.env.VITE_FLEETIO_API_KEY,
  fleetioAccountToken: import.meta.env.VITE_FLEETIO_ACCOUNT_TOKEN,
  geotabUser: import.meta.env.VITE_GEOTAB_USER,
  geotabPassword: import.meta.env.VITE_GEOTAB_PASSWORD,
  geotabDatabase: import.meta.env.VITE_GEOTAB_DATABASE,
};


// --- API Helper Functions ---

async function fetchFleetioData(apiKey: string, accountToken: string, vehicles: Vehicle[]): Promise<MaintenanceTask[]> {
  console.log("Attempting to fetch data from Fleetio...");
  const FLEETIO_API_URL = 'https://cors-anywhere.herokuapp.com/https://secure.fleetio.com/api/v1/issues';

  const response = await fetch(`${FLEETIO_API_URL}?status=open`, {
    method: 'GET',
    headers: {
      'Authorization': `Token token=${apiKey}`,
      'Account-Token': accountToken,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Fleetio API error (${response.status}): ${await response.text()}`);
  }

  const data = await response.json();
  const vinToVehicleIdMap = new Map(vehicles.map(v => [v.vin, v.id]));

  return data.map((item: any): MaintenanceTask | null => {
    const vehicleVin = item.vehicle?.vin;
    const internalVehicleId = vinToVehicleIdMap.get(vehicleVin);
    if (!internalVehicleId) return null;

    let status: MaintenanceTask['status'] = 'Upcoming';
    if (item.due_date && new Date(item.due_date) < new Date()) {
      status = 'Overdue';
    }

    return {
      id: `fleetio-${item.id}`,
      vehicleId: internalVehicleId,
      vehicleName: item.vehicle_name,
      task: item.summary,
      dueDate: item.due_date || new Date().toISOString().split('T')[0],
      status: status,
      cost: item.estimated_cost_in_cents ? item.estimated_cost_in_cents / 100 : undefined,
      notes: item.description,
    };
  }).filter((task): task is MaintenanceTask => task !== null);
}

async function fetchGeotabData(user: string, password: string, database: string): Promise<Partial<Vehicle>[]> {
    console.log("Attempting to fetch data from Geotab...");
    const GEOTAB_API_URL = 'https://my.geotab.com/api/v1';

    const response = await fetch(GEOTAB_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            method: 'Get',
            params: {
                typeName: 'DeviceStatusInfo',
                credentials: {
                    database: database,
                    userName: user,
                    password: password,
                },
            },
        }),
    });

    if (!response.ok) {
        throw new Error(`Geotab API error (${response.status}): ${await response.text()}`);
    }
    
    const responseData = await response.json();
    if (responseData.error) {
      throw new Error(`Geotab API error: ${responseData.error.message}`);
    }
    const data = responseData.result;

    return data.map((deviceStatus: any): Partial<Vehicle> => ({
        vin: deviceStatus.device?.vin,
        location: {
            lat: deviceStatus.latitude,
            lng: deviceStatus.longitude,
        },
        status: deviceStatus.isDriving ? 'Active' : 'Idle',
    }));
}

export const useMockData = (company: Company) => {
  const [data, setData] = useState<AppData>({ vehicles: [], drivers: [], maintenance: [] });
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setApiError(null);
      let errorMessages: string[] = [];
      
      const baseData = { ...MOCK_DATA[company] };

      if (credentials.fleetioApiKey && credentials.fleetioAccountToken) {
        try {
          const fleetioTasks = await fetchFleetioData(credentials.fleetioApiKey, credentials.fleetioAccountToken, baseData.vehicles);
          console.log(`Successfully fetched ${fleetioTasks.length} open issues from Fleetio.`);
          baseData.maintenance = fleetioTasks;
        } catch (error) {
          console.error("Fleetio API call failed:", error);
          errorMessages.push("Failed to fetch from Fleetio.");
        }
      }

      if (credentials.geotabUser && credentials.geotabPassword && credentials.geotabDatabase) {
        try {
            const geotabUpdates = await fetchGeotabData(credentials.geotabUser, credentials.geotabPassword, credentials.geotabDatabase);
            const updatesByVin = new Map(geotabUpdates.map(u => [u.vin, u]));
            
            baseData.vehicles = baseData.vehicles.map(vehicle => {
                const update = updatesByVin.get(vehicle.vin);
                if (update) {
                    return { ...vehicle, ...update };
                }
                return vehicle;
            });
            console.log(`Successfully merged location data for ${updatesByVin.size} vehicles from Geotab.`);
        } catch (error) {
             console.error("Geotab API call failed:", error);
             errorMessages.push("Failed to fetch from Geotab.");
        }
      }

      if (errorMessages.length > 0) {
        setApiError(`${errorMessages.join(' ')} Using fallback data.`);
      }

      setData(baseData);
      setLoading(false);
    };

    if (company) {
        loadData();
    }

  }, [company]);

  return { ...data, loading, apiError };
};
