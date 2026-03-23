// app/blog/page.tsx (ou onde estiver sua listagem de posts)
// Exemplo de integração — adapte ao seu arquivo atual

import { getT } from '@/lib/getT';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

interface Post {
  slug:    string;
  title:   string;
  date:    string;
  excerpt: string;
  tags?:   string[];
}

function getAllPosts(): Post[] {
  const dirs = [
    path.join(process.cwd(), 'app/content/posts'),
    path.join(process.cwd(), 'app/content/post'),
  ];
  const posts: Post[] = [];
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    fs.readdirSync(dir).filter(f=>f.endsWith('.md')).forEach(f => {
      const { data } = matter(fs.readFileSync(path.join(dir,f),'utf8'));
      posts.push({
        slug:    data.slug || f.replace('.md',''),
        title:   data.title || '',
        date:    data.date  || new Date().toISOString(),
        excerpt: data.excerpt || '',
        tags:    data.tags,
      });
    });
  }
  return posts.sort((a,b)=>new Date(b.date).getTime()-new Date(a.date).getTime());
}

export default async function BlogPage() {
  const t     = await getT();          // ✅ lê cookie no servidor
  const posts = getAllPosts();

  const formatDate = (d: string) => {
    try { return new Date(d).toLocaleDateString(t.datas.locale, { day:'2-digit', month:'short', year:'numeric' }); }
    catch { return d; }
  };

  return (
    <div style={{ minHeight:'100vh', background:'#06040f', color:'#e8e4f4', fontFamily:"-apple-system,sans-serif" }}>

      {/* Header */}
      <div style={{ padding:'24px 18px 16px', borderBottom:'1px solid rgba(255,255,255,.07)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', maxWidth:680, margin:'0 auto' }}>
          <div>
            {/* ✅ "Blog" traduzido */}
            <h1 style={{ margin:0, fontSize:22, fontWeight:900, color:'#fff', fontFamily:"'Courier New',monospace", letterSpacing:2 }}>
              📝 {t.blog.titulo}
            </h1>
            <div style={{ fontSize:9, color:'rgba(255,255,255,.35)', marginTop:3, letterSpacing:2, fontFamily:"'Courier New',monospace" }}>
              {posts.length} {t.blog.titulo.toLowerCase()}
            </div>
          </div>
          <Link href="/" style={{ fontSize:11, color:'rgba(255,255,255,.4)', textDecoration:'none', padding:'6px 14px', border:'1px solid rgba(255,255,255,.1)', borderRadius:10 }}>
            {t.comum.voltar}
          </Link>
        </div>
      </div>

      {/* Lista de posts */}
      <div style={{ maxWidth:680, margin:'0 auto', padding:'16px 18px 60px' }}>
        {posts.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px 0', color:'rgba(255,255,255,.3)', fontFamily:"'Courier New',monospace", fontSize:12 }}>
            {t.blog.semPosts}
          </div>
        ) : (
          posts.map((post, i) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration:'none', display:'block', marginBottom:12 }}>
              <div style={{
                padding:'16px 18px',
                background:'rgba(255,255,255,.03)',
                border:'1px solid rgba(255,255,255,.07)',
                borderRadius:14,
                transition:'all .2s',
                animation:`fadeUp .4s ${i*.04}s ease backwards`,
              }}
                onMouseEnter={e=>{ (e.currentTarget as HTMLElement).style.background='rgba(255,255,255,.06)'; (e.currentTarget as HTMLElement).style.borderColor='rgba(168,85,247,.3)'; }}
                onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.background='rgba(255,255,255,.03)'; (e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,.07)'; }}
              >
                {/* Data e tags */}
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                  {/* ✅ Data formatada no locale correto */}
                  <span style={{ fontSize:10, color:'rgba(255,255,255,.35)', fontFamily:"'Courier New',monospace" }}>
                    {t.blog.publicadoEm} {formatDate(post.date)}
                  </span>
                  {post.tags?.slice(0,2).map(tag=>(
                    <span key={tag} style={{ fontSize:8, padding:'2px 7px', background:'rgba(168,85,247,.15)', border:'1px solid rgba(168,85,247,.25)', borderRadius:10, color:'#c084fc', fontFamily:"'Courier New',monospace" }}>{tag}</span>
                  ))}
                </div>

                <h2 style={{ margin:'0 0 6px', fontSize:14, fontWeight:700, color:'rgba(255,255,255,.88)', lineHeight:1.3 }}>{post.title}</h2>

                {post.excerpt && (
                  <p style={{ margin:'0 0 10px', fontSize:12, color:'rgba(255,255,255,.45)', lineHeight:1.6, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                    {post.excerpt}
                  </p>
                )}

                {/* ✅ "Ler mais →" traduzido */}
                <div style={{ fontSize:10, color:'#a855f7', fontFamily:"'Courier New',monospace", fontWeight:700, letterSpacing:1 }}>
                  {t.blog.lerMais}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}
