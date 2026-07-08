import { NextRequest, NextResponse } from "next/server";
import { API_ENDPOINTS } from "@api/api";

type RouteParams = {
  params: Promise<{
    groupId: string;
    studentId: string;
  }>;
};

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { groupId, studentId } = await params;
    const authHeader = request.headers.get("authorization");
    const acceptLanguage = request.headers.get("accept-language");

    const response = await fetch(
      API_ENDPOINTS.LECTURER.GROUP_STUDENT_ACTIVITY_DETAIL(groupId, studentId),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(authHeader && { Authorization: authHeader }),
          ...(acceptLanguage && { "accept-language": acceptLanguage }),
        },
      },
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch student activity",
        data: null,
      },
      { status: 500 },
    );
  }
}
