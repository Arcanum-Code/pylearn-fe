import { NextRequest, NextResponse } from "next/server";
import { API_ENDPOINTS } from "@/app/api/api";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, context: RouteParams) {
  try {
    const { id } = await context.params;
    const authHeader = request.headers.get("authorization");
    const acceptLanguage = request.headers.get("accept-language");
    
    const body = await request.json();

    const response = await fetch(API_ENDPOINTS.MATERIALS.STUDENT_PROGRESS(id), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader && { Authorization: authHeader }),
        ...(acceptLanguage && { "accept-language": acceptLanguage }),
      },
      credentials: "include",
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(`Material progress integration error:`, error);
    return NextResponse.json(
      { message: "Unable to connect to server" },
      { status: 500 },
    );
  }
}
