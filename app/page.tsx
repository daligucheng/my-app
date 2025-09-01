"use client";

export default function Page() {
  return (
    <main style={{ maxWidth: 720, margin: "40px auto", lineHeight: 1.6 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
        OpenAI ミニ実験（Tailwindなし）
      </h1>
      <p>このページはプレーンCSSのみで表示しています。</p>
      <p>
        サーバ稼働チェック： <a href="/api/ping">/api/ping</a> が
        <code> {"{ ok: true }"} </code>を返せばOKです。
      </p>
    </main>
  );
}
