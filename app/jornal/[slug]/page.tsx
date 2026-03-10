import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getJornalPost } from '@/app/lib/content-loader'
import { JornalPageWrapper } from '@/app/components/Jornal/JornalPageWrapper'

const typeConfig: Record<string, { label: string; icon: string; accent: string }> = {
  fabio: { label: 'AVENTURAS DE FABIO', icon: '🤠', accent: '#8B4513' },
  claudia: { label: 'DIÁRIO DE CLÁUDIA', icon: '🌸', accent: '#9B7B2B' },
  publicidade: { label: 'ANÚNCIO ESPECIAL', icon: '✨', accent: '#8B2020' },
  fatos: { label: 'FATOS DO DIA', icon: '📰', accent: '#3B5050' },
  lugares: { label: 'TERRAS EXPLORADAS', icon: '🗺️', accent: '#4B5E2A' },
}

/* ───────── CANTOS BARROCOS ───────── */

const CornerOrnament = ({ rotate = 0 }: { rotate?: number }) => (
  <svg viewBox="0 0 120 120" width="120" height="120" style={{ transform: `rotate(${rotate}deg)` }}>
    <defs>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F4E8C1"/>
        <stop offset="40%" stopColor="#DAA520"/>
        <stop offset="70%" stopColor="#B8860B"/>
        <stop offset="100%" stopColor="#6E4F1F"/>
      </linearGradient>
    </defs>

    <path
      d="M10 10 C40 -10 90 10 110 40
         C95 50 80 70 60 95
         C40 80 20 70 10 40 Z"
      fill="url(#goldGrad)"
      stroke="#5D4E37"
      strokeWidth="1"
    />

    <circle cx="65" cy="60" r="8" fill="#8B6914"/>
    <circle cx="65" cy="60" r="3" fill="#3E2723"/>

    <path
      d="M40 30 C60 20 90 40 80 60"
      stroke="#5D4E37"
      strokeWidth="2"
      fill="none"
    />

    <path
      d="M25 55 C40 45 50 65 40 80"
      stroke="#5D4E37"
      strokeWidth="2"
      fill="none"
    />
  </svg>
)

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {

  const { slug } = await params
  if (!slug || slug === 'undefined') notFound()

  const post = await getJornalPost(slug)
  if (!post) notFound()

  const cfg = typeConfig[post.type] ?? typeConfig['fatos']

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })

  return (
    <JornalPageWrapper>

      <div className="page-bg">

        {/* BOTÃO SUPERIOR */}

        <div className="top-btn">
          <Link href="/jornal" className="btn-wood">
            ← Voltar ao Jornal
          </Link>
        </div>

        {/* MOLDURA */}

        <div className="frame">

          <div className="corner tl"><CornerOrnament/></div>
          <div className="corner tr"><CornerOrnament rotate={90}/></div>
          <div className="corner bl"><CornerOrnament rotate={-90}/></div>
          <div className="corner br"><CornerOrnament rotate={180}/></div>

          {/* PAPEL */}

          <div className="paper">

            <div className="paper-texture"/>

            <div className="content">

              <div className="header">

                <div className="ornament">◆ ◆ ◆</div>

                <div className="label">
                  <span className="icon">{cfg.icon}</span>
                  <span className="type">{cfg.label}</span>
                </div>

                <h1>{post.title}</h1>

                <div className="date">
                  {formatDate(post.date)}
                  {post.character && <span> — {post.character}</span>}
                </div>

              </div>

              <div className="divider"/>

              {post.excerpt && (
                <div className="excerpt">
                  {post.excerpt}
                </div>
              )}

              <div
                className="jornal-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              <div className="footer-orn">❖ ❖ ❖</div>

            </div>

          </div>

        </div>

        {/* BOTÃO INFERIOR */}

        <div className="bottom-btn">
          <Link href="/jornal">← Voltar ao Jornal</Link>
        </div>

      </div>

<style>{`

.page-bg{
min-height:100vh;
background:linear-gradient(135deg,#E8DCC4,#D4C4A8,#C9B896);
padding:20px 16px 40px;
}

/* BOTÃO */

.btn-wood{
display:inline-block;
padding:10px 32px;
background:linear-gradient(180deg,#8B6914,#6B4423,#4A3728);
border:2px solid #3E2723;
border-radius:4px;
color:#F4E8C1;
font-family:Georgia,serif;
font-size:12px;
font-weight:bold;
letter-spacing:3px;
text-decoration:none;
text-transform:uppercase;
box-shadow:
0 3px 8px rgba(0,0,0,0.4),
inset 0 1px 0 rgba(255,255,255,0.2);
}

.top-btn{text-align:center;margin-bottom:24px}
.bottom-btn{text-align:center;margin-top:28px}

/* MOLDURA */

.frame{
max-width:760px;
margin:auto;
position:relative;
padding:26px;

background:
linear-gradient(145deg,#7a5230,#5b3a22 40%,#3a2315);

border:16px solid #5a3a23;

box-shadow:
0 20px 50px rgba(0,0,0,0.6),
inset 0 2px 4px rgba(255,255,255,0.15),
inset 0 -8px 16px rgba(0,0,0,0.6);

}

/* TEXTURA MADEIRA */

.frame::before{
content:"";
position:absolute;
inset:0;

background:
repeating-linear-gradient(
90deg,
rgba(255,255,255,0.04),
rgba(255,255,255,0.04) 2px,
transparent 2px,
transparent 6px
);

pointer-events:none;
}

/* ENTALHE INTERNO */

.frame::after{
content:"";
position:absolute;
inset:14px;
border:5px solid #3a2416;

box-shadow:
inset 0 0 15px rgba(0,0,0,0.6),
inset 0 0 35px rgba(0,0,0,0.4);

pointer-events:none;
}

/* CANTOS */

.corner{
position:absolute;
z-index:10;
}

.tl{top:-10px;left:-10px}
.tr{top:-10px;right:-10px}
.bl{bottom:-10px;left:-10px}
.br{bottom:-10px;right:-10px}

/* PAPEL */

.paper{
background:
linear-gradient(160deg,#FAF6EC,#F5EFDD,#F0E8D0);
padding:48px 42px 56px;
position:relative;

box-shadow:
inset 0 0 60px rgba(139,105,20,0.08);
}

.paper-texture{
position:absolute;
inset:0;

background-image:
repeating-linear-gradient(
0deg,
transparent,
transparent 24px,
rgba(139,105,20,0.03) 24px,
rgba(139,105,20,0.03) 25px
);

pointer-events:none;
}

.content{position:relative;z-index:2}

/* HEADER */

.header{text-align:center;margin-bottom:32px}

.ornament{
font-size:10px;
letter-spacing:8px;
color:rgba(139,105,20,0.4);
margin-bottom:16px;
}

.label{
display:flex;
justify-content:center;
align-items:center;
gap:10px;
margin-bottom:16px;
}

.type{
font-family:Georgia,serif;
font-size:9px;
font-weight:bold;
letter-spacing:3px;
text-transform:uppercase;
}

.header h1{
font-family:Georgia,serif;
font-size:clamp(22px,4vw,28px);
color:#2C1810;
margin:20px 0 12px;
}

.date{
font-family:Georgia,serif;
font-size:12px;
font-style:italic;
color:rgba(62,39,35,0.6);
}

/* DIVIDER */

.divider{
height:1px;
background:linear-gradient(90deg,transparent,#8B691450,transparent);
margin:24px 0 28px;
}

.excerpt{
border-left:3px solid #8B6914;
padding-left:16px;
margin-bottom:28px;
font-style:italic;
color:rgba(62,39,35,0.7);
line-height:1.7;
}

/* FOOTER */

.footer-orn{
text-align:center;
margin-top:48px;
font-size:10px;
letter-spacing:8px;
color:rgba(139,105,20,0.3);
}

/* TEXTO */

.jornal-content{
font-family:Georgia,serif;
font-size:15px;
line-height:1.85;
color:#3E2723;
}

.jornal-content p{
margin-bottom:18px;
text-align:justify;
}

`}</style>

    </JornalPageWrapper>
  )
}