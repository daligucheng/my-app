// app/api/ping/route.ts
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // CDN キャッシュを避けるため念のため
export async function GET() {
  return NextResponse.json({ ok: true });
}
