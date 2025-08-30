import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { prompt, mode } = await req.json();

    const system =
      mode === "story"
        ? "あなたはショートショート作家。日本語で300〜500文字、ラスト1行にひねり。難しい言葉は避け、比喩は1つだけ。"
        : mode === "debate"
        ? "あなたはモデレーター。お題について賛成3点・反対3点を見出しつき箇条書き→最後に折衷案1つ。各点は具体例つきで2行以内。"
        : "あなたは発想支援コーチ。お題からユースケースを3個、各2行以内で具体例・道具・一歩目を混ぜて日本語で提案。";

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages: [
        { role: "system", content: system },
        { role: "user", content: String(prompt ?? "") }
      ],
    });

    const text = completion.choices?.[0]?.message?.content ?? "";
    return Response.json({ text });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message ?? "unknown error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
