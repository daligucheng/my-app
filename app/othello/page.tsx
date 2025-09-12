import OthelloGame from "@/components/OthelloGame";

export default function Page() {
  return (
    <main style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
        オセロゲーム
      </h1>
      <OthelloGame />
    </main>
  );
}
