"use client"

import MetaCard from "@/app/components/tv/MetaCard"
import ProducaoCard from "@/app/components/tv/ProducaoCard"
import RankingCard from "@/app/components/tv/RankingCard"
import ComunicadoCard from "@/app/components/tv/ComunicadoCard"
import ClimaCard from "@/app/components/tv/ClimaCard"
import TvFooter from "@/app/components/tv/TvFooter"

export default function TvEmpresarial() {
  return (
    <main className="container flex flex-col items-center">

      {/* grid of cards */}
      <div className="w-full max-w-7xl mb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 items-stretch">
        <MetaCard compact />
        <ProducaoCard />
        <RankingCard />
        <ComunicadoCard />
        <ClimaCard />
      </div>

      <TvFooter />

      <style jsx>{`
        .container {
          min-height: 100vh;
          background: #0A0F1C;
          padding: 40px 20px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          color: white;
          font-family: sans-serif;
        }

      `}</style>

    </main>
  )
}