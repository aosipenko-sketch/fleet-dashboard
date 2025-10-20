import React, { useState, useEffect } from 'react';
import { Company, MaintenanceTask, Vehicle } from '../types';
import { MOCK_DATA } from '../constants';

interface MaintenancePageProps {
  company: Company;
  onBack: () => void;
}

const statusStyles: Record<MaintenanceTask['status'], { text: string; bg: string; border: string }> = {
  Overdue: { text: 'text-red-300', bg: 'bg-red-500/10', border: 'border-red-500/30' },
  Upcoming: { text: 'text-yellow-300', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
  Completed: { text: 'text-green-300', bg: 'bg-green-500/10', border: 'border-green-500/30' },
};

const MaintenanceModal: React.FC<{
    task: Partial<MaintenanceTask> | null;
    vehicles: Vehicle[];
    onClose: () => void;
    onSave: (task: MaintenanceTask) => void;
}> = ({ task, vehicles, onClose, onSave }) => {
    const [formData, setFormData] = useState<Partial<MaintenanceTask>>({});

    useEffect(() => {
        setFormData(task ? { ...task } : { status: 'Upcoming', dueDate: new Date().toISOString().split('T')[0] });
    }, [task]);

    if (!task) return null;
    
    const isNew = !formData.id;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const vehicle = vehicles.find(v => v.id === formData.vehicleId);
        onSave({
            ...formData,
            id: formData.id || `M-${Date.now()}`,
            vehicleName: vehicle?.name || 'Unknown',
        } as MaintenanceTask);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl w-full max-w-2xl">
                <form onSubmit={handleSubmit}>
                    <header className="p-4 border-b border-gray-700">
                        <h2 className="text-xl font-bold text-white">{isNew ? 'Add New Maintenance Task' : `Edit: ${formData.task}`}</h2>
                    </header>
                    <main className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Vehicle</label>
                                <select value={formData.vehicleId || ''} onChange={e => setFormData({...formData, vehicleId: e.target.value})} className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required>
                                    <option value="" disabled>Select a vehicle</option>
                                    {vehicles.map(v => <option key={v.id} value={v.id}>{v.name} - {v.licensePlate}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Task</label>
                                <input type="text" value={formData.task || ''} onChange={e => setFormData({...formData, task: e.target.value})} className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md" required />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Due Date</label>
                                <input type="date" value={formData.dueDate || ''} onChange={e => setFormData({...formData, dueDate: e.target.value})} className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                                <select value={formData.status || ''} onChange={e => setFormData({...formData, status: e.target.value as MaintenanceTask['status']})} className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md" required>
                                    <option>Upcoming</option>
                                    <option>Overdue</option>
                                    <option>Completed</option>
                                </select>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Cost ($)</label>
                                <input type="number" step="0.01" value={formData.cost || ''} onChange={e => setFormData({...formData, cost: parseFloat(e.target.value) || undefined})} placeholder="e.g. 150.50" className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md" />
                            </div>
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-gray-300 mb-1">Notes</label>
                           <textarea value={formData.notes || ''} onChange={e => setFormData({...formData, notes: e.target.value})} rows={4} className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md" />
                        </div>
                    </main>
                    <footer className="p-4 flex justify-end space-x-3 bg-gray-800/50 border-t border-gray-700">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-300 bg-gray-600 hover:bg-gray-500 rounded-md transition">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition">Save Task</button>
                    </footer>
                </form>
            </div>
        </div>
    );
};

const MaintenancePage: React.FC<MaintenancePageProps> = ({ company, onBack }) => {
    const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [editingTask, setEditingTask] = useState<Partial<MaintenanceTask> | null>(null);

    useEffect(() => {
        // Simulating API call
        const companyData = MOCK_DATA[company];
        setTasks(companyData.maintenance);
        setVehicles(companyData.vehicles);
    }, [company]);
    
    const handleSaveTask = (taskToSave: MaintenanceTask) => {
        if (tasks.find(t => t.id === taskToSave.id)) {
            // Update existing
            setTasks(tasks.map(t => t.id === taskToSave.id ? taskToSave : t));
        } else {
            // Add new
            setTasks([taskToSave, ...tasks]);
        }
        setEditingTask(null);
    };
    
    const renderTaskList = (status: MaintenanceTask['status']) => {
        const filteredTasks = tasks.filter(t => t.status === status).sort((a,b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
        if (filteredTasks.length === 0) return <p className="text-gray-500 p-4">No {status.toLowerCase()} tasks.</p>;

        return (
            <ul className="space-y-3">
                {filteredTasks.map(task => (
                    <li key={task.id} className={`p-3 rounded-md border ${statusStyles[task.status].bg} ${statusStyles[task.status].border}`}>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-semibold text-white text-lg">{task.task}</p>
                                <p className="text-sm text-gray-300">{task.vehicleName} &bull; {task.dueDate}</p>
                            </div>
                            <div className="text-right flex-shrink-0 ml-4">
                               <button onClick={() => setEditingTask(task)} className="px-3 py-1 text-xs font-semibold text-indigo-200 bg-indigo-500/30 hover:bg-indigo-500/50 rounded-md transition">Edit</button>
                            </div>
                        </div>
                        { (task.notes || task.cost) && 
                            <div className="mt-2 pt-2 border-t border-white/10 text-sm">
                                {task.cost && <p className="text-gray-300">Cost: <span className="font-medium text-white">${task.cost.toFixed(2)}</span></p>}
                                {task.notes && <p className="text-gray-400 mt-1">Notes: <span className="text-gray-300">{task.notes}</span></p>}
                            </div>
                        }
                    </li>
                ))}
            </ul>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <header className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <div>
                    <button onClick={onBack} className="text-sm text-indigo-400 hover:text-indigo-300 mb-1">&larr; Back to Dashboard</button>
                    <h1 className="text-3xl font-bold text-white">Maintenance Management</h1>
                    <p className="text-gray-400">Viewing records for {company}</p>
                </div>
                <button onClick={() => setEditingTask({})} className="px-5 py-2.5 font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors duration-200 shadow-lg">
                    Add New Task
                </button>
            </header>
            
            <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <section>
                    <h2 className="text-xl font-semibold text-red-300 mb-3">Overdue</h2>
                    <div className="bg-gray-800/50 p-4 rounded-lg max-h-[60vh] overflow-y-auto">{renderTaskList('Overdue')}</div>
                </section>
                 <section>
                    <h2 className="text-xl font-semibold text-yellow-300 mb-3">Upcoming</h2>
                    <div className="bg-gray-800/50 p-4 rounded-lg max-h-[60vh] overflow-y-auto">{renderTaskList('Upcoming')}</div>
                </section>
                 <section>
                    <h2 className="text-xl font-semibold text-green-300 mb-3">Completed</h2>
                    <div className="bg-gray-800/50 p-4 rounded-lg max-h-[60vh] overflow-y-auto">{renderTaskList('Completed')}</div>
                </section>
            </main>

            {editingTask && <MaintenanceModal task={editingTask} vehicles={vehicles} onClose={() => setEditingTask(null)} onSave={handleSaveTask} />}
        </div>
    );
};

export default MaintenancePage;
