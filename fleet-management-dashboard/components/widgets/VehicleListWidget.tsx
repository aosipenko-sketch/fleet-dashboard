import React, { useState, useMemo, useEffect } from 'react';
import { Vehicle } from '../../types';

const statusColors: Record<Vehicle['status'], string> = {
  Active: 'bg-green-500',
  'In-Shop': 'bg-yellow-500',
  Idle: 'bg-gray-500',
};

const VehicleListWidget: React.FC<{ vehicles: Vehicle[] }> = ({ vehicles }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [localVehicles, setLocalVehicles] = useState<Vehicle[]>(vehicles);
  const [expandedVehicleId, setExpandedVehicleId] = useState<string | null>(null);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    setLocalVehicles(vehicles);
  }, [vehicles]);

  const filteredVehicles = useMemo(() => {
    return localVehicles.filter(v =>
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.driver?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.licensePlate.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [localVehicles, searchTerm]);
  
  const handleToggleExpand = (vehicleId: string) => {
    if (editingVehicle && editingVehicle.id === vehicleId) return; // Don't collapse if editing
    setExpandedVehicleId(prevId => (prevId === vehicleId ? null : vehicleId));
    setEditingVehicle(null); // Close any open editor
  };

  const handleSave = () => {
    if (!editingVehicle) return;
    setLocalVehicles(prev => prev.map(v => v.id === editingVehicle.id ? editingVehicle : v));
    setEditingVehicle(null);
  };
  
  return (
    <div className="flex flex-col h-full">
      <input
        type="text"
        placeholder="Search by unit, driver, or plate..."
        className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="flex-grow overflow-y-auto" style={{ maxHeight: '400px' }}>
        <table className="w-full text-left">
          <thead className="sticky top-0 bg-gray-800 z-10">
            <tr>
              <th className="p-2 text-sm font-semibold text-gray-400">Unit</th>
              <th className="p-2 text-sm font-semibold text-gray-400">Driver</th>
              <th className="p-2 text-sm font-semibold text-gray-400">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredVehicles.map((vehicle) => (
              <React.Fragment key={vehicle.id}>
                <tr onClick={() => handleToggleExpand(vehicle.id)} className="border-b border-gray-700 hover:bg-gray-700/50 cursor-pointer">
                  <td className="p-2">
                    <div className="font-medium text-white">{vehicle.name}</div>
                    <div className="text-xs text-gray-400">{vehicle.licensePlate}</div>
                  </td>
                  <td className="p-2 text-gray-300">{vehicle.driver || 'Unassigned'}</td>
                  <td className="p-2">
                    <span className="flex items-center">
                      <span className={`w-3 h-3 rounded-full mr-2 ${statusColors[vehicle.status]}`}></span>
                      {vehicle.status}
                    </span>
                  </td>
                </tr>
                {expandedVehicleId === vehicle.id && (
                  <tr className="border-b border-gray-600 bg-gray-900/30">
                    <td colSpan={3} className="p-4">
                      {editingVehicle?.id === vehicle.id ? (
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-white">Editing {vehicle.name}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label htmlFor={`v-name-${vehicle.id}`} className="block text-sm font-medium text-gray-400 mb-1">Unit Name</label>
                              <input id={`v-name-${vehicle.id}`} type="text" value={editingVehicle.name} onChange={(e) => setEditingVehicle({...editingVehicle, name: e.target.value})} className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                            </div>
                            <div>
                                <label htmlFor={`v-driver-${vehicle.id}`} className="block text-sm font-medium text-gray-400 mb-1">Driver</label>
                                <input id={`v-driver-${vehicle.id}`} type="text" value={editingVehicle.driver || ''} onChange={(e) => setEditingVehicle({...editingVehicle, driver: e.target.value})} className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                            </div>
                            <div>
                                <label htmlFor={`v-status-${vehicle.id}`} className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                                <select id={`v-status-${vehicle.id}`} value={editingVehicle.status} onChange={(e) => setEditingVehicle({...editingVehicle, status: e.target.value as Vehicle['status']})} className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                    <option>Active</option>
                                    <option>In-Shop</option>
                                    <option>Idle</option>
                                </select>
                            </div>
                          </div>
                          <div className="flex justify-end space-x-2">
                            <button onClick={() => setEditingVehicle(null)} className="px-4 py-2 text-sm font-semibold text-gray-300 bg-gray-600 hover:bg-gray-500 rounded-md transition">Cancel</button>
                            <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition">Save Changes</button>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                            <div>
                                <p className="text-sm text-gray-400">Model</p>
                                <p className="font-medium text-white">{vehicle.model}</p>
                            </div>
                             <div>
                                <p className="text-sm text-gray-400">License Plate</p>
                                <p className="font-medium text-white">{vehicle.licensePlate}</p>
                            </div>
                            <div className="flex justify-start md:justify-end">
                                <button onClick={() => setEditingVehicle({...vehicle})} className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600/50 hover:bg-indigo-600 rounded-md transition">Edit Vehicle</button>
                            </div>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VehicleListWidget;