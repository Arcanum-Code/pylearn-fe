import { NextRequest, NextResponse } from "next/server";
import { API_ENDPOINTS } from "@/app/api/api";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get("authorization");
    const acceptLanguage = request.headers.get("accept-language");

    const response = await fetch(API_ENDPOINTS.MATERIALS.STUDENT_DETAIL(id), {
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
    console.error("Student material detail proxy error:", error);
    return NextResponse.json(
      { message: "Unable to connect to server" },
      { status: 500 }
    );
  }
}
