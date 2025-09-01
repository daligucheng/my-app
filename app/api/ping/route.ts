// app/api/ping/route.ts
import { NextResponse } from "next/server";

// 404/静的化を避けるため安全側に振る
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ ok: true });
}
