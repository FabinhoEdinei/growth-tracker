
import './globals.css';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
      {/* Ruído */}
      <div 
        
  style={{
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `
      linear-gradient(rgba(0, 240, 255, 0.08) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 240, 255, 0.05) 1px, transparent 1px),
      radial-gradient(circle at 30% 40%, rgba(0, 200, 255, 0.1) 1px, transparent 1px),
      radial-gradient(circle at 70% 60%, rgba(0, 150, 255, 0.08) 1px, transparent 1px)
    `,
    backgroundSize: '4px 4px, 4px 4px, 120px 120px, 150px 150px',
    pointerEvents: 'none',
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