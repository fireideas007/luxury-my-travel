import React from 'react';
import { ShieldCheck, Compass, Anchor, Star, ArrowLeft } from 'lucide-react';

interface AboutUsProps {
  onBackToCatalog: () => void;
}

export const AboutUs: React.FC<AboutUsProps> = ({ onBackToCatalog }) => {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '5rem' }} className="animate-fade-in">
      {/* Back Button */}
      <button 
        onClick={onBackToCatalog}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--color-gold)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          cursor: 'pointer',
          fontSize: '0.9rem',
          marginBottom: '2rem',
          padding: 0
        }}
      >
        <ArrowLeft size={16} />
        <span>Back to Curations</span>
      </button>

      {/* Hero Header */}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '3rem', fontWeight: 300, fontFamily: 'var(--font-serif)', marginBottom: '1rem' }}>
          Luxury My Travel
        </h2>
        <div style={{
          width: '80px',
          height: '2px',
          background: 'var(--grad-gold)',
          margin: '0 auto 1.5rem auto'
        }} />
        <p style={{ fontSize: '1.2rem', color: 'var(--color-gold-light)', fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>
          Curating Elite Experiences for the Discerning Few
        </p>
      </div>

      {/* Main Narrative */}
      <div className="glass-panel" style={{ padding: '3rem', marginBottom: '3rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--color-text-primary)' }}>
          Luxury My Travel is a premier curator of ultra-luxury bespoke travel arrangements, catering exclusively to the elite. We collaborate only with the world’s most prestigious service providers—from private aviation alliances and mega-yacht fleets to 5-star sanctuaries and Michelin-tier dining networks. Every itinerary we design represents the peak of custom hospitality, discretion, and perfection.
        </p>
        <p style={{ fontSize: '1rem', lineHeight: '1.7', color: 'var(--color-text-secondary)' }}>
          Our services bypass standard channels to secure private suite access, personalized culinary curations, and exclusive event access globally. We serve high-profile clients who demand absolute privacy, luxury, and reliability.
        </p>
      </div>

      {/* Pillars of Luxury Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '2rem',
        marginBottom: '4rem'
      }}>
        {/* Pillar 1 */}
        <div className="glass-panel-glow" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--color-border)' }}>
          <Compass size={32} style={{ color: 'var(--color-gold)', marginBottom: '1.25rem' }} />
          <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '0.75rem', fontWeight: 400 }}>Elite Curations</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: '1.6', margin: 0 }}>
            Access to exclusive private jets, first-class connections, and luxury transfers tailored to your strict schedule.
          </p>
        </div>

        {/* Pillar 2 */}
        <div className="glass-panel-glow" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--color-border)' }}>
          <Anchor size={32} style={{ color: 'var(--color-gold)', marginBottom: '1.25rem' }} />
          <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '0.75rem', fontWeight: 400 }}>Sanctuary Stays</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: '1.6', margin: 0 }}>
            Private estates, presidential suites, and private islands closed to the public and reserved for your exclusive stay.
          </p>
        </div>

        {/* Pillar 3 */}
        <div className="glass-panel-glow" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--color-border)' }}>
          <Star size={32} style={{ color: 'var(--color-gold)', marginBottom: '1.25rem' }} />
          <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '0.75rem', fontWeight: 400 }}>Michelin Gastronomy</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: '1.6', margin: 0 }}>
            Bespoke culinary menus, vintage wine lists, and private chef services crafted by world-class culinary masters.
          </p>
        </div>
      </div>

      {/* Corporate & Security Info Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2.5rem',
        marginBottom: '4rem'
      }} className="corporate-notice-grid">
        
        {/* Corporate Entity Notice Box */}
        <div style={{
          background: 'rgba(223, 195, 132, 0.03)',
          border: '1px solid rgba(223, 195, 132, 0.2)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem 2.5rem',
          display: 'flex',
          gap: '1.25rem'
        }} className="corporate-box">
          <ShieldCheck size={28} style={{ color: 'var(--color-gold)', flexShrink: 0, marginTop: '0.15rem' }} />
          <div>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-gold-light)', margin: '0 0 0.5rem 0' }}>
              Corporate & Legal Registry
            </h4>
            <p style={{ fontSize: '1.05rem', color: 'var(--color-text-primary)', margin: '0 0 0.25rem 0', fontWeight: 500 }}>
              Hackproof Technologies India Private Limited
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: '1.5', margin: 0 }}>
              Luxury My Travel is a wholly owned brand and registered luxury service network of Hackproof Technologies India Private Limited. All private arrangements and operations are secure, authenticated, and fully compliant under corporate travel registry standards.
            </p>
          </div>
        </div>

        {/* Security Protocols Notice Box */}
        <div style={{
          background: 'rgba(223, 195, 132, 0.03)',
          border: '1px solid rgba(223, 195, 132, 0.2)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem 2.5rem',
          display: 'flex',
          gap: '1.25rem'
        }} className="corporate-box">
          <ShieldCheck size={28} style={{ color: 'var(--color-gold)', flexShrink: 0, marginTop: '0.15rem' }} />
          <div>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-gold-light)', margin: '0 0 0.5rem 0' }}>
              Elite Security Protocols
            </h4>
            <p style={{ fontSize: '1.05rem', color: 'var(--color-text-primary)', margin: '0 0 0.25rem 0', fontWeight: 500 }}>
              Highest Level Cyber Protection
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: '1.5', margin: 0 }}>
              For application security, we deploy the highest level of security AI agents which perform continuous, realtime security scanning and automated patch application. Additionally, a manual penetration test is carried out twice a month by an experienced <a href="https://bugcrowd.com/adityajanu" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-gold)', textDecoration: 'underline' }}>Bugcrowd Security Researcher</a> to guarantee absolute immunity from threats.
            </p>
          </div>
        </div>

      </div>

      {/* Action Button */}
      <div style={{ textAlign: 'center', marginTop: '4rem' }}>
        <button 
          onClick={onBackToCatalog}
          className="btn-primary"
          style={{ padding: '0.8rem 2.5rem', fontSize: '0.9rem' }}
        >
          Explore Elite Offerings
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .corporate-notice-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
          .corporate-box {
            padding: 1.5rem !important;
            gap: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
};
