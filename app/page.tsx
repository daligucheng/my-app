"use client";
import React, { useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

export default function Home() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || busy) return;

    const next = [...messages, { role: "user", content: input }] as Msg[];
    setMessages(next);
    setInput("");
    setBusy(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "丁寧に簡潔に日本語で答える" },
            ...next,
          ],
        }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.text ?? "" }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "エラーが発生しました" }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ maxWidth: 720, margin: "32px auto", padding: 16 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>チャット</h1>

      <div style={{ display: "grid", gap: 12, marginBottom: 16 }}>
        {messages.map((m, i) => (
          <div key={i}
            style={{
              whiteSpace: "pre-wrap",
              background: m.role === "user" ? "#eef6ff" : "#f5f5f5",
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: 12,
              justifySelf: m.role === "user" ? "end" : "start",
              maxWidth: "85%",
            }}>
            <b style={{ fontSize: 12, opacity: 0.6 }}>{m.role === "user" ? "You" : "AI"}</b>
            <div>{m.content}</div>
          </div>
        ))}
      </div>

      <form onSubmit={onSend} style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="メッセージを入力"
          style={{ flex: 1, padding: 12, border: "1px solid #ccc", borderRadius: 8 }}
        />
        <button disabled={busy} style={{ padding: "12px 16px", borderRadius: 8 }}>送信</button>
      </form>
    </main>
  );
}
