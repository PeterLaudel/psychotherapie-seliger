import { NextResponse } from "next/server";

declare global {
  var lastEmailPreviewUrl: string | null;
}

export function GET() {
  // redirect to the last email URL if it exists
  if (global.lastEmailPreviewUrl) {
    const url = global.lastEmailPreviewUrl;
    global.lastEmailPreviewUrl = null; // reset after redirecting
    return NextResponse.redirect(url);
  }

  return new Response("No email URL available", { status: 404 });
}
