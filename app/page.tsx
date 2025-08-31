"use client";

import React, { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [apiPath, setApiPath] = useState<"/api/ai" | "/api/extract">("/api/ai");
  const [busy, setBusy] = useState(false);
  const [out, setOut] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setOut("");

    try {
      const res = await fetch(apiPath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setOut(data.text ?? "(no text)");
    } catch (err: any) {
      setOut("ERROR: " + (err?.message ?? "unknown"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 720, margin: "0 auto", fontFamily: "system-ui" }}>
      <h1>OpenAI ミニ実験</h1>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12, marginTop: 12 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <select
            value={apiPath}
            onChange={(e) => setApiPath(e.target.value as any)}
            style={{ padding: 8, border: "1px solid #ccc", borderRadius: 8 }}
            title="呼び出すAPI"
          >
            <option value="/api/ai">/api/ai（自由回答）</option>
            <option value="/api/extract">/api/extract（3点抽出）</option>
          </select>

          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="お題を入れてください"
            style={{ flex: 1, padding: 8, border: "1px solid #ccc", borderRadius: 8 }}
          />
          <button type="submit" disabled={busy} style={{ padding: "8px 14px", borderRadius: 8 }}>
            {busy ? "送信中..." : "送信"}
          </button>
        </div>
      </form>

      <pre style={{ whiteSpace: "pre-wrap", marginTop: 12 }}>{out}</pre>
    </main>
  );
}
