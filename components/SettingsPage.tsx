import React from 'react';
import { Theme, TextModelId } from '../types';
import Card from './ui/Card';
import { ArrowLeftIcon, MoonIcon, SunIcon, ChipIcon } from './IconComponents';
import { AVAILABLE_MODELS } from '../constants';

interface SettingsPageProps {
    theme: Theme;
    onSetTheme: (theme: Theme) => void;
    model: TextModelId;
    onSetModel: (model: TextModelId) => void;
    onGoBack: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ theme, onSetTheme, model, onSetModel, onGoBack }) => {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="mb-6 flex items-center gap-4">
                 <button 
                    onClick={onGoBack}
                    className="p-2 rounded-full hover:bg-secondary transition-colors"
                    aria-label="Go back to dashboard"
                >
                    <ArrowLeftIcon className="h-6 w-6" />
                </button>
                <h1 className="text-3xl font-bold">Settings</h1>
            </div>

            <Card>
                <Card.Header>Appearance</Card.Header>
                <Card.Body>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                        <div>
                            <h4 className="font-semibold text-lg text-foreground">Theme</h4>
                            <p className="text-muted-foreground">Select your preferred interface look.</p>
                        </div>
                        <div className="mt-4 sm:mt-0 flex items-center space-x-2 p-1 bg-secondary rounded-lg">
                            <button
                                onClick={() => onSetTheme('light')}
                                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                    theme === 'light' 
                                        ? 'bg-white text-blue-600 shadow' 
                                        : 'text-muted-foreground hover:bg-background/50'
                                }`}
                            >
                                <SunIcon className="h-5 w-5" />
                                Light
                            </button>
                            <button
                                onClick={() => onSetTheme('dark')}
                                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                    theme === 'dark' 
                                        ? 'bg-background text-primary shadow' 
                                        : 'text-muted-foreground hover:bg-background/50'
                                }`}
                            >
                                <MoonIcon className="h-5 w-5" />
                                Dark
                            </button>
                        </div>
                    </div>
                </Card.Body>
            </Card>

            <Card>
                <Card.Header>AI Model</Card.Header>
                <Card.Body>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                        <div>
                            <h4 className="font-semibold text-lg text-foreground flex items-center gap-2"><ChipIcon className="h-6 w-6 text-primary" /> Model</h4>
                            <p className="text-muted-foreground">Choose the AI model for generating insights.</p>
                        </div>
                        <div className="mt-4 sm:mt-0">
                            <select
                                value={model}
                                onChange={(e) => onSetModel(e.target.value)}
                                className="w-full sm:w-auto bg-input border border-border rounded-lg py-2 pl-3 pr-8 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                aria-label="Select AI model"
                            >
                                {AVAILABLE_MODELS.map(m => (
                                    <option 
                                        key={m.id} 
                                        value={m.id}
                                        disabled={m.isAvailable === false}
                                        className="bg-background text-foreground"
                                    >
                                        {m.name} {m.isAvailable === false ? '(Unavailable)' : ''}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                     {AVAILABLE_MODELS.find(m => m.id === model) && (
                         <div className="mt-4 pt-4 border-t border-border">
                             <p className="text-sm text-muted-foreground">{AVAILABLE_MODELS.find(m => m.id === model)?.description}</p>
                         </div>
                     )}
                </Card.Body>
            </Card>
        </div>
    );
};

export default SettingsPage;