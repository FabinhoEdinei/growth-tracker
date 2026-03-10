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

/* ───── Cantos discretos ───── */

const Corner = ({ rotate = 0 }: { rotate?: number }) => (
  <svg viewBox="0 0 60 60" width="40" height="40" style={{ transform:`rotate(${rotate}deg)` }}>
    <path
      d="M5 55 C5 20 20 5 55 5"
      fill="none"
      stroke="#8B6914"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <circle cx="8" cy="52" r="3" fill="#8B6914"/>
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

<div className="page">

{/* BOTÃO */}

<div className="top">
<Link href="/jornal" className="btn">← VOLTAR AO JORNAL</Link>
</div>

{/* QUADRO */}

<div className="frame">

<div className="corner tl"><Corner/></div>
<div className="corner tr"><Corner rotate={90}/></div>
<div className="corner bl"><Corner rotate={-90}/></div>
<div className="corner br"><Corner rotate={180}/></div>

{/* PAPEL */}

<div className="paper">

<div className="content">

<div className="header">

<div className="orn">◆ ◆ ◆</div>

<div className="label">
<span>{cfg.icon}</span>
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
<div className="excerpt">{post.excerpt}</div>
)}

<div
className="jornal-content"
dangerouslySetInnerHTML={{ __html: post.content }}
/>

<div className="footer">❖ ❖ ❖</div>

</div>
</div>
</div>

</div>

<style>{`

.page{
min-height:100vh;
background:linear-gradient(135deg,#E8DCC4,#D4C4A8);
padding:14px;
}

/* botão */

.top{
text-align:center;
margin-bottom:14px;
}

.btn{
padding:8px 26px;
background:linear-gradient(180deg,#8B6914,#6B4423);
border:2px solid #3E2723;
border-radius:4px;
color:#F4E8C1;
font-family:Georgia,serif;
font-size:12px;
letter-spacing:2px;
text-decoration:none;
box-shadow:0 3px 8px rgba(0,0,0,0.4);
}

/* moldura */

.frame{
position:relative;
max-width:760px;
margin:auto;
padding:10px;

background:
linear-gradient(145deg,#6B4423,#4A3728);

border:8px solid #5a3a23;

box-shadow:
0 10px 30px rgba(0,0,0,0.5),
inset 0 2px 3px rgba(255,255,255,0.15),
inset 0 -4px 8px rgba(0,0,0,0.5);
}

/* textura madeira */

.frame::before{
content:"";
position:absolute;
inset:0;

background:
repeating-linear-gradient(
90deg,
rgba(255,255,255,0.03),
rgba(255,255,255,0.03) 2px,
transparent 2px,
transparent 6px
);
pointer-events:none;
}

/* cantos */

.corner{
position:absolute;
opacity:0.7;
}

.tl{top:4px;left:4px}
.tr{top:4px;right:4px}
.bl{bottom:4px;left:4px}
.br{bottom:4px;right:4px}

/* papel */

.paper{
background:
linear-gradient(160deg,#FAF6EC,#F5EFDD);

padding:34px 28px;

box-shadow:
inset 0 0 40px rgba(139,105,20,0.08);
}

/* conteúdo */

.header{
text-align:center;
margin-bottom:24px;
}

.orn{
font-size:10px;
letter-spacing:8px;
color:rgba(139,105,20,0.4);
margin-bottom:14px;
}

.label{
display:flex;
justify-content:center;
gap:10px;
margin-bottom:12px;
}

.type{
font-family:Georgia,serif;
font-size:9px;
font-weight:bold;
letter-spacing:3px;
}

h1{
font-family:Georgia,serif;
font-size:clamp(22px,4vw,28px);
color:#2C1810;
margin:14px 0;
}

.date{
font-family:Georgia,serif;
font-size:12px;
font-style:italic;
color:rgba(62,39,35,0.6);
}

.divider{
height:1px;
background:linear-gradient(90deg,transparent,#8B691440,transparent);
margin:22px 0;
}

.excerpt{
border-left:3px solid #8B6914;
padding-left:14px;
margin-bottom:24px;
font-style:italic;
color:rgba(62,39,35,0.7);
line-height:1.7;
}

.footer{
text-align:center;
margin-top:36px;
font-size:10px;
letter-spacing:6px;
color:rgba(139,105,20,0.3);
}

/* texto */

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