"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Page() {
  const [msg, setMsg] = useState("");
  const [out, setOut] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSend(e: React.FormEvent) {
    e.preventDefault();
    if (!msg || busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: msg }]
        }),
      });
      const data = await res.json();
      setOut(data.text ?? "(no text)");
    } catch (err: any) {
      setOut(err?.message ?? "unknown error");
    } finally {
      setBusy(false);
      setMsg("");
    }
  }

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">ミニチャット</h1>
      <form onSubmit={onSend} className="flex gap-2">
        <Input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="メッセージを入力"
        />
        <Button type="submit" disabled={busy}>
          {busy ? "送信中…" : "送信"}
        </Button>
      </form>
      <pre className="mt-4 whitespace-pre-wrap text-sm bg-gray-50 p-3 rounded">
        {out}
      </pre>
    </main>
  );
}
