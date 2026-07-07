import { NextRequest, NextResponse } from "next/server";
import { API_ENDPOINTS } from "@api/api";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const acceptLanguage = request.headers.get("accept-language");

    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");
    const groupId = searchParams.get("groupId") || undefined;

    if (!limit) {
      return NextResponse.json(
        { message: "Limit is required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      API_ENDPOINTS.DASHBOARD.MAHASISWA_RECENT_ACTIVITY(
        Number(limit),
        groupId
      ),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(authHeader && { Authorization: authHeader }),
          ...(acceptLanguage && { "accept-language": acceptLanguage }),
        },
        credentials: "include",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: "Unable to connect to server" },
      { status: 500 }
    );
  }
}
