// app/api/ping/route.ts
import { NextResponse } from "next/server";

// （任意）キャッシュに乗らないようにしたい時
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ ok: true });
}
