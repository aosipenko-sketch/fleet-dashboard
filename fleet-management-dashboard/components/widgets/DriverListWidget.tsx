import React, { useState, useMemo, useEffect } from 'react';
import { Driver } from '../../types';

const statusColors: Record<Driver['status'], string> = {
  'On-Duty': 'bg-green-500',
  'Off-Duty': 'bg-gray-500',
};

const DriverListWidget: React.FC<{ drivers: Driver[] }> = ({ drivers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [localDrivers, setLocalDrivers] = useState<Driver[]>(drivers);
  const [expandedDriverId, setExpandedDriverId] = useState<string | null>(null);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

  useEffect(() => {
    setLocalDrivers(drivers);
  }, [drivers]);

  const filteredDrivers = useMemo(() => {
    return localDrivers.filter(d =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.phone.includes(searchTerm)
    );
  }, [localDrivers, searchTerm]);

  const handleToggleExpand = (driverId: string) => {
    if (editingDriver && editingDriver.id === driverId) return; // Don't collapse if editing
    setExpandedDriverId(prevId => (prevId === driverId ? null : driverId));
    setEditingDriver(null); // Close any open editor
  };

  const handleSave = () => {
    if (!editingDriver) return;
    setLocalDrivers(prev => prev.map(d => d.id === editingDriver.id ? editingDriver : d));
    setEditingDriver(null);
  };

  return (
    <div className="flex flex-col h-full">
      <input
        type="text"
        placeholder="Search by name or phone..."
        className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="flex-grow overflow-y-auto" style={{ maxHeight: '400px' }}>
        <table className="w-full text-left">
          <thead className="sticky top-0 bg-gray-800 z-10">
            <tr>
              <th className="p-2 text-sm font-semibold text-gray-400">Name</th>
              <th className="p-2 text-sm font-semibold text-gray-400">Phone</th>
              <th className="p-2 text-sm font-semibold text-gray-400">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredDrivers.map((driver) => (
              <React.Fragment key={driver.id}>
                <tr onClick={() => handleToggleExpand(driver.id)} className="border-b border-gray-700 hover:bg-gray-700/50 cursor-pointer">
                  <td className="p-2 font-medium text-white">{driver.name}</td>
                  <td className="p-2 text-gray-300">{driver.phone}</td>
                  <td className="p-2">
                    <span className="flex items-center">
                      <span className={`w-3 h-3 rounded-full mr-2 ${statusColors[driver.status]}`}></span>
                      {driver.status}
                    </span>
                  </td>
                </tr>
                {expandedDriverId === driver.id && (
                  <tr className="border-b border-gray-600 bg-gray-900/30">
                    <td colSpan={3} className="p-4">
                      {editingDriver?.id === driver.id ? (
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-white">Editing {driver.name}</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor={`d-name-${driver.id}`} className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                                    <input id={`d-name-${driver.id}`} type="text" value={editingDriver.name} onChange={(e) => setEditingDriver({...editingDriver, name: e.target.value})} className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                                </div>
                                <div>
                                    <label htmlFor={`d-phone-${driver.id}`} className="block text-sm font-medium text-gray-400 mb-1">Phone</label>
                                    <input id={`d-phone-${driver.id}`} type="text" value={editingDriver.phone} onChange={(e) => setEditingDriver({...editingDriver, phone: e.target.value})} className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                                </div>
                                <div>
                                    <label htmlFor={`d-status-${driver.id}`} className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                                    <select id={`d-status-${driver.id}`} value={editingDriver.status} onChange={(e) => setEditingDriver({...editingDriver, status: e.target.value as Driver['status']})} className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                        <option>On-Duty</option>
                                        <option>Off-Duty</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button onClick={() => setEditingDriver(null)} className="px-4 py-2 text-sm font-semibold text-gray-300 bg-gray-600 hover:bg-gray-500 rounded-md transition">Cancel</button>
                                <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition">Save Changes</button>
                            </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                            <div>
                                <p className="text-sm text-gray-400">Assigned Vehicle</p>
                                <p className="font-medium text-white">{driver.vehicleId || 'N/A'}</p>
                            </div>
                            <div className="md:col-span-2 flex justify-start md:justify-end">
                                <button onClick={() => setEditingDriver({...driver})} className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600/50 hover:bg-indigo-600 rounded-md transition">Edit Driver</button>
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

export default DriverListWidget;