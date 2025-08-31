import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const { messages } = (await req.json()) as {
      messages: { role: "user" | "assistant" | "system"; content: string }[];
    };

    const chat = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages,
    });

    const text = chat.choices[0]?.message?.content ?? "";
    return NextResponse.json({ text });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "unknown error" },
      { status: 500 },
    );
  }
}
