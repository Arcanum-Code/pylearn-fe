import { NextRequest, NextResponse } from "next/server";
import { API_ENDPOINTS } from "@/app/api/api";
import axios from "axios";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const token = req.headers.get("authorization");
    const lang = req.headers.get("accept-language");
    const response = await axios.get(API_ENDPOINTS.GROUPS.STUDENT_DETAIL(id), {
      headers: { Authorization: token, "accept-language": lang },
    });
    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      error.response?.data || { success: false, message: "Error" },
      { status: error.response?.status || 500 }
    );
  }
}
