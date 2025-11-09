import { NextResponse } from "next/server";

declare global {
  var lastEmailPreviewUrl: string | null;
}

export function GET() {
  if (global.lastEmailPreviewUrl) {
    const url = global.lastEmailPreviewUrl;
    global.lastEmailPreviewUrl = null;
    return NextResponse.redirect(url);
  }

  return new Response("No email URL available", { status: 404 });
}
