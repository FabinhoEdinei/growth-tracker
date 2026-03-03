"use client"

import MetaCard from "@/components/tv/MetaCard"
import ProducaoCard from "@/components/tv/ProducaoCard"
import RankingCard from "@/components/tv/RankingCard"
import ComunicadoCard from "@/components/tv/ComunicadoCard"
import ClimaCard from "@/components/tv/ClimaCard"
import TvFooter from "@/components/tv/TvFooter"

export default function TvEmpresarial() {
  return (
    <main className="container">

      <div className="grid">
        <MetaCard />
        <ProducaoCard />
        <RankingCard />
        <ComunicadoCard />
        <ClimaCard />
      </div>

      <TvFooter />

      <style jsx>{`
        .container {
          min-height: 100vh;
          background: radial-gradient(circle at center, #101522, #05070d);
          padding: 40px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          color: white;
          font-family: sans-serif;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 25px;
        }

        .tv-card {
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(15px);
          border-radius: 20px;
          padding: 20px;
          box-shadow: 0 0 20px rgba(127,0,255,0.2);
          transition: 0.3s;
        }

        .tv-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 0 30px rgba(127,0,255,0.4);
        }

        .tv-card h3 {
          margin-bottom: 10px;
          background: linear-gradient(90deg, #00f0ff, #7f00ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .destaque {
          border: 2px solid #7f00ff;
        }

        .tv-footer {
          margin-top: 40px;
          background: #111;
          padding: 10px;
          text-align: center;
          font-size: 0.9rem;
          letter-spacing: 1px;
          border-top: 1px solid #7f00ff;
        }
      `}</style>

    </main>
  )
}