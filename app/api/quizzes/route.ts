import { NextRequest, NextResponse } from "next/server";
import { API_ENDPOINTS } from "@api/api";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const acceptLanguage = request.headers.get("accept-language");
    const levelId = request.nextUrl.searchParams.get("levelId");

    if (!levelId) {
      return NextResponse.json(
        { message: "levelId is required" },
        { status: 400 }
      );
    }

    const response = await fetch(API_ENDPOINTS.QUIZZES.LIST(levelId), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader && { Authorization: authHeader }),
        ...(acceptLanguage && { "accept-language": acceptLanguage }),
      },
      credentials: "include",
    });

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
