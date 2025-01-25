import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { session_id } = await request.json();

        if (!session_id) {
            return NextResponse.json(
                { error: "Session ID is required" },
                { status: 400 }
            );
        }

        const response = await fetch(
            "https://login.myairvault.com/api/v1/session/get",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ session_id }),
            }
        );

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Session check error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
