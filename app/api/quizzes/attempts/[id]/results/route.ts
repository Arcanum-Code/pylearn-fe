import { NextRequest, NextResponse } from "next/server";
import { API_ENDPOINTS } from "@api/api";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteProps) {
  try {
    const authHeader = request.headers.get("authorization");
    const acceptLanguage = request.headers.get("accept-language");

    const { id } = await params;

    const response = await fetch(
      API_ENDPOINTS.QUIZZES.GET_ATTEMPT_RESULTS(id),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(authHeader && { Authorization: authHeader }),
          ...(acceptLanguage && { "accept-language": acceptLanguage }),
        },
        credentials: "include",
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: "Unable to connect to server" },
      { status: 500 },
    );
  }
}
