import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/app/api/api";

interface RouteParams {
  params: Promise<{ path: string[] }>;
}

async function handleProxy(
  request: NextRequest,
  { params }: RouteParams,
  method: string
) {
  try {
    const { path } = await params;
    const queryString = request.nextUrl.search;
    const backendUrl = `${API_URL}/student/quizzes/${path.join("/")}${queryString}`;

    const authHeader = request.headers.get("authorization");
    const acceptLanguage = request.headers.get("accept-language");
    
    // Parse body if method is POST, PATCH or PUT
    let body: string | undefined = undefined;
    if (method !== "GET" && method !== "DELETE") {
      try {
        const json = await request.json();
        body = JSON.stringify(json);
      } catch {
        // No body or invalid json
      }
    }

    const response = await fetch(backendUrl, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(authHeader && { Authorization: authHeader }),
        ...(acceptLanguage && { "accept-language": acceptLanguage }),
      },
      ...(body && { body }),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(`Student quiz proxy error (${method}):`, error);
    return NextResponse.json(
      { message: "Unable to connect to server" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, context: RouteParams) {
  return handleProxy(request, context, "GET");
}

export async function POST(request: NextRequest, context: RouteParams) {
  return handleProxy(request, context, "POST");
}

export async function PATCH(request: NextRequest, context: RouteParams) {
  return handleProxy(request, context, "PATCH");
}

export async function DELETE(request: NextRequest, context: RouteParams) {
  return handleProxy(request, context, "DELETE");
}
