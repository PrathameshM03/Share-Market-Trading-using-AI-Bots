import React, { useEffect } from 'react';
import { CloseIcon, BotIcon } from './IconComponents';
import Card from './ui/Card';

interface AboutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEsc);
        }
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, onClose]);
    
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="about-modal-title"
        >
            <style>
                {`
                    @keyframes modal-fade-in {
                        from { opacity: 0; transform: scale(0.95); }
                        to { opacity: 1; transform: scale(1); }
                    }
                    .animate-fade-in {
                        animation: modal-fade-in 0.2s ease-out;
                    }
                `}
            </style>
            <Card 
                className="w-full max-w-lg max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
                role="document"
            >
                <div className="p-4 border-b border-border flex justify-between items-center">
                    <h2 id="about-modal-title" className="text-xl font-bold text-foreground flex items-center">
                       <BotIcon className="h-6 w-6 mr-3 text-primary"/>
                       About AI Trading Bot
                    </h2>
                    <button 
                        onClick={onClose} 
                        className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 p-1 rounded-full hover:bg-secondary"
                        aria-label="Close modal"
                    >
                        <CloseIcon className="h-6 w-6" />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto flex-grow text-foreground/80 space-y-4 leading-relaxed">
                   <p>
                        This application is a sophisticated dashboard that simulates AI-driven stock trading decisions. It leverages a suite of specialized AI bots to provide comprehensive, real-time insights for any publicly traded company.
                    </p>
                    <ul className="list-disc list-inside space-y-2 pl-2">
                        <li><strong>Company Bot:</strong> Gathers key company information and fundamentals.</li>
                        <li><strong>News Analysis Bot:</strong> Scans the web for the latest news and determines overall market sentiment.</li>
                        <li><strong>Social Media Bot:</strong> Analyzes social buzz from platforms like X and Reddit to gauge public opinion.</li>
                        <li><strong>Trading Bot:</strong> Synthesizes all data points to issue a final BUY, SELL, or HOLD recommendation.</li>
                    </ul>
                     <p>
                        The goal is to demonstrate how modern AI can be used to process vast amounts of unstructured data to aid in complex decision-making processes.
                    </p>
                </div>
                <div className="p-4 border-t border-border text-center text-sm text-muted-foreground">
                    <p>Powered by the <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">Google Gemini API</a></p>
                </div>
            </Card>
        </div>
    );
};

export default AboutModal;