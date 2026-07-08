import { NextRequest, NextResponse } from "next/server";
import { API_ENDPOINTS } from "@api/api";

type RouteParams = {
  params: Promise<{
    groupId: string;
  }>;
};

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { groupId } = await params;
    const authHeader = request.headers.get("authorization");
    const acceptLanguage = request.headers.get("accept-language");

    const response = await fetch(API_ENDPOINTS.LECTURER_QUIZZES.LIST_BY_GROUP(groupId), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader && { Authorization: authHeader }),
        ...(acceptLanguage && { "accept-language": acceptLanguage }),
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch quizzes for group",
        data: [],
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { groupId } = await params;
    const authHeader = request.headers.get("authorization");
    const acceptLanguage = request.headers.get("accept-language");
    const body = await request.json();

    const response = await fetch(API_ENDPOINTS.LECTURER_QUIZZES.CREATE(groupId), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader && { Authorization: authHeader }),
        ...(acceptLanguage && { "accept-language": acceptLanguage }),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create quiz for group",
      },
      { status: 500 },
    );
  }
}
