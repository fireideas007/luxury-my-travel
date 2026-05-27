'use client';

import React from 'react';
import { Hero } from '../src/components/Hero';
import { ItemGrid } from '../src/components/ItemGrid';
import { useAppContext } from '../src/context/AppContext';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function HomePage() {
  const {
    filteredItems,
    currentCategory,
    setCurrentCategory,
    setSearchQuery,
    setSearchLocation,
    handleSearch,
    handleAddToItinerary,
    formatPrice,
    itinerary,
    triggerApiLog
  } = useAppContext();

  const router = useRouter();

  const handleSelectItem = (item: any) => {
    // Navigate to the dynamic curation detail page
    router.push(`/curation/${item.data.id}`);
  };

  return (
    <>
      <Hero onSearch={handleSearch} triggerApiLog={triggerApiLog} />
      
      {/* Recommendations Grid Wrapper */}
      <div id="recommendations-grid" className="luxury-container animate-fade-in" style={{ marginTop: '2rem' }}>
        
        {/* Grid Segment filter headers */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          marginBottom: '3rem',
          flexWrap: 'wrap'
        }}>
          {[
            { id: 'all', label: 'All Curations' },
            { id: 'travel', label: 'Travel' },
            { id: 'stay', label: 'Stays' },
            { id: 'food', label: 'Food & Dining' },
            { id: 'experience', label: 'Experiences' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setCurrentCategory(cat.id);
                setSearchQuery('');
                setSearchLocation('');
              }}
              style={{
                background: currentCategory === cat.id ? 'var(--grad-gold)' : 'transparent',
                border: currentCategory === cat.id ? 'none' : '1px solid var(--color-border)',
                color: currentCategory === cat.id ? '#060608' : 'var(--color-text-secondary)',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.85rem',
                fontWeight: 600,
                padding: '0.6rem 1.5rem',
                borderRadius: '30px',
                cursor: 'pointer',
                transition: 'var(--transition-smooth)',
                boxShadow: currentCategory === cat.id ? '0 4px 10px rgba(223, 195, 132, 0.2)' : 'none'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <ItemGrid 
          items={filteredItems}
          onAddToItinerary={handleAddToItinerary}
          onSelectItem={handleSelectItem}
          triggerApiLog={triggerApiLog}
          formatPrice={formatPrice}
          itinerary={itinerary}
        />
      </div>
      
      {/* Showcase details area */}
      <section className="glass-panel" style={{
        margin: '6rem auto 3rem auto',
        width: 'calc(100% - 4rem)',
        maxWidth: '1200px',
        padding: '3.5rem',
        borderRadius: 'var(--radius-xl)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(ellipse at center, rgba(223, 195, 132, 0.04) 0%, rgba(6, 6, 8, 0) 70%)',
          zIndex: -1
        }} />
        <ShieldCheck size={40} style={{ color: 'var(--color-gold)', marginBottom: '1.5rem' }} />
        <h3 style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', marginBottom: '1rem', fontWeight: 400 }}>
          Fortified Banking-Grade Autonomous AI Security Shield
        </h3>
        <p style={{ color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '0.95rem' }}>
          Luxury My Travel operates under the highest level of banking-grade AI security protocols, featuring automated realtime vulnerability scanning, instant threat patching, and continuous encryption to guarantee absolute privacy and security.
        </p>
        <Link 
          href="/concierge"
          className="btn-primary"
          style={{ fontSize: '0.85rem', padding: '0.8rem 2rem', gap: '0.5rem', marginTop: '2rem' }}
        >
          <span>Consult Luxury My Travel Concierge</span>
          <ArrowRight size={14} />
        </Link>
      </section>
    </>
  );
}
