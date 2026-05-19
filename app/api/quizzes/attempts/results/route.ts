import { NextRequest, NextResponse } from "next/server";
import { API_ENDPOINTS } from "@api/api"; // Sesuaikan path berkas api.ts Anda

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const acceptLanguage = request.headers.get("accept-language");

    // Ambil seluruh query string (misal: ?quizLevelId=51&studentId=99) dari incoming request
    const queryString = request.nextUrl.search;

    const response = await fetch(
      API_ENDPOINTS.QUIZZES.GET_ALL_ATTEMPT_RESULTS() + queryString,
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
