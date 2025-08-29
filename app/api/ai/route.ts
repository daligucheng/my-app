import OpenAI from "openai";
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt ?? "こんにちは" }],
  });
  const text = completion.choices?.[0]?.message?.content ?? "";
  return Response.json({ text });
}
