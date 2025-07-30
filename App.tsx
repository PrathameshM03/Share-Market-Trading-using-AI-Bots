import React, { useState, useEffect, useCallback } from 'react';
import { User } from './types';
import LandingPage from './components/LandingPage';
import MainApp from './components/MainApp';
import LoginModal from './components/LoginModal';

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [initialAuthCheck, setInitialAuthCheck] = useState(false);

    useEffect(() => {
        // Check for logged-in user in localStorage on initial load for session persistence
        try {
            const loggedInUser = localStorage.getItem('currentUser');
            if (loggedInUser) {
                const user = JSON.parse(loggedInUser) as User;
                setCurrentUser(user);
            }
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
            localStorage.removeItem('currentUser');
        } finally {
            setInitialAuthCheck(true);
        }
    }, []);

    const handleLogin = (user: User) => {
        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        setIsLoginModalOpen(false);
    };
    
    const handleLogout = () => {
        setCurrentUser(null);
        localStorage.removeItem('currentUser');
    };

    if (!initialAuthCheck) {
        // Render a loading state or nothing until the initial auth check is complete
        return <div className="h-screen w-screen bg-background" />;
    }

    return (
        <>
            {currentUser ? (
                <MainApp currentUser={currentUser} onLogout={handleLogout} />
            ) : (
                <LandingPage onLoginClick={() => setIsLoginModalOpen(true)} />
            )}
            <LoginModal 
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                onLogin={handleLogin}
            />
        </>
    );
};

export default App;