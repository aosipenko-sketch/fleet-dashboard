
import React from 'react';
import { DragHandleIcon, CloseIcon } from '../constants';

interface WidgetWrapperProps {
  title: string;
  children: React.ReactNode;
  isEditMode: boolean;
  onRemove: () => void;
}

const WidgetWrapper: React.FC<WidgetWrapperProps> = ({ title, children, isEditMode, onRemove }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg h-full flex flex-col transition-all duration-300">
      <header className="flex items-center justify-between p-4 border-b border-gray-700">
        <h3 className="font-semibold text-lg text-white">{title}</h3>
        {isEditMode && (
          <div className="flex items-center space-x-2">
            <button onClick={onRemove} className="text-gray-400 hover:text-red-400 transition-colors">
              <CloseIcon />
            </button>
            <div className="cursor-grab">
                <DragHandleIcon />
            </div>
          </div>
        )}
      </header>
      <div className="p-4 flex-grow overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default WidgetWrapper;
