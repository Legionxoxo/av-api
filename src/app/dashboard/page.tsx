'use client';

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
    const { user, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/');
        }
    }, [user, router]);

    if (!user) {
        return null;
    }

    // Format the name from nested properties
    const displayName = user.name
        ? typeof user.name === 'string'
            ? user.name
            : `${user.name.givenName || ''} ${user.name.familyName || ''}`.trim()
        : user.email;

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
                <h1 className="text-2xl font-bold mb-6">Welcome!</h1>
                <div className="mb-6">
                    <p className="text-gray-600 mb-2">User Details:</p>
                    <div className="bg-gray-50 p-4 rounded">
                        <p><span className="font-semibold">ID:</span> {user.id}</p>
                        <p><span className="font-semibold">Email:</span> {user.email}</p>
                        <p><span className="font-semibold">Name:</span> {displayName}</p>
                    </div>
                </div>
                <button
                    onClick={() => {
                        logout();
                        router.push('/');
                    }}
                    className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </div>
        </main>
    );
} 