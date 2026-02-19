'use client';

interface BlogPostProps {
  content: string;
  metadata: {
    title: string;
    date: string;
    author: string;
    category: string;
  };
}

export const BlogPost: React.FC<BlogPostProps> = ({ content, metadata }) => {
  return (
    <article className="blog-post">
      {/* Header do post */}
      <header className="post-header">
        <span className="post-category">{metadata.category}</span>
        <h1 className="post-title">{metadata.title}</h1>
        <div className="post-meta">
          <span className="post-author">Por {metadata.author}</span>
          <span className="post-separator">•</span>
          <span className="post-date">
            {new Date(metadata.date).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric'
            })}
          </span>
        </div>
      </header>

      {/* Conteúdo markdown renderizado */}
      <div 
        className="post-content"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      <style jsx>{`
        .blog-post {
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 20px 80px;
        }

        .post-header {
          text-align: center;
          margin-bottom: 40px;
          padding-bottom: 30px;
          border-bottom: 2px solid rgba(0,255,255,0.2);
        }

        .post-category {
          display: inline-block;
          font-size: 11px;
          font-family: 'Courier New', monospace;
          letter-spacing: 2px;
          color: #ff0066;
          background: rgba(255,0,102,0.15);
          padding: 6px 14px;
          border-radius: 4px;
          border: 1px solid rgba(255,0,102,0.3);
          margin-bottom: 20px;
        }

        .post-title {
          font-family: 'Orbitron', monospace;
          font-size: 36px;
          font-weight: 900;
          color: rgba(255,255,255,0.95);
          margin: 0 0 16px 0;
          line-height: 1.3;
          text-shadow: 0 0 20px rgba(0,255,255,0.3);
        }

        .post-meta {
          font-family: 'Courier New', monospace;
          font-size: 12px;
          color: rgba(255,255,255,0.5);
          letter-spacing: 1px;
        }

        .post-author {
          color: rgba(0,255,255,0.7);
        }

        .post-separator {
          margin: 0 10px;
          opacity: 0.3;
        }

        .post-content {
          color: rgba(255,255,255,0.85);
          line-height: 1.8;
          font-size: 16px;
        }

        /* Estilos do markdown */
        :global(.post-content h1) {
          font-family: 'Orbitron', monospace;
          font-size: 32px;
          color: #00ffff;
          margin: 40px 0 20px;
          padding-bottom: 12px;
          border-bottom: 2px solid rgba(0,255,255,0.2);
        }

        :global(.post-content h2) {
          font-family: 'Orbitron', monospace;
          font-size: 26px;
          color: rgba(255,255,255,0.95);
          margin: 32px 0 16px;
        }

        :global(.post-content h3) {
          font-size: 20px;
          color: rgba(255,255,255,0.9);
          margin: 24px 0 12px;
        }

        :global(.post-content p) {
          margin: 16px 0;
        }

        :global(.post-content a) {
          color: #00ffff;
          text-decoration: none;
          border-bottom: 1px solid rgba(0,255,255,0.3);
          transition: all 0.2s;
        }

        :global(.post-content a:hover) {
          color: #ff00ff;
          border-bottom-color: rgba(255,0,255,0.5);
          text-shadow: 0 0 10px rgba(255,0,255,0.3);
        }

        :global(.post-content code) {
          font-family: 'Courier New', monospace;
          background: rgba(0,255,255,0.1);
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 14px;
          color: #00ffff;
        }

        :global(.post-content pre) {
          background: rgba(0,0,0,0.5);
          border: 1px solid rgba(0,255,255,0.2);
          border-radius: 8px;
          padding: 20px;
          overflow-x: auto;
          margin: 20px 0;
        }

        :global(.post-content pre code) {
          background: none;
          padding: 0;
          color: rgba(255,255,255,0.85);
        }

        :global(.post-content blockquote) {
          border-left: 3px solid #ff0066;
          padding-left: 20px;
          margin: 20px 0;
          color: rgba(255,255,255,0.7);
          font-style: italic;
        }

        :global(.post-content table) {
          width: 100%;
          border-collapse: collapse;
          margin: 24px 0;
        }

        :global(.post-content th) {
          background: rgba(0,255,255,0.1);
          border: 1px solid rgba(0,255,255,0.2);
          padding: 12px;
          text-align: left;
          font-family: 'Courier New', monospace;
          font-size: 12px;
          letter-spacing: 2px;
          color: #00ffff;
        }

        :global(.post-content td) {
          border: 1px solid rgba(255,255,255,0.1);
          padding: 12px;
          font-size: 14px;
        }

        :global(.post-content ul, .post-content ol) {
          margin: 16px 0;
          padding-left: 30px;
        }

        :global(.post-content li) {
          margin: 8px 0;
        }

        :global(.post-content hr) {
          border: none;
          border-top: 2px solid rgba(0,255,255,0.2);
          margin: 40px 0;
        }

        @media (max-width: 768px) {
          .blog-post {
            padding: 30px 15px 60px;
          }

          .post-title {
            font-size: 26px;
          }

          :global(.post-content h1) {
            font-size: 24px;
          }

          :global(.post-content h2) {
            font-size: 20px;
          }

          :global(.post-content) {
            font-size: 15px;
          }
        }
      `}</style>
    </article>
  );
};