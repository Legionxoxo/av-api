"use client";

import { useState, useCallback } from "react";
import { SessionGetResponse } from "@/types/auth";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/components/AuthProvider";

export function useAuth() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user, setUser } = useAuthContext();
    const router = useRouter();

    const login = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Get session ID from API route
            const sessionResponse = await fetch("/api/auth/create-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            const sessionData = await sessionResponse.json();

            if (!sessionData.success) {
                throw new Error(sessionData.msg || "Failed to create session");
            }

            // Open login window
            const loginWindow = window.open(
                `https://login.myairvault.com/?session_id=${sessionData.session_id}`,
                "Login",
                "width=600,height=800"
            );

            if (!loginWindow) {
                throw new Error(
                    "Popup blocked. Please allow popups and try again."
                );
            }

            // Poll for session status
            const checkInterval = setInterval(async () => {
                try {
                    const checkResponse = await fetch(
                        "/api/auth/check-session",
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                session_id: sessionData.session_id,
                            }),
                        }
                    );

                    const checkData: SessionGetResponse =
                        await checkResponse.json();

                    if (checkData.not_found || checkData.expired) {
                        clearInterval(checkInterval);
                        loginWindow.close();
                        setError("Login session expired. Please try again.");
                        setIsLoading(false);
                        return;
                    }

                    if (checkData.authenticated && checkData.user_details) {
                        clearInterval(checkInterval);
                        loginWindow.close();
                        setUser(checkData.user_details);
                        setIsLoading(false);
                        router.push("/dashboard");
                    }
                } catch (err) {
                    clearInterval(checkInterval);
                    loginWindow.close();
                    setError("Failed to check login status. Please try again.");
                    setIsLoading(false);
                }
            }, 2000);

            // Clean up interval after 1 minute
            setTimeout(() => {
                clearInterval(checkInterval);
                loginWindow.close();
                if (!user) {
                    setError("Login session expired. Please try again.");
                    setIsLoading(false);
                }
            }, 65000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
            setIsLoading(false);
        }
    }, [user, router, setUser]);

    const logout = useCallback(() => {
        setUser(null);
        setError(null);
        router.push("/");
    }, [router, setUser]);

    return {
        user,
        isLoading,
        error,
        login,
        logout,
    };
}
