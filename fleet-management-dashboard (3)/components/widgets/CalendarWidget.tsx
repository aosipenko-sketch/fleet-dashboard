import React from 'react';
import { MOCK_CALENDAR_DATA } from '../../constants';
import { CalendarEvent } from '../../types';

const formatTime = (date: string) => {
    const d = new Date(date);
    return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true });
}

const CalendarWidget: React.FC = () => {
    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow overflow-y-auto pr-2" style={{ maxHeight: '350px' }}>
                <ul className="space-y-3">
                    {MOCK_CALENDAR_DATA.map((event: CalendarEvent) => (
                        <li key={event.id} className="flex items-start space-x-3 p-3 bg-gray-700/50 rounded-md">
                            <div className="flex-shrink-0 text-center bg-gray-900/50 px-2 py-1 rounded-md border border-gray-700 w-16">
                                <p className="text-sm font-bold text-indigo-300">{new Date(event.start).toLocaleDateString(undefined, { day: 'numeric' })}</p>
                                <p className="text-xs text-gray-400">{new Date(event.start).toLocaleDateString(undefined, { month: 'short' })}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-white text-sm">{event.title}</p>
                                <p className="text-xs text-gray-400">{formatTime(event.start)} - {formatTime(event.end)}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CalendarWidget;