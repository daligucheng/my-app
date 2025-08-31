'use client';
import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<'story'|'tutor'|'steps'>('story');
  const [out, setOut] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setOut('');
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, mode })
      });
      const data = await res.json();
      setOut(data.text ?? '(no text)');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 720, margin: '0 auto', fontFamily: 'system-ui' }}>
      <h1>OpenAI ミニ実験</h1>

      <form onSubmit={onSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, alignItems: 'center', marginBottom: 12 }}>
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="お題を入れてください"
          style={{ padding: 8, border: '1px solid #ccc', borderRadius: 8 }}
        />
        <select value={mode} onChange={(e) => setMode(e.target.value as any)} style={{ padding: 8, borderRadius: 8 }}>
          <option value="story">読み物</option>
          <option value="tutor">先生</option>
          <option value="steps">手順</option>
        </select>
        <button disabled={busy} type="submit" style={{ padding: '8px 14px', borderRadius: 8 }}>
          {busy ? '送信中…' : '送信'}
        </button>
      </form>

      <pre style={{ whiteSpace: 'pre-wrap' }}>{out}</pre>
    </main>
  );
}
