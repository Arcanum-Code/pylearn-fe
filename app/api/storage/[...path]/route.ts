import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@api/api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const filePath = path.join("/");
    
    // Construct the backend storage URL
    // API_URL on the server will point to the internal backend if configured
    const backendUrl = `${API_URL}/storage/${filePath}`;

    const response = await fetch(backendUrl);

    if (!response.ok) {
      return NextResponse.json(
        { message: "File not found" },
        { status: response.status }
      );
    }

    // Proxy the file with original headers
    const blob = await response.blob();
    const headers = new Headers();
    
    // Forward important headers
    const contentType = response.headers.get("content-type");
    const contentLength = response.headers.get("content-length");
    
    if (contentType) headers.set("Content-Type", contentType);
    if (contentLength) headers.set("Content-Length", contentLength);
    
    // Add cache control to avoid repeated fetches
    headers.set("Cache-Control", "public, max-age=3600");

    return new NextResponse(blob, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Storage proxy error:", error);
    return NextResponse.json(
      { message: "Unable to connect to storage server" },
      { status: 500 }
    );
  }
}
