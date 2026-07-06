import { NextRequest, NextResponse } from "next/server";
import { API_ENDPOINTS } from "@api/api";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, context: RouteParams) {
  try {
    const { id } = await context.params;
    const authHeader = request.headers.get("authorization");
    const acceptLanguage = request.headers.get("accept-language");

    const response = await fetch(API_ENDPOINTS.MATERIALS.PUBLISH(id), {
      method: "POST",
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
    console.error(`Material publish integration error:`, error);
    return NextResponse.json(
      { message: "Unable to connect to server" },
      { status: 500 },
    );
  }
}
