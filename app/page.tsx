import './globals.css'

export default function HomePage() {
  return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">

            {/* NOISE / PARTÍCULAS */}
                  <div className="absolute inset-0 opacity-20 pointer-events-none bg-noise" />

                        {/* BRILHO AZUL FUNDO */}
                              <div className="absolute w-[900px] h-[900px] bg-cyan-500 blur-[180px] opacity-20 rounded-full" />

                                    {/* CONTAINER CENTRAL */}
                                          <div className="relative z-10">

                                                  {/* BORDA NEON */}
                                                          <div className="relative p-[2px] rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 animate-border">
                                                                    
                                                                              <div className="bg-black/90 backdrop-blur-xl rounded-xl px-16 py-12 border border-cyan-400/20 shadow-[0_0_60px_rgba(0,255,255,0.3)]">

                                                                                          {/* HEADER */}
                                                                                                      <div className="flex items-center gap-4 mb-6">
                                                                                                                    <div className="w-10 h-10 rounded-lg border border-cyan-400 flex items-center justify-center text-cyan-300">
                                                                                                                                    !
                                                                                                                                                  </div>

                                                                                                                                                                <h1 className="text-cyan-300 text-3xl font-bold tracking-widest">
                                                                                                                                                                                NOTIFICATION
                                                                                                                                                                                              </h1>
                                                                                                                                                                                                          </div>

                                                                                                                                                                                                                      {/* TEXTO */}
                                                                                                                                                                                                                                  <p className="text-cyan-200/80 text-center max-w-lg leading-relaxed">
                                                                                                                                                                                                                                                The following video is: <br />
                                                                                                                                                                                                                                                              Fan-made, not affiliated with Solo Leveling or Crunchyroll.
                                                                                                                                                                                                                                                                          </p>

                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                            </div>

                                                                                                                                                                                                                                                                                                  </div>
                                                                                                                                                                                                                                                                                                      </div>
                                                                                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                                                                        }