import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEMS = {
  story: `# 役割
あなたは簡潔で読みやすい解説者。
# ルール
- 小学生にも読める語彙で、300〜500字。
- 最後に一言だけ温度感のあるひとことを添える。
- 難しい言葉は避け、例は1つ。`,
  tutor: `# 役割
やさしい個別指導の先生。
# ルール
- はじめに要点3つを「●」で列挙（各8〜12字）。
- その後に1段落で解説（200〜300字）。
- 末尾に「次にやること」を1つだけ。`,
  steps: `# 役割
無駄のない手順書作成係。
# ルール
- 箇条書きで5〜7手順。各行は20字以内。
- 数字付き 1. 2. 3. … の形式。`,
} as const;

type Mode = keyof typeof SYSTEMS;

type RequestBody = {
  prompt?: string;
  mode?: Mode;
};

export async function POST(req: Request): Promise<Response> {
  try {
    const { prompt = "", mode = "story" }: RequestBody = await req.json();

    const system: string = SYSTEMS[mode] ?? SYSTEMS.story;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: mode === "steps" ? 0.2 : 0.7,
      messages: [
        { role: "system" as const, content: system },
        { role: "user" as const, content: String(prompt) },
      ],
    });

    const text = completion.choices?.[0]?.message?.content ?? "";
    return Response.json({ text });
  } catch (e: unknown) {
    const message =
      e && typeof e === "object" && "message" in e
        ? String((e as { message: unknown }).message)
        : "unknown error";

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
