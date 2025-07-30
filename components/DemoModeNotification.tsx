import React from 'react';
import { CloudSlashIcon, CogIcon } from './IconComponents';

interface DemoModeNotificationProps {
    onGoToSettings: () => void;
}

const DemoModeNotification: React.FC<DemoModeNotificationProps> = ({ onGoToSettings }) => {
    return (
        <div 
            className="bg-yellow-100 dark:bg-yellow-900/50 border-l-4 border-yellow-500 text-yellow-800 dark:text-yellow-300 p-4 rounded-r-lg mb-6 flex items-center justify-between shadow-md" 
            role="alert"
        >
            <div className="flex items-center">
                <CloudSlashIcon className="h-6 w-6 mr-3 text-yellow-600 dark:text-yellow-400" />
                <div>
                    <p className="font-bold">Demo Mode Active</p>
                    <p className="text-sm">API quota limit reached. You are viewing sample data.</p>
                </div>
            </div>
            <button
                onClick={onGoToSettings}
                className="ml-4 flex items-center gap-2 bg-yellow-200/50 dark:bg-yellow-500/20 hover:bg-yellow-200 dark:hover:bg-yellow-500/30 text-yellow-800 dark:text-yellow-200 font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
            >
                <CogIcon className="h-4 w-4" />
                Settings
            </button>
        </div>
    );
};

export default DemoModeNotification;
