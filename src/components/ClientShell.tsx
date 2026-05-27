'use client';

import React from 'react';
import { Navbar } from './Navbar';
import { MembershipModal } from './MembershipModal';
import { useAppContext } from '../context/AppContext';
import { Plane, X } from 'lucide-react';
import Link from 'next/link';

export const ClientShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    itinerary,
    currentUser,
    isAuthOpen,
    setIsAuthOpen,
    currentCurrency,
    setCurrentCurrency,
    handleLogin,
    handleLogout,
    formatPrice,
    boardingPassToShow,
    setBoardingPassToShow,
    toast,
    currentCategory,
    setCurrentCategory,
    setSearchQuery,
    setSearchLocation
  } = useAppContext();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Sticky Header Navbar */}
      <Navbar 
        itineraryCount={itinerary.length}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        currentCurrency={currentCurrency}
        setCurrentCurrency={setCurrentCurrency}
      />

      {/* Main Page Area */}
      <main style={{ flex: 1, paddingBottom: '5rem' }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{
        background: '#040406',
        borderTop: '1px solid var(--color-border)',
        padding: '3rem 2rem',
        textAlign: 'center',
        marginTop: 'auto'
      }}>
        <div className="luxury-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--color-text-primary)', cursor: 'pointer' }}>
            Luxury My Travel
          </Link>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', maxWidth: '500px' }}>
            A premium curation of ultra luxury service providers meant for the elite. Works with realtime AI agents for luxury hospitality.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              &copy; 2026 Luxury My Travel. All privileges reserved.
            </span>
            <span style={{ color: 'rgba(255,255,255,0.1)' }}>|</span>
            <Link 
              href="/about"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-gold)',
                fontSize: '0.75rem',
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: 0,
                transition: 'var(--transition-smooth)'
              }}
            >
              About Us & Legal Info
            </Link>
          </div>
        </div>
      </footer>

      {/* Membership Signup/Login Registry & Profile Dashboard */}
      <MembershipModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onViewBoardingPass={(booking) => {
          setBoardingPassToShow(booking);
          setIsAuthOpen(false); // Close dashboard while viewing pass
        }}
        formatPrice={formatPrice}
      />

      {/* Standalone Re-issued Boarding Pass Modal overlay */}
      {boardingPassToShow && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(3, 3, 5, 0.85)',
          backdropFilter: 'blur(12px)',
          zIndex: 5000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '1.5rem'
        }} onClick={() => setBoardingPassToShow(null)}>
          
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '750px',
            background: '#0d0d12',
            border: '1px solid rgba(223, 195, 132, 0.35)',
            boxShadow: 'var(--shadow-premium), 0 0 25px rgba(223, 195, 132, 0.15)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            fontFamily: 'var(--font-sans)',
            animation: 'modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }} onClick={(e) => e.stopPropagation()}>

            {/* Cutouts on the sides */}
            <div style={{ position: 'absolute', top: '50%', left: '-10px', width: '20px', height: '20px', background: 'var(--color-bg-deep)', borderRadius: '50%', transform: 'translateY(-50%)', borderRight: '1px solid rgba(223, 195, 132, 0.35)', zIndex: 5 }} />
            <div style={{ position: 'absolute', top: '50%', right: '-10px', width: '20px', height: '20px', background: 'var(--color-bg-deep)', borderRadius: '50%', transform: 'translateY(-50%)', borderLeft: '1px solid rgba(223, 195, 132, 0.35)', zIndex: 5 }} />

            {/* Close Button */}
            <button 
              onClick={() => setBoardingPassToShow(null)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
                cursor: 'pointer',
                padding: '0.4rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10
              }}
              className="no-print"
            >
              <X size={18} />
            </button>

            {/* Ticket Header */}
            <div style={{
              background: 'linear-gradient(90deg, #181822 0%, #121217 100%)',
              borderBottom: '1px dashed rgba(223, 195, 132, 0.25)',
              padding: '1.5rem 2rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plane size={18} style={{ color: 'var(--color-gold)' }} />
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', letterSpacing: '0.05em', color: 'var(--color-text-primary)' }}>
                  LuxeTravel Private Aviation
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block' }}>GDS Reference</span>
                <span style={{ fontSize: '0.9rem', color: 'var(--color-gold)', fontWeight: 700, letterSpacing: '0.05em' }}>{boardingPassToShow.details.reference}</span>
              </div>
            </div>

            {/* Ticket Content */}
            <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }} className="ticket-body">
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Passenger</span>
                    <span style={{ fontSize: '1rem', fontWeight: 600, display: 'block', color: 'var(--color-text-primary)' }}>{currentUser?.title?.toUpperCase()}. {currentUser?.username}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Flight Curation</span>
                    <span style={{ fontSize: '1.0rem', fontWeight: 500, display: 'block', color: 'var(--color-gold-light)' }}>{boardingPassToShow.name}</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Route</span>
                    <span style={{ fontSize: '0.95rem', fontWeight: 600, display: 'block', color: 'var(--color-text-primary)' }}>{boardingPassToShow.location}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Aircraft</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 500, display: 'block', color: 'var(--color-text-secondary)' }}>{boardingPassToShow.details.aircraftName || 'Gulfstream G650ER'}</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Date Booked</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, display: 'block', color: 'var(--color-text-primary)' }}>{boardingPassToShow.dateBooked}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Class / Cabin</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, display: 'block', color: 'var(--color-gold)' }}>Commercial First Class</span>
                  </div>
                </div>
              </div>

              <div style={{
                borderLeft: '1px dashed rgba(223, 195, 132, 0.2)',
                paddingLeft: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }} className="ticket-right">
                <div>
                  <div style={{ marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Luxury Cabin Seat</span>
                    <span style={{ fontSize: '2.5rem', fontWeight: 700, fontFamily: 'var(--font-serif)', color: 'var(--color-gold)', lineHeight: '1' }}>{boardingPassToShow.details.seatNumber || '1A'}</span>
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block' }}>Meal Priority</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-primary)', fontWeight: 500 }}>{boardingPassToShow.details.mealPref || 'Caviar Service'}</span>
                  </div>
                </div>

                <div>
                  <div style={{
                    display: 'flex',
                    height: '40px',
                    background: 'white',
                    padding: '6px',
                    borderRadius: '4px',
                    gap: '2px',
                    alignItems: 'stretch',
                    justifyContent: 'center'
                  }}>
                    {Array.from({ length: 32 }).map((_, i) => (
                      <span 
                        key={i} 
                        style={{
                          background: 'black',
                          width: i % 7 === 0 ? '4px' : i % 5 === 0 ? '3px' : i % 3 === 0 ? '1px' : '2px',
                          display: 'block'
                        }} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div style={{
              background: '#0a0a0f',
              borderTop: '1px solid rgba(223, 195, 132, 0.15)',
              padding: '1rem 2rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.75rem',
              color: 'var(--color-text-muted)'
            }}>
              <span>Status: **Confirmed / Re-issued**</span>
              <button 
                onClick={() => window.print()}
                className="btn-secondary no-print"
                style={{ padding: '0.2rem 0.6rem', fontSize: '0.65rem' }}
              >
                Print
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Premium Glassmorphic Toast Notification */}
      {toast.show && (
        <div 
          className="animate-slide-up"
          style={{
            position: 'fixed',
            bottom: '2.5rem',
            right: '2.5rem',
            zIndex: 1000,
            background: 'rgba(9, 9, 12, 0.85)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(223, 195, 132, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.5rem',
            color: 'var(--color-text-primary)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5), 0 0 15px rgba(223, 195, 132, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            maxWidth: '350px',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.9rem'
          }}
        >
          <div>{toast.message}</div>
        </div>
      )}
    </div>
  );
};
