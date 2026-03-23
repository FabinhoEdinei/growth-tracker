// app/components/Jornal/NewspaperHeader.tsx
// Server Component — sem styled-jsx, sem 'use client'
// CSS via NewspaperHeader.module.css

import Link from 'next/link';
import { getT } from '@/lib/getT';
import styles from './NewspaperHeader.module.css';

interface NewspaperHeaderProps {
  paginaAtual?:  number;
  totalPaginas?: number;
  totalPosts?:   number;
}

export async function NewspaperHeader({
  paginaAtual  = 1,
  totalPaginas = 1,
  totalPosts   = 0,
}: NewspaperHeaderProps) {
  const t = await getT();

  const temAnterior = paginaAtual > 1;
  const temProxima  = paginaAtual < totalPaginas;
  const mostraNave  = totalPaginas > 1;

  const dataFormatada = new Date().toLocaleDateString(t.datas.locale, {
    weekday:'long', year:'numeric', month:'long', day:'numeric',
  });

  return (
    <header className={styles.header}>

      {/* Cantos SVG */}
      <svg className={`${styles.corner} ${styles.topLeft}`} viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="glTL" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F4E4A6"/><stop offset="50%" stopColor="#DAA520"/><stop offset="100%" stopColor="#B8941F"/>
          </linearGradient>
        </defs>
        <path d="M0,30 L0,0 L30,0" fill="none" stroke="url(#glTL)" strokeWidth="3" strokeLinecap="round"/>
        <path d="M0,20 L0,0 L20,0" fill="none" stroke="url(#glTL)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
        <circle cx="8" cy="8" r="2" fill="url(#glTL)"/>
        <circle cx="25" cy="5" r="1" fill="url(#glTL)"/>
        <circle cx="5" cy="25" r="1" fill="url(#glTL)"/>
      </svg>

      <svg className={`${styles.corner} ${styles.topRight}`} viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="glTR" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F4E4A6"/><stop offset="50%" stopColor="#DAA520"/><stop offset="100%" stopColor="#B8941F"/>
          </linearGradient>
        </defs>
        <path d="M70,0 L100,0 L100,30" fill="none" stroke="url(#glTR)" strokeWidth="3" strokeLinecap="round"/>
        <path d="M80,0 L100,0 L100,20" fill="none" stroke="url(#glTR)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
        <circle cx="92" cy="8" r="2" fill="url(#glTR)"/>
      </svg>

      <svg className={`${styles.corner} ${styles.bottomLeft}`} viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="glBL" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F4E4A6"/><stop offset="50%" stopColor="#DAA520"/><stop offset="100%" stopColor="#B8941F"/>
          </linearGradient>
        </defs>
        <path d="M0,70 L0,100 L30,100" fill="none" stroke="url(#glBL)" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="8" cy="92" r="2" fill="url(#glBL)"/>
      </svg>

      <svg className={`${styles.corner} ${styles.bottomRight}`} viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="glBR" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#F4E4A6"/><stop offset="50%" stopColor="#DAA520"/><stop offset="100%" stopColor="#B8941F"/>
          </linearGradient>
        </defs>
        <path d="M70,100 L100,100 L100,70" fill="none" stroke="url(#glBR)" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="92" cy="92" r="2" fill="url(#glBR)"/>
      </svg>

      {/* Título */}
      <h1 className={styles.title}>{t.jornal.titulo}</h1>

      {/* Meta */}
      <div className={styles.meta}>
        <span>{t.jornal.subtitulo}</span>
        <span>{dataFormatada}</span>
        <span className={styles.edition}>{t.jornal.edicaoNum} {Math.floor(Date.now()/86400000)}</span>
      </div>

      {/* Navegação ou Gratuito */}
      {mostraNave ? (
        <div className={styles.navBar}>
          {temAnterior
            ? <Link href={paginaAtual===2?'/jornal':`/jornal?pagina=${paginaAtual-1}`} className={styles.btn}>{t.comum.anterior}</Link>
            : <Link href="/" className={styles.btnFade}>{t.comum.home}</Link>
          }

          <div className={styles.dots}>
            <span className={styles.dotsLabel}>◆ {t.comum.pagina} {paginaAtual}/{totalPaginas} · {totalPosts} {t.jornal.arquivo} ◆</span>
            <div className={styles.dotsRow}>
              {Array.from({ length:totalPaginas },(_,i)=>i+1).map(p=>(
                <Link key={p} href={p===1?'/jornal':`/jornal?pagina=${p}`}
                  className={p===paginaAtual ? styles.dotActive : styles.dot}
                />
              ))}
            </div>
          </div>

          {temProxima
            ? <Link href={`/jornal?pagina=${paginaAtual+1}`} className={styles.btn}>{t.comum.proximo}</Link>
            : <Link href="/" className={styles.btnFade}>{t.comum.home}</Link>
          }
        </div>
      ) : (
        <div className={`${styles.navBar} ${styles.navGratuito}`}>
          <Link href="/" className={styles.btnFade}>{t.comum.home}</Link>
          <span className={styles.price}>{t.comum.gratuito}</span>
          <span className={styles.btnFade} style={{ opacity:0 }}>—</span>
        </div>
      )}

      <div className={styles.ornament}>♦ ♦ ♦ ♦ ♦ ♦ ♦ ♦ ♦</div>
    </header>
  );
}
