import { NextRequest, NextResponse } from "next/server";
import { API_ENDPOINTS } from "@api/api";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const acceptLanguage = request.headers.get("accept-language");
    const body = await request.json();

    if (!body.quizAttemptId || !body.quizId || !body.quizLevelId) {
      return NextResponse.json(
        { message: "quizAttemptId, quizId, and quizLevelId are required" },
        { status: 400 },
      );
    }

    const response = await fetch(API_ENDPOINTS.QUIZZES.SUBMIT_BULK_ANSWERS(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader && { Authorization: authHeader }),
        ...(acceptLanguage && { "accept-language": acceptLanguage }),
      },
      body: JSON.stringify(body),
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
      { status: 500 },
    );
  }
}
