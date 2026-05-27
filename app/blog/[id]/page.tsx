import React from 'react';
import { initialBlogPosts } from '../../../src/data/blogData';
import { ArrowLeft, Clock, Calendar, User } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: any }) {
  const resolvedParams = await params;
  const post = initialBlogPosts.find(p => p.id === resolvedParams.id);
  if (!post) return {};
  return {
    title: `${post.title} | Luxury My Travel Magazine`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: [{ url: post.image }],
    }
  };
}

export default async function BlogPostPage({ params }: { params: any }) {
  const resolvedParams = await params;
  const post = initialBlogPosts.find(p => p.id === resolvedParams.id);
  if (!post) {
    notFound();
  }

  return (
    <div className="luxury-container animate-fade-in" style={{ marginTop: '3rem', maxWidth: '800px' }}>
      <Link href="/blog" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
        <ArrowLeft size={16} />
        Back to Magazine
      </Link>
      
      <article>
        <img 
          src={post.image} 
          alt={post.title} 
          style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: 'var(--radius-lg)', marginBottom: '2rem' }} 
        />
        
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Calendar size={14} />
            {post.publishedDate}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <User size={14} />
            {post.author}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Clock size={14} />
            {post.readTime}
          </span>
        </div>
        
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: 'var(--color-text-primary)', marginBottom: '1.5rem', lineHeight: '1.2' }}>
          {post.title}
        </h1>
        
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {post.tags.map(tag => (
            <span key={tag} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)', color: 'var(--color-gold-light)', padding: '0.2rem 0.6rem', borderRadius: '30px', fontSize: '0.75rem' }}>
              #{tag}
            </span>
          ))}
        </div>
        
        <div 
          style={{ 
            color: 'var(--color-text-secondary)', 
            fontSize: '1.05rem', 
            lineHeight: '1.8', 
            whiteSpace: 'pre-line',
            fontFamily: 'var(--font-sans)'
          }}
        >
          {post.content}
        </div>
      </article>
    </div>
  );
}
