import dynamic from 'next/dynamic';

const SoftNeuralField = dynamic(
  () => import('./components/SoftNeuralField/SoftNeuralField'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-cyan-400 text-xl font-mono">Inicializando sistema neural...</div>
        </div>
      </div>
    )
  }
);

export default function Page() {
  return (
    <>
      <SoftNeuralField particleCount={50} fps={24} />
    </>
  );
}