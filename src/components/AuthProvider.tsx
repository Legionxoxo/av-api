'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserDetails } from '@/types/auth';

interface AuthContextType {
    user: UserDetails | null;
    setUser: (user: UserDetails | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<UserDetails | null>(null);

    useEffect(() => {
        // Initialize from localStorage only on client side
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        // Sync user state with localStorage
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    if (isLoading) {
        return null; // or a loading spinner
    }

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
} 