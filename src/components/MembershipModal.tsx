import React, { useState } from 'react';
import { X, User, Mail, Lock, CreditCard, LogOut, Ticket, Award } from 'lucide-react';
import type { UserAccount, BookedCuration } from '../data/mockData';

interface MembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  onLogin: (user: UserAccount) => void;
  onLogout: () => void;
  onViewBoardingPass?: (booking: BookedCuration) => void;
  formatPrice: (amountUSD: number) => string;
}

export const MembershipModal: React.FC<MembershipModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
  onViewBoardingPass,
  formatPrice
}) => {
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [activeSubTab, setActiveSubTab] = useState<'bookings' | 'payments'>('bookings');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [title, setTitle] = useState<'mr' | 'ms' | 'mrs' | 'miss'>('mr');
  const [gender, setGender] = useState<'m' | 'f'>('m');
  const [bornOn, setBornOn] = useState('1990-05-15');
  const [phoneNumber, setPhoneNumber] = useState('+12025550189');
  const [membershipTier, setMembershipTier] = useState<UserAccount['membershipTier']>('Centurion Onyx');
  const [paymentCardType, setPaymentCardType] = useState<UserAccount['paymentCardType']>('Amex Centurion');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Retrieve accounts from localStorage
    const savedAccountsStr = localStorage.getItem('luxetravel_accounts') || '[]';
    const savedAccounts: UserAccount[] = JSON.parse(savedAccountsStr);

    const found = savedAccounts.find(acc => acc.email.toLowerCase() === email.toLowerCase());
    
    if (found) {
      onLogin(found);
      onClose();
    } else {
      // Mock log in if no accounts exist - create a default user
      if (email.toLowerCase() === 'aditya@luxurymytravel.com' || email.includes('aditya')) {
        const defaultUser: UserAccount = {
          username: 'Aditya Traveler',
          email: 'aditya@luxurymytravel.com',
          title: 'mr',
          bornOn: '1990-05-15',
          phoneNumber: '+12025550189',
          gender: 'm',
          membershipTier: 'Centurion Onyx',
          paymentCardType: 'Amex Centurion',
          bookings: [],
          payments: []
        };
        // Save default user
        savedAccounts.push(defaultUser);
        localStorage.setItem('luxetravel_accounts', JSON.stringify(savedAccounts));
        onLogin(defaultUser);
        onClose();
      } else {
        setErrorMsg('Invalid email or password. Verify your credentials or create a new registry.');
      }
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Check if email already registered
    const savedAccountsStr = localStorage.getItem('luxetravel_accounts') || '[]';
    const savedAccounts: UserAccount[] = JSON.parse(savedAccountsStr);

    const exists = savedAccounts.some(acc => acc.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      setErrorMsg('This email is already registered in our membership directory.');
      return;
    }

    const newUser: UserAccount = {
      username: username || 'Premium Traveler',
      email: email.toLowerCase(),
      title,
      bornOn,
      phoneNumber,
      gender,
      membershipTier,
      paymentCardType,
      bookings: [],
      payments: []
    };

    savedAccounts.push(newUser);
    localStorage.setItem('luxetravel_accounts', JSON.stringify(savedAccounts));
    
    onLogin(newUser);
    onClose();
  };

  const getTierDetails = (tier: string) => {
    switch (tier) {
      case 'Centurion Onyx':
        return { color: 'var(--color-gold)', desc: 'Exclusive VIP Airport Escort, Complimentary Luxury Fleet Upgrades' };
      case 'Bespoke Elite':
        return { color: '#ffffff', desc: 'Pre-reserved Priority Lounge, 24/7 Dedicated Concierge Link' };
      case 'Royal Concierge':
        return { color: '#60a5fa', desc: 'Priority Yacht charter rates, Custom Culinary chef events' };
      default:
        return { color: 'var(--color-text-secondary)', desc: 'Standard Luxury Lounge Access and API searches' };
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(3, 3, 5, 0.85)',
      backdropFilter: 'blur(12px)',
      zIndex: 4000,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '1.5rem'
    }} onClick={onClose}>
      
      <div style={{
        width: '100%',
        maxWidth: currentUser ? '900px' : '450px',
        maxHeight: '90vh',
        background: 'rgba(18, 18, 24, 0.98)',
        border: '1px solid rgba(223, 195, 132, 0.25)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-premium), 0 20px 50px rgba(0,0,0,0.8)',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        animation: 'modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }} onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button 
          onClick={onClose}
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
            zIndex: 10,
            transition: 'var(--transition-smooth)'
          }}
          className="modal-close-btn"
        >
          <X size={18} />
        </button>

        {/* 1. AUTHENTICATED USER DASHBOARD */}
        {currentUser ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr' }} className="dashboard-grid">
            
            {/* Left Side: Profile Info Card */}
            <div style={{
              background: '#0a0a0f',
              borderRight: '1px solid var(--color-border)',
              padding: '2.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.5rem'
            }} className="profile-left">
              
              {/* Profile Avatar / Logo */}
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #1f1f2e 0%, #121217 100%)',
                border: '2px solid var(--color-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-gold)',
                boxShadow: 'var(--shadow-gold-glow)'
              }}>
                <User size={36} />
              </div>

              {/* Title & Name */}
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
                  Active Curation Member
                </span>
                <h4 style={{ fontSize: '1.5rem', margin: '0.25rem 0', fontFamily: 'var(--font-serif)', color: 'var(--color-text-primary)' }}>
                  {currentUser.title.toUpperCase()}. {currentUser.username}
                </h4>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                  {currentUser.email}
                </span>
              </div>

              {/* Membership Tier badge */}
              <div style={{
                background: 'rgba(223, 195, 132, 0.05)',
                border: `1px solid rgba(223, 195, 132, 0.25)`,
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                width: '100%',
                textAlign: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: getTierDetails(currentUser.membershipTier).color, fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <Award size={16} />
                  <span>{currentUser.membershipTier}</span>
                </div>
                <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '0.35rem', lineHeight: '1.4' }}>
                  {getTierDetails(currentUser.membershipTier).desc}
                </p>
              </div>

              {/* Billing Method details */}
              <div style={{ width: '100%' }}>
                <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                  Preferred Payment
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '0.6rem 0.75rem' }}>
                  <CreditCard size={14} style={{ color: 'var(--color-gold)' }} />
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-primary)' }}>{currentUser.paymentCardType} (**** 1009)</span>
                </div>
              </div>

              {/* Signout button */}
              <button
                onClick={onLogout}
                style={{
                  marginTop: 'auto',
                  background: 'none',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-error)',
                  cursor: 'pointer',
                  width: '100%',
                  padding: '0.75rem 0',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontSize: '0.85rem',
                  transition: 'var(--transition-smooth)'
                }}
                className="logout-btn"
              >
                <LogOut size={16} />
                <span>De-register Session</span>
              </button>

            </div>

            {/* Right Side: Tab Lists (Bookings & Transactions) */}
            <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column' }} className="profile-right">
              
              {/* Tab Header Selector */}
              <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', marginBottom: '1.5rem', gap: '2rem' }}>
                <button
                  onClick={() => setActiveSubTab('bookings')}
                  style={{
                    background: 'none',
                    border: 'none',
                    paddingBottom: '0.75rem',
                    color: activeSubTab === 'bookings' ? 'var(--color-gold)' : 'var(--color-text-muted)',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderBottom: activeSubTab === 'bookings' ? '2px solid var(--color-gold)' : '2px solid transparent',
                    transition: 'var(--transition-smooth)'
                  }}
                >
                  Trip Bookings ({currentUser.bookings.length})
                </button>
                <button
                  onClick={() => setActiveSubTab('payments')}
                  style={{
                    background: 'none',
                    border: 'none',
                    paddingBottom: '0.75rem',
                    color: activeSubTab === 'payments' ? 'var(--color-gold)' : 'var(--color-text-muted)',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderBottom: activeSubTab === 'payments' ? '2px solid var(--color-gold)' : '2px solid transparent',
                    transition: 'var(--transition-smooth)'
                  }}
                >
                  Payment History ({currentUser.payments.length})
                </button>
              </div>

              {/* Sub-Tab Conten: Bookings List */}
              {activeSubTab === 'bookings' && (
                <div style={{ overflowY: 'auto', flex: 1, maxHeight: '55vh', paddingRight: '0.5rem' }} className="custom-scroll">
                  {currentUser.bookings.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem 1rem', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
                      <Ticket size={36} style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }} />
                      <h5 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>No active bookings</h5>
                      <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Reservations secured via the itinerary checkout will list here.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {currentUser.bookings.map((booking) => (
                        <div 
                          key={booking.id}
                          style={{
                            background: 'rgba(255,255,255,0.01)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '1rem',
                            display: 'flex',
                            gap: '1rem',
                            alignItems: 'center'
                          }}
                        >
                          <img 
                            src={booking.image} 
                            alt={booking.name} 
                            style={{
                              width: '70px',
                              height: '55px',
                              objectFit: 'cover',
                              borderRadius: 'var(--radius-md)'
                            }}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              const fallbacks: Record<string, string> = {
                                travel: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800',
                                stay: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
                                food: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800',
                                experience: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&q=80&w=800'
                              };
                              target.src = fallbacks[booking.type] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800';
                            }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.15rem' }}>
                              <span className="gold-badge" style={{ fontSize: '0.55rem', padding: '0.05rem 0.3rem' }}>
                                {booking.type}
                              </span>
                              <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Ref: {booking.details.reference}</span>
                            </div>
                            <h5 style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>{booking.name}</h5>
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{booking.location}</span>
                          </div>
                          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
                            <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                              {formatPrice(booking.price)}
                            </span>
                            
                            {/* Option to view details / boarding pass */}
                            {booking.type === 'travel' && booking.details.seatNumber && onViewBoardingPass && (
                              <button
                                onClick={() => onViewBoardingPass(booking)}
                                className="btn-primary"
                                style={{ padding: '0.2rem 0.6rem', fontSize: '0.65rem', borderRadius: 'var(--radius-sm)' }}
                              >
                                Boarding Pass
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Sub-Tab Content: Payments List */}
              {activeSubTab === 'payments' && (
                <div style={{ overflowY: 'auto', flex: 1, maxHeight: '55vh', paddingRight: '0.5rem' }} className="custom-scroll">
                  {currentUser.payments.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem 1rem', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
                      <CreditCard size={36} style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }} />
                      <h5 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>No payment records</h5>
                      <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Persisted transaction records appear here after itinerary checkouts.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {currentUser.payments.map((tx) => (
                        <div 
                          key={tx.id}
                          style={{
                            background: 'rgba(255,255,255,0.01)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '1rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <div>
                            <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', display: 'block' }}>Transaction Date: {tx.date}</span>
                            <h5 style={{ fontSize: '0.9rem', color: 'var(--color-text-primary)', margin: '0.15rem 0' }}>Charged via {tx.method}</h5>
                            <span style={{ fontSize: '0.7rem', color: 'var(--color-gold-light)', display: 'block' }}>Ref: {tx.reference}</span>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-success)' }}>
                              -{tx.currency === 'INR' ? '₹' : tx.currency === 'EUR' ? '€' : tx.currency === 'GBP' ? '£' : tx.currency === 'AED' ? 'AED ' : tx.currency === 'CAD' ? 'C$' : tx.currency === 'AUD' ? 'A$' : '$'}{tx.amount.toLocaleString()}
                            </span>
                            <span style={{ fontSize: '0.65rem', display: 'block', color: 'var(--color-text-muted)' }}>{tx.currency}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>

          </div>
        ) : (
          /* 2. GUEST REGISTRY (LOGIN & REGISTER PANEL) */
          <div style={{ padding: '2.5rem' }}>
            
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'rgba(223, 195, 132, 0.05)',
                border: '1px solid rgba(223, 195, 132, 0.2)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-gold)',
                marginBottom: '1rem'
              }}>
                <Award size={24} />
              </div>
              <h3 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-serif)', fontWeight: 400 }}>
                {isRegister ? 'LuxeClub Registry' : 'Membership Sign In'}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0 }}>
                {isRegister ? 'Register your luxury credentials to preserve curated checkouts' : 'Access your Onyx profile and bookings directory'}
              </p>
            </div>

            {errorMsg && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem',
                color: 'var(--color-error)',
                fontSize: '0.8rem',
                marginBottom: '1.5rem',
                display: 'flex',
                gap: '0.4rem',
                alignItems: 'center'
              }}>
                <X size={14} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Login / Register Forms */}
            <form onSubmit={isRegister ? handleRegisterSubmit : handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {isRegister && (
                <div>
                  <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.35rem' }}>Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <User size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                    <input 
                      type="text" 
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Aditya Traveler"
                      style={{
                        width: '100%',
                        background: '#09090c',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text-primary)',
                        padding: '0.6rem 0.75rem 0.6rem 2.25rem',
                        borderRadius: 'var(--radius-md)',
                        outline: 'none',
                        fontSize: '0.85rem'
                      }}
                    />
                  </div>
                </div>
              )}

              <div>
                <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.35rem' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="aditya@luxurymytravel.com"
                    style={{
                      width: '100%',
                      background: '#09090c',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-primary)',
                      padding: '0.6rem 0.75rem 0.6rem 2.25rem',
                      borderRadius: 'var(--radius-md)',
                      outline: 'none',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.35rem' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      background: '#09090c',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-primary)',
                      padding: '0.6rem 0.75rem 0.6rem 2.25rem',
                      borderRadius: 'var(--radius-md)',
                      outline: 'none',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>
              </div>

              {isRegister && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.35rem' }}>Title</label>
                      <select 
                        value={title}
                        onChange={(e) => setTitle(e.target.value as any)}
                        style={{
                          width: '100%',
                          background: '#09090c',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-text-primary)',
                          padding: '0.6rem 0.5rem',
                          borderRadius: 'var(--radius-md)',
                          outline: 'none',
                          fontSize: '0.85rem'
                        }}
                      >
                        <option value="mr">Mr.</option>
                        <option value="ms">Ms.</option>
                        <option value="mrs">Mrs.</option>
                        <option value="miss">Miss</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.35rem' }}>Gender</label>
                      <select 
                        value={gender}
                        onChange={(e) => setGender(e.target.value as any)}
                        style={{
                          width: '100%',
                          background: '#09090c',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-text-primary)',
                          padding: '0.6rem 0.5rem',
                          borderRadius: 'var(--radius-md)',
                          outline: 'none',
                          fontSize: '0.85rem'
                        }}
                      >
                        <option value="m">Male</option>
                        <option value="f">Female</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.35rem' }}>Birth Date</label>
                      <input 
                        type="date" 
                        required
                        value={bornOn}
                        onChange={(e) => setBornOn(e.target.value)}
                        style={{
                          width: '100%',
                          background: '#09090c',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-text-primary)',
                          padding: '0.55rem 0.5rem',
                          borderRadius: 'var(--radius-md)',
                          outline: 'none',
                          fontSize: '0.85rem'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.35rem' }}>Phone (E.164)</label>
                      <input 
                        type="tel" 
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+12025550189"
                        style={{
                          width: '100%',
                          background: '#09090c',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-text-primary)',
                          padding: '0.6rem 0.5rem',
                          borderRadius: 'var(--radius-md)',
                          outline: 'none',
                          fontSize: '0.85rem'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.35rem' }}>Membership Tier</label>
                      <select 
                        value={membershipTier}
                        onChange={(e) => setMembershipTier(e.target.value as any)}
                        style={{
                          width: '100%',
                          background: '#09090c',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-text-primary)',
                          padding: '0.6rem 0.5rem',
                          borderRadius: 'var(--radius-md)',
                          outline: 'none',
                          fontSize: '0.85rem'
                        }}
                      >
                        <option value="Centurion Onyx">Centurion Onyx (VIP)</option>
                        <option value="Bespoke Elite">Bespoke Elite</option>
                        <option value="Royal Concierge">Royal Concierge</option>
                        <option value="Standard Access">Standard Access</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.35rem' }}>Payment Card</label>
                      <select 
                        value={paymentCardType}
                        onChange={(e) => setPaymentCardType(e.target.value as any)}
                        style={{
                          width: '100%',
                          background: '#09090c',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-text-primary)',
                          padding: '0.6rem 0.5rem',
                          borderRadius: 'var(--radius-md)',
                          outline: 'none',
                          fontSize: '0.85rem'
                        }}
                      >
                        <option value="Amex Centurion">Amex Centurion</option>
                        <option value="Visa Infinite">Visa Infinite</option>
                        <option value="Mastercard World Elite">Mastercard World Elite</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <button 
                type="submit" 
                className="btn-primary" 
                style={{ width: '100%', padding: '0.85rem 0', marginTop: '1rem' }}
              >
                <span>{isRegister ? 'Register Credentials' : 'Access Profile'}</span>
              </button>
            </form>

            {/* Switch Mode link */}
            <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>
                {isRegister ? 'Already registered in the directory?' : 'New traveler to the platform?'}
              </span>{' '}
              <button
                onClick={() => {
                  setErrorMsg(null);
                  setIsRegister(!isRegister);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-gold)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  textDecoration: 'underline'
                }}
              >
                {isRegister ? 'Sign In' : 'Create Registry'}
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
