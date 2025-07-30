import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { CloseIcon, AlertTriangleIcon } from './IconComponents';
import Card from './ui/Card';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: (user: User) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
    const [isRegister, setIsRegister] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setError('');
            setUsername('');
            setPassword('');
            setFullName('');
            setEmail('');
        }
    }, [isOpen, isRegister]);

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

    const getUsers = (): User[] => {
        const users = localStorage.getItem('users');
        return users ? JSON.parse(users) : [];
    };

    const saveUsers = (users: User[]) => {
        localStorage.setItem('users', JSON.stringify(users));
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!username || !password) {
            setError("Username and password are required.");
            return;
        }
        const users = getUsers();
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) { 
            onLogin(user);
        } else {
            setError('Invalid username or password.');
        }
    };
    
    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!username || !password || !fullName || !email) {
            setError("All fields are required.");
            return;
        }
        if (password.length < 6) {
             setError("Password must be at least 6 characters long.");
             return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        const users = getUsers();
        if (users.some(u => u.username === username)) {
            setError('Username already exists.');
            return;
        }
        if (users.some(u => u.email === email)) {
            setError('Email address is already registered.');
            return;
        }
        
        const newUser: User = { username, fullName, email, password };
        saveUsers([...users, newUser]);
        onLogin(newUser);
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <Card
                className="w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-4 border-b border-border flex justify-between items-center">
                    <h2 className="text-xl font-bold text-foreground">
                        {isRegister ? 'Create Account' : 'Welcome Back'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                        aria-label="Close modal"
                    >
                        <CloseIcon className="h-6 w-6" />
                    </button>
                </div>
                <div className="p-6">
                    <form onSubmit={isRegister ? handleRegister : handleLogin}>
                        <div className="space-y-4">
                            {isRegister && (
                                <>
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full bg-input border border-border rounded-lg p-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                        required
                                    />
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-input border border-border rounded-lg p-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                        required
                                    />
                                </>
                            )}
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-input border border-border rounded-lg p-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-input border border-border rounded-lg p-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                        </div>
                        {error && (
                            <div className="mt-4 flex items-center text-sm text-danger bg-danger/10 p-3 rounded-lg">
                                <AlertTriangleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                                {error}
                            </div>
                        )}
                        <button
                            type="submit"
                            className="w-full bg-primary text-primary-foreground font-semibold p-3 mt-6 rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            {isRegister ? 'Register' : 'Login'}
                        </button>
                    </form>
                    <p className="mt-6 text-center text-sm text-muted-foreground">
                        {isRegister ? 'Already have an account?' : "Don't have an account?"}
                        <button
                            onClick={() => setIsRegister(!isRegister)}
                            className="font-semibold text-primary hover:underline ml-1"
                        >
                            {isRegister ? 'Login' : 'Register'}
                        </button>
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default LoginModal;