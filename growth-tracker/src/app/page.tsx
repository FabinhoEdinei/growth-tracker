
import './globals.css';
export default function HomePage() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
      {/* Ruído */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            radial-gradient(circle at 10% 20%, #00f0ff 1px, transparent 1px),
            radial-gradient(circle at 90% 80%, #00f0ff 1px, transparent 1px),
            radial-gradient(circle at 50% 40%, #00aaff 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }}
      />

      {/* Caixa central */}
      <div className="w-[400px] h-[300px] bg-black border border-cyan-400 rounded-lg flex flex-col items-center justify-center p-6">
        <h1 className="text-cyan-400 text-xl font-mono uppercase">NOTIFICATION</h1>
        <p className="text-cyan-300 text-sm font-mono mt-4 text-center">
          The following video is:<br />
          Fan-made, not affiliated with Solo Leveling or Crunchyroll
        </p>
      </div>
    </div>
  );
}