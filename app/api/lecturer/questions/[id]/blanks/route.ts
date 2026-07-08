import { NextRequest, NextResponse } from "next/server";
import { API_ENDPOINTS } from "@api/api";

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get("authorization");
    const acceptLanguage = request.headers.get("accept-language");
    const body = await request.json();

    const response = await fetch(API_ENDPOINTS.LECTURER_QUIZZES.REPLACE_BLANKS(id), {
      method: "PUT",
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
        message: "Failed to replace blanks for question",
      },
      { status: 500 },
    );
  }
}
