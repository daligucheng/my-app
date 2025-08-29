'use client';
import { useState } from 'react';
export default function Home() {
  const [prompt, setPrompt] = useState(''); const [out, setOut] = useState('');
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/ai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt})});
    const data = await res.json(); setOut(data.text ?? '(no text)');
  }
  return (<main style={{padding:24,maxWidth:720,margin:'0 auto',fontFamily:'system-ui'}}>
    <h1>OpenAI ミニ実験</h1>
    <form onSubmit={onSubmit} style={{display:'flex',gap:8,marginBottom:16}}>
      <input value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="お題を入れてください"
        style={{flex:1,padding:8,border:'1px solid #ccc',borderRadius:8}}/>
      <button type="submit" style={{padding:'8px 14px',borderRadius:8}}>送信</button>
    </form>
    <pre style={{whiteSpace:'pre-wrap'}}>{out}</pre>
  </main>);
}
