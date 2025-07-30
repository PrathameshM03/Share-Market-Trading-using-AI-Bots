import React, { useEffect } from 'react';
import { NewsItem } from '../types';
import { CloseIcon, ExternalLinkIcon } from './IconComponents';
import Card from './ui/Card';

interface NewsModalProps {
    item: NewsItem | null;
    onClose: () => void;
}

const NewsModal: React.FC<NewsModalProps> = ({ item, onClose }) => {
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);
    
    if (!item) return null;

    return (
        <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="news-modal-title"
        >
            <style>
                {`
                    @keyframes fade-in {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    .animate-fade-in {
                        animation: fade-in 0.2s ease-out;
                    }
                `}
            </style>
            <Card 
                className="w-full max-w-2xl max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-4 border-b border-border flex justify-between items-start">
                    <h2 id="news-modal-title" className="text-xl font-bold text-foreground pr-4">
                        {item.headline}
                    </h2>
                    <button 
                        onClick={onClose} 
                        className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 p-1 rounded-full hover:bg-secondary"
                        aria-label="Close modal"
                    >
                        <CloseIcon className="h-6 w-6" />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto flex-grow">
                    <p className="text-foreground/80 leading-relaxed whitespace-pre-line">{item.summary}</p>
                </div>
                <div className="p-4 border-t border-border flex justify-between items-center text-sm">
                    <p className="text-muted-foreground">Source: {item.source}</p>
                    <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center font-medium text-primary hover:underline"
                    >
                        Read Full Article
                        <ExternalLinkIcon className="h-4 w-4 ml-1.5" />
                    </a>
                </div>
            </Card>
        </div>
    );
};

export default NewsModal;