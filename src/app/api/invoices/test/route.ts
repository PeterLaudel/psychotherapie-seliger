import { NextResponse } from "next/server";

declare global {
  var lastEmailPreviewUrl: string | null;
}

export function GET() {
  if (global.lastEmailPreviewUrl) {
    const content = global.lastEmailPreviewUrl;
    global.lastEmailPreviewUrl = null;
    return NextResponse.json(JSON.parse(JSON.parse(content)["message"]));
  }

  return new Response("No email URL available", { status: 404 });
}
