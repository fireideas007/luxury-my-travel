import React, { useState } from 'react';
import { Menu, X, Landmark, User, UserCheck } from 'lucide-react';
import type { UserAccount } from '../data/mockData';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  itineraryCount: number;
  currentUser: UserAccount | null;
  onOpenAuth: () => void;
  currentCurrency: string;
  setCurrentCurrency: (currency: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  itineraryCount,
  currentUser,
  onOpenAuth,
  currentCurrency,
  setCurrentCurrency
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'explore', label: 'Explore Curations' },
    { id: 'concierge', label: 'Bespoke Concierge' },
    { id: 'blog', label: 'Editorial Magazine' },
    { id: 'itinerary', label: 'My Itinerary' }
  ];

  return (
    <nav className="glass-panel" style={{
      position: 'sticky',
      top: '1rem',
      zIndex: 100,
      margin: '1rem auto',
      width: 'calc(100% - 2rem)',
      maxWidth: '1400px',
      padding: '0.75rem 2rem',
      borderRadius: 'var(--radius-lg)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('explore')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
        >
          <Landmark size={24} style={{ color: 'var(--color-gold)' }} />
          <span style={{ 
            fontFamily: 'var(--font-serif)', 
            fontSize: '1.5rem', 
            fontWeight: 600, 
            letterSpacing: '0.03em' 
          }}>
            Luxury <span className="luxury-text-gradient">My Travel</span>
          </span>
        </div>

        {/* Desktop Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="desktop-only">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === item.id ? 'var(--color-gold)' : 'var(--color-text-secondary)',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.9rem',
                fontWeight: 500,
                cursor: 'pointer',
                padding: '0.5rem 0',
                borderBottom: activeTab === item.id ? '2px solid var(--color-gold)' : '2px solid transparent',
                transition: 'var(--transition-smooth)',
                position: 'relative'
              }}
            >
              {item.label}
              {item.id === 'itinerary' && itineraryCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-0.25rem',
                  right: '-1.25rem',
                  background: 'var(--grad-gold)',
                  color: '#060608',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.5)'
                }}>
                  {itineraryCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Currency Selector */}
          <select
            value={currentCurrency}
            onChange={(e) => setCurrentCurrency(e.target.value)}
            style={{
              background: '#09090c',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-primary)',
              padding: '0.45rem 0.5rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              fontWeight: 500,
              cursor: 'pointer',
              outline: 'none',
              transition: 'var(--transition-smooth)'
            }}
            className="desktop-only"
          >
            <option value="USD">$ USD</option>
            <option value="INR">₹ INR</option>
            <option value="EUR">€ EUR</option>
            <option value="GBP">£ GBP</option>
            <option value="AED">AED AED</option>
            <option value="CAD">C$ CAD</option>
            <option value="AUD">A$ AUD</option>
          </select>

          {currentUser ? (
            <button
              onClick={onOpenAuth}
              className="btn-secondary"
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                borderColor: 'rgba(223, 195, 132, 0.4)',
                color: 'var(--color-gold)'
              }}
            >
              {currentUser.avatarUrl ? (
                <img 
                  src={currentUser.avatarUrl} 
                  alt={currentUser.username} 
                  style={{ width: '18px', height: '18px', borderRadius: '50%', objectFit: 'cover' }} 
                />
              ) : (
                <UserCheck size={16} />
              )}
              <span className="desktop-only">{currentUser.username.split(' ')[0]} ✦ Onyx</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="btn-secondary"
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <User size={16} />
              <span className="desktop-only">Membership Sign In</span>
            </button>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-primary)',
              cursor: 'pointer',
              display: 'none'
            }}
            className="mobile-toggle"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          padding: '1.5rem 0 1rem 0',
          borderTop: '1px solid var(--color-border)',
          marginTop: '0.75rem'
        }}>
          {/* Mobile Currency Selector */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Currency</span>
            <select
              value={currentCurrency}
              onChange={(e) => {
                setCurrentCurrency(e.target.value);
                setMobileMenuOpen(false);
              }}
              style={{
                background: '#09090c',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
                padding: '0.4rem 0.5rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: 500,
                outline: 'none'
              }}
            >
              <option value="USD">$ USD</option>
              <option value="INR">₹ INR</option>
              <option value="EUR">€ EUR</option>
              <option value="GBP">£ GBP</option>
              <option value="AED">AED AED</option>
              <option value="CAD">C$ CAD</option>
              <option value="AUD">A$ AUD</option>
            </select>
          </div>

          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === item.id ? 'var(--color-gold)' : 'var(--color-text-secondary)',
                fontFamily: 'var(--font-sans)',
                fontSize: '1rem',
                fontWeight: 500,
                textAlign: 'left',
                padding: '0.5rem 0',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span>{item.label}</span>
              {item.id === 'itinerary' && itineraryCount > 0 && (
                <span style={{
                  background: 'var(--grad-gold)',
                  color: '#060608',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '0.1rem 0.5rem',
                  borderRadius: '10px'
                }}>
                  {itineraryCount}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Adding custom responsive styles to global styles eventually, but keeping simple styling here too */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-only {
            display: none !important;
          }
          .mobile-toggle {
            display: block !important;
          }
        }
      `}</style>
    </nav>
  );
};
