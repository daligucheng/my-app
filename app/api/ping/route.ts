import { NextResponse } from "next/server";

// GET /api/ping -> {"ok": true}
export function GET() {
  return NextResponse.json({ ok: true });
}
