import { NextRequest, NextResponse } from "next/server";
import { API_ENDPOINTS } from "@/app/api/api";
import axios from "axios";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization");
    const lang = req.headers.get("accept-language");
    const response = await axios.get(API_ENDPOINTS.GROUPS.LIST, {
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = req.headers.get("authorization");
    const lang = req.headers.get("accept-language");
    const response = await axios.post(API_ENDPOINTS.GROUPS.CREATE, body, {
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
