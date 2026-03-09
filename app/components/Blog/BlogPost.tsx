'use client';

import React from 'react';
import styles from './BlogPost.module.css';

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
    <article className={styles.blogPost}>
      <header className={styles.postHeader}>
        <span className={styles.postCategory}>{metadata.category}</span>
        <h1 className={styles.postTitle}>{metadata.title}</h1>
        <div className={styles.postMeta}>
          <span className={styles.postAuthor}>Por {metadata.author}</span>
          <span className={styles.postSeparator}>•</span>
          <span className={styles.postDate}>
            {new Date(metadata.date).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric'
            })}
          </span>
        </div>
      </header>

      <div 
        className={styles.postContent}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </article>
  );
};
