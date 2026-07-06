import { NextRequest, NextResponse } from "next/server";
import { API_ENDPOINTS } from "@api/api";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const acceptLanguage = request.headers.get("accept-language");

    const { searchParams } = new URL(request.url);
    const year = Number(searchParams.get("year"));
    const month = Number(searchParams.get("month"));
    const groupId = searchParams.get("groupId") || undefined;

    if (isNaN(year) || isNaN(month)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid year or month query parameters",
          data: [],
        },
        { status: 400 },
      );
    }

    const response = await fetch(API_ENDPOINTS.LECTURER.CALENDAR_EVENTS(year, month, groupId), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader && { Authorization: authHeader }),
        ...(acceptLanguage && { "accept-language": acceptLanguage }),
      },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch calendar events",
        data: [],
      },
      { status: 500 },
    );
  }
}
