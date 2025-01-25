'use client';

import { LoginButtons } from "@/components/LoginButtons";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push('/dashboard');
        }
    }, [user, router]);

    if (user) {
        return null;
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <div className="text-center">
                <h1 className="text-2xl mb-8">Welcome to AV API</h1>
                <LoginButtons />
            </div>
        </main>
    );
}
