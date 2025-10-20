import React from 'react';
import { MOCK_GMAIL_DATA } from '../../constants';
import { GmailMessage } from '../../types';

const timeSince = (date: string): string => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
}

const GmailWidget: React.FC = () => {
    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow overflow-y-auto pr-2" style={{ maxHeight: '350px' }}>
                <ul className="space-y-3">
                    {MOCK_GMAIL_DATA.map((email: GmailMessage) => (
                        <li key={email.id} className="p-3 bg-gray-700/50 rounded-md border border-gray-700/80 hover:bg-gray-700/80 transition-colors">
                            <div className="flex justify-between items-start">
                                <p className="font-semibold text-white truncate text-sm">{email.from}</p>
                                <p className="text-xs text-gray-400 flex-shrink-0 ml-2">{timeSince(email.timestamp)}</p>
                            </div>
                            <p className="text-gray-300 text-sm truncate mt-1">{email.subject}</p>
                            <p className="text-xs text-gray-500 mt-1">{email.snippet}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default GmailWidget;