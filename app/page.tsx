"use client";

import { useState } from "react";

export default function Page() {
  const [msg, setMsg] = useState("");
  const [out, setOut] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSend(e: React.FormEvent) {
    e.preventDefault();
    if (!msg.trim() || busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/ping"); // まずは動作確認API
      const data = await res.json();
      setOut(JSON.stringify(data));
    } catch (e) {
      setOut("(error)");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>OpenAI ミニ実験</h1>
      <form onSubmit={onSend} style={{ display: "flex", gap: 8 }}>
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="メッセージを入力"
        />
        <button disabled={busy}>{busy ? "送信中…" : "送信"}</button>
      </form>
      <pre style={{ marginTop: 12 }}>{out}</pre>
    </main>
  );
}
