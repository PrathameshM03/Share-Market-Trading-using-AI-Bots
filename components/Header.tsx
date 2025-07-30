import React, { useState, useEffect, useRef } from 'react';
import { BotIcon, UserCircleIcon, ChevronDownIcon, CogIcon, LogoutIcon, InformationCircleIcon, GithubIcon, TwitterIcon, LinkedinIcon } from './IconComponents';
import { User } from '../types';

interface HeaderProps {
    currentUser: User | null;
    onOpenAboutModal: () => void;
    onNavigate: (page: 'settings') => void;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onOpenAboutModal, onNavigate, onLogout }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsMenuOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscapeKey);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, []);

    return (
        <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-20 border-b border-border">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <BotIcon className="h-8 w-8 text-primary" />
                        <h1 className="ml-3 text-2xl font-bold text-foreground tracking-tight">AI Trading Bot</h1>
                    </div>
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="flex items-center space-x-2 p-2 rounded-full hover:bg-secondary transition-colors"
                            aria-expanded={isMenuOpen}
                            aria-haspopup="true"
                        >
                            <UserCircleIcon className="h-8 w-8 text-muted-foreground" />
                            <span className="hidden sm:inline font-medium text-foreground">{currentUser?.fullName}</span>
                            <ChevronDownIcon className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${isMenuOpen ? 'transform rotate-180' : ''}`} />
                        </button>
                        {isMenuOpen && (
                            <div
                                className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl bg-background border border-border shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                                role="menu"
                                aria-orientation="vertical"
                                aria-labelledby="menu-button"
                            >
                                <div className="p-4 border-b border-border">
                                    <p className="font-semibold text-foreground truncate">{currentUser?.fullName}</p>
                                    <p className="text-sm text-muted-foreground truncate">@{currentUser?.username}</p>
                                </div>
                                <div className="py-2" role="none">
                                    <button onClick={() => { onOpenAboutModal(); setIsMenuOpen(false); }} className="flex items-center w-full px-4 py-2.5 text-sm text-foreground hover:bg-secondary hover:text-primary transition-colors" role="menuitem">
                                        <InformationCircleIcon className="h-5 w-5 mr-3" />
                                        About this App
                                    </button>
                                    <button onClick={() => { onNavigate('settings'); setIsMenuOpen(false); }} className="flex items-center w-full px-4 py-2.5 text-sm text-foreground hover:bg-secondary hover:text-primary transition-colors" role="menuitem">
                                        <CogIcon className="h-5 w-5 mr-3" />
                                        Settings
                                    </button>
                                    
                                    <div className="border-t border-border my-2"></div>
                                    
                                    <div className="px-4 py-1.5 text-xs font-semibold text-muted-foreground uppercase">Connect with Developer</div>
                                    <div className="flex items-center justify-around px-4 py-2">
                                        <a href="https://github.com/PrathameshM03" target="_blank" rel="noopener noreferrer" className="p-2 text-muted-foreground hover:text-primary hover:bg-secondary rounded-full transition-colors" aria-label="Github">
                                            <GithubIcon className="h-6 w-6" />
                                        </a>
                                        <a href="https://x.com/Prathamesh8980" target="_blank" rel="noopener noreferrer" className="p-2 text-muted-foreground hover:text-primary hover:bg-secondary rounded-full transition-colors" aria-label="Twitter">
                                            <TwitterIcon className="h-6 w-6" />
                                        </a>
                                        <a href="https://www.linkedin.com/in/prathamesh-margale/" target="_blank" rel="noopener noreferrer" className="p-2 text-muted-foreground hover:text-primary hover:bg-secondary rounded-full transition-colors" aria-label="LinkedIn">
                                            <LinkedinIcon className="h-6 w-6" />
                                        </a>
                                    </div>

                                    <div className="border-t border-border my-2"></div>
                                    
                                    <button onClick={() => { onLogout(); setIsMenuOpen(false); }} className="flex items-center w-full px-4 py-2.5 text-sm text-danger hover:bg-danger/10 transition-colors" role="menuitem">
                                        <LogoutIcon className="h-5 w-5 mr-3" />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;