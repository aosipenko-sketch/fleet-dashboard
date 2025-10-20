import React, { useState } from 'react';
import { MaintenanceTask, Vehicle } from '../../types';

const statusStyles: Record<MaintenanceTask['status'], { text: string; bg: string }> = {
  Overdue: { text: 'text-red-300', bg: 'bg-red-500/20' },
  Upcoming: { text: 'text-yellow-300', bg: 'bg-yellow-500/20' },
  Completed: { text: 'text-green-300', bg: 'bg-green-500/20' },
};

interface MaintenanceWidgetProps {
  tasks: MaintenanceTask[];
  vehicles: Vehicle[];
  onManageClick: () => void;
}

const MaintenanceWidget: React.FC<MaintenanceWidgetProps> = ({ tasks, vehicles, onManageClick }) => {
    const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

    const dueTasks = tasks
        .filter(task => task.status === 'Upcoming' || task.status === 'Overdue')
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    const handleToggleExpand = (taskId: string) => {
        setExpandedTaskId(prevId => (prevId === taskId ? null : taskId));
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow overflow-y-auto pr-2" style={{ maxHeight: '350px' }}>
                {dueTasks.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        No maintenance due.
                    </div>
                ) : (
                    <ul className="space-y-3">
                        {dueTasks.map(task => {
                            const vehicle = vehicles.find(v => v.id === task.vehicleId);
                            return (
                                <li key={task.id} className={`rounded-md transition-all duration-300 ${statusStyles[task.status].bg}`}>
                                    <div 
                                        onClick={() => handleToggleExpand(task.id)}
                                        className="p-3 flex justify-between items-center cursor-pointer hover:bg-white/10"
                                    >
                                        <div>
                                            <p className="font-semibold text-white">{task.task}</p>
                                            <p className="text-sm text-gray-300">{task.vehicleName}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-medium ${statusStyles[task.status].text}`}>{task.status}</p>
                                            <p className="text-sm text-gray-400">{task.dueDate}</p>
                                        </div>
                                    </div>
                                    {expandedTaskId === task.id && (
                                        <div className="border-t border-white/10 p-3 mx-3 mb-3 text-sm">
                                            <div className="grid grid-cols-2 gap-2">
                                                <p className="text-gray-400">Model:</p>
                                                <p className="text-white font-medium">{vehicle?.model || 'N/A'}</p>
                                                <p className="text-gray-400">Plate:</p>
                                                <p className="text-white font-medium">{vehicle?.licensePlate || 'N/A'}</p>
                                            </div>
                                            {task.notes && (
                                                <div className="mt-2 pt-2 border-t border-white/10">
                                                    <p className="text-gray-400">Notes:</p>
                                                    <p className="text-gray-300 whitespace-pre-wrap">{task.notes}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-700">
                <button 
                    onClick={onManageClick}
                    className="w-full text-center px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                    Manage All Maintenance
                </button>
            </div>
        </div>
    );
};

export default MaintenanceWidget;
