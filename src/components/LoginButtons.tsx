import React from 'react';
import { useAuth } from '@/hooks/useAuth';

export function LoginButtons() {
    const { login, isLoading, error } = useAuth();

    return (
        <div className="flex flex-col gap-4">
            <button
                onClick={() => login()}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
                {isLoading ? "Loading..." : "Login"}
            </button>
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
} 