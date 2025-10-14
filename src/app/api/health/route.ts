import { NextResponse } from "next/server";

export function GET(
): NextResponse<string> {
  return NextResponse.json("OK");
}