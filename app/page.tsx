'use client';
import { useState } from 'react';

type Mode = 'ideas' | 'story' | 'debate';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [out, setOut] = useState('');
  const [mode, setMode] = useState<Mode>('ideas');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setOut('');
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, mode })
      });
      const data = await res.json();
      setOut(data.text ?? '(no text)');
    } catch (err: any) {
      setOut('Error: ' + (err?.message ?? String(err)));
    } finally {
      setLoading(false);
    }
  }

  const presets: Array<[string, string, Mode?]> = [
    ['企画のタネ', '「自宅で運動」をテーマに収益化のアイデアを', 'ideas'],
    ['ひねり短編', '傘をモチーフにショートショートを', 'story'],
    ['賛否整理', 'オフィス完全出社の是非を論じて', 'debate'],
  ];

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: '0 auto', fontFamily: 'system-ui' }}>
      <h1>OpenAI ミニ実験</h1>

      {/* モード切替 */}
      <div style={{ display: 'flex', gap: 8, margin: '12px 0' }}>
        {(['ideas','story','debate'] as Mode[]).map(m => (
          <button key={m}
            onClick={() => setMode(m)}
            style={{
              padding: '6px 10px', borderRadius: 8,
              border: mode === m ? '2px solid #111' : '1px solid #ccc',
              background: mode === m ? '#fff' : '#f7f7f7', cursor: 'pointer'
            }}>
            {m === 'ideas' ? '発想' : m === 'story' ? '物語' : '賛否'}
          </button>
        ))}
      </div>

      {/* プリセット */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
        {presets.map(([label, text, m]) => (
          <button key={label}
            onClick={() => { if (m) setMode(m); setPrompt(text); }}
            style={{ padding: '4px 10px', borderRadius: 999, border: '1px solid #ddd', background: '#fafafa', cursor: 'pointer' }}>
            {label}
          </button>
        ))}
      </div>

      {/* 入力フォーム */}
      <form onSubmit={onSubmit} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="例: 週3で続く朝活メニューを考えて"
          style={{ flex: 1, padding: 10, border: '1px solid #ccc', borderRadius: 10 }}
        />
        <button type="submit" disabled={loading}
          style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid #111', background: loading ? '#eee' : '#fff' }}>
          {loading ? '生成中…' : '送信'}
        </button>
      </form>

      <pre style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{out}</pre>
    </main>
  );
}
