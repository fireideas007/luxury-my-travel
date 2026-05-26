import React, { useState, useEffect } from 'react';
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

  // Google Sign-In mock selector states
  const [isMockGoogleOpen, setIsMockGoogleOpen] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');

  // Password Recovery wizard states
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotPhone, setForgotPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);

  // GSI loading
  useEffect(() => {
    if (!isOpen) return;

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (clientId) {
      const initGsi = () => {
        try {
          const google = (window as any).google;
          if (google) {
            google.accounts.id.initialize({
              client_id: clientId,
              callback: (response: any) => {
                try {
                  const payload = JSON.parse(atob(response.credential.split('.')[1]));
                  handleGoogleLoginSuccess(payload.email, payload.name, payload.picture);
                } catch (e) {
                  setErrorMsg('Failed to process Google sign-in response.');
                }
              }
            });
            google.accounts.id.renderButton(
              document.getElementById('google-official-btn'),
              { theme: 'outline', size: 'large', width: 380 }
            );
          }
        } catch (err) {
          console.error("GSI Init error:", err);
        }
      };

      if ((window as any).google) {
        initGsi();
      } else {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = initGsi;
        document.body.appendChild(script);
      }
    }
  }, [isOpen]);

  const handleGoogleLoginSuccess = (gEmail: string, gName: string, gPicture: string) => {
    const savedAccountsStr = localStorage.getItem('luxetravel_accounts') || '[]';
    const savedAccounts: UserAccount[] = JSON.parse(savedAccountsStr);

    let found = savedAccounts.find(acc => acc.email.toLowerCase() === gEmail.toLowerCase());
    if (!found) {
      found = {
        username: gName,
        email: gEmail.toLowerCase(),
        avatarUrl: gPicture,
        authProvider: 'google',
        title: 'mr',
        bornOn: '1990-05-15',
        phoneNumber: '+10000000000',
        gender: 'm',
        membershipTier: 'Centurion Onyx',
        paymentCardType: 'Amex Centurion',
        bookings: [],
        payments: []
      };
      savedAccounts.push(found);
      localStorage.setItem('luxetravel_accounts', JSON.stringify(savedAccounts));
    } else {
      found.avatarUrl = gPicture;
      found.authProvider = 'google';
      localStorage.setItem('luxetravel_accounts', JSON.stringify(savedAccounts));
    }

    onLogin(found);
    onClose();
  };

  const handleForgotPasswordVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const savedAccountsStr = localStorage.getItem('luxetravel_accounts') || '[]';
    const savedAccounts: UserAccount[] = JSON.parse(savedAccountsStr);

    const found = savedAccounts.find(
      acc => acc.email.toLowerCase() === forgotEmail.toLowerCase() &&
             acc.phoneNumber.replace(/\s+/g, '') === forgotPhone.replace(/\s+/g, '')
    );

    if (found) {
      if (found.authProvider === 'google') {
        setErrorMsg('This account is registered via Google Sign-In. You cannot recover local password for Google accounts.');
        return;
      }
      setForgotStep(2);
    } else {
      setErrorMsg('No matching traveler credentials found. Verify your email and phone number.');
    }
  };

  const handleForgotPasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (newPassword !== confirmNewPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    const savedAccountsStr = localStorage.getItem('luxetravel_accounts') || '[]';
    const savedAccounts: UserAccount[] = JSON.parse(savedAccountsStr);

    const idx = savedAccounts.findIndex(acc => acc.email.toLowerCase() === forgotEmail.toLowerCase());
    if (idx !== -1) {
      savedAccounts[idx].password = newPassword;
      localStorage.setItem('luxetravel_accounts', JSON.stringify(savedAccounts));
      setResetSuccess('Your password has been successfully updated. Please sign in with your new credentials.');
      setIsForgotPassword(false);
      setEmail(forgotEmail);
      setPassword('');
    } else {
      setErrorMsg('An error occurred. Try again.');
    }
  };

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setResetSuccess(null);

    // Retrieve accounts from localStorage
    const savedAccountsStr = localStorage.getItem('luxetravel_accounts') || '[]';
    const savedAccounts: UserAccount[] = JSON.parse(savedAccountsStr);

    const found = savedAccounts.find(acc => acc.email.toLowerCase() === email.toLowerCase());
    
    if (found) {
      if (found.authProvider === 'google') {
        setErrorMsg('This account is registered via Google Sign-In. Please use the "Sign in with Google" button.');
        return;
      }
      if (found.password && found.password !== password) {
        setErrorMsg('Invalid password. Verify your credentials.');
        return;
      }
      onLogin(found);
      onClose();
    } else {
      // Mock log in if no accounts exist - create a default user
      if (email.toLowerCase() === 'aditya@luxurymytravel.com' || email.includes('aditya')) {
        const defaultUser: UserAccount = {
          username: 'Aditya Traveler',
          email: 'aditya@luxurymytravel.com',
          password: password || 'password',
          authProvider: 'local',
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
    setResetSuccess(null);

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
      password,
      authProvider: 'local',
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
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #1f1f2e 0%, #121217 100%)',
                border: '2px solid var(--color-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-gold)',
                boxShadow: 'var(--shadow-gold-glow)'
              }}>
                {currentUser.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt={currentUser.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <User size={36} />
                )}
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
            
            {isForgotPassword ? (
              <div>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-serif)', fontWeight: 400 }}>
                    {forgotStep === 1 ? 'Verify Profile' : 'Reset Password'}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0 }}>
                    {forgotStep === 1 
                      ? 'Confirm your registered traveler details to verify membership registry' 
                      : 'Define a new secure password for your local traveler account'}
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

                {forgotStep === 1 ? (
                  <form onSubmit={handleForgotPasswordVerify} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.35rem' }}>Registered Email</label>
                      <input 
                        type="email" 
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="aditya@luxurymytravel.com"
                        style={{
                          width: '100%',
                          background: '#09090c',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-text-primary)',
                          padding: '0.6rem 0.75rem',
                          borderRadius: 'var(--radius-md)',
                          outline: 'none',
                          fontSize: '0.85rem'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.35rem' }}>Phone Number (E.164)</label>
                      <input 
                        type="tel" 
                        required
                        value={forgotPhone}
                        onChange={(e) => setForgotPhone(e.target.value)}
                        placeholder="+12025550189"
                        style={{
                          width: '100%',
                          background: '#09090c',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-text-primary)',
                          padding: '0.6rem 0.75rem',
                          borderRadius: 'var(--radius-md)',
                          outline: 'none',
                          fontSize: '0.85rem'
                        }}
                      />
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.85rem 0', marginTop: '1rem' }}>
                      <span>Verify Credentials</span>
                    </button>

                    <button 
                      type="button" 
                      onClick={() => setIsForgotPassword(false)} 
                      className="btn-secondary" 
                      style={{ width: '100%', padding: '0.75rem 0', fontSize: '0.85rem', marginTop: '0.5rem' }}
                    >
                      <span>Return to Login</span>
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleForgotPasswordReset} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.35rem' }}>New Secure Password</label>
                      <input 
                        type="password" 
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        style={{
                          width: '100%',
                          background: '#09090c',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-text-primary)',
                          padding: '0.6rem 0.75rem',
                          borderRadius: 'var(--radius-md)',
                          outline: 'none',
                          fontSize: '0.85rem'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.35rem' }}>Confirm Password</label>
                      <input 
                        type="password" 
                        required
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="••••••••"
                        style={{
                          width: '100%',
                          background: '#09090c',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-text-primary)',
                          padding: '0.6rem 0.75rem',
                          borderRadius: 'var(--radius-md)',
                          outline: 'none',
                          fontSize: '0.85rem'
                        }}
                      />
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.85rem 0', marginTop: '1rem' }}>
                      <span>Update Registry Password</span>
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <div>
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

                {resetSuccess && (
                  <div style={{
                    background: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem',
                    color: 'var(--color-success)',
                    fontSize: '0.8rem',
                    marginBottom: '1.5rem',
                    textAlign: 'center'
                  }}>
                    {resetSuccess}
                  </div>
                )}

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
                    {!isRegister && (
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.35rem' }}>
                        <button
                          type="button"
                          onClick={() => {
                            setIsForgotPassword(true);
                            setForgotStep(1);
                            setForgotEmail(email);
                            setForgotPhone('');
                            setErrorMsg(null);
                            setResetSuccess(null);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--color-gold)',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                          }}
                        >
                          Forgot Password?
                        </button>
                      </div>
                    )}
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

                {/* Google Sign-In option */}
                {!isRegister && (
                  <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '0.5rem' }}>
                      <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
                      <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Or Connect With</span>
                      <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
                    </div>

                    {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
                      <div id="google-official-btn" style={{ width: '100%', display: 'flex', justifyContent: 'center' }} />
                    ) : (
                      <button
                        onClick={() => {
                          setIsMockGoogleOpen(true);
                          setCustomGoogleEmail('');
                          setCustomGoogleName('');
                          setErrorMsg(null);
                        }}
                        className="btn-secondary"
                        style={{
                          width: '100%',
                          padding: '0.6rem 0',
                          fontSize: '0.85rem',
                          borderRadius: 'var(--radius-md)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          borderColor: '#4285f4',
                          color: '#4285f4'
                        }}
                        type="button"
                      >
                        <svg width="16" height="16" viewBox="0 0 18 18">
                          <path fill="#4285f4" d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.47h4.84c-.21 1.12-.84 2.07-1.79 2.7v2.24h2.9c1.69-1.55 2.69-3.83 2.69-6.57z" />
                          <path fill="#34a853" d="M9 18c2.43 0 4.47-.8 5.96-2.23l-2.9-2.24c-.8.54-1.84.87-3.06.87-2.35 0-4.34-1.58-5.05-3.71H.95v2.3C2.43 16.42 5.48 18 9 18z" />
                          <path fill="#fbbc05" d="M3.95 10.7a5.4 5.4 0 0 1 0-3.4V5H.95a9 9 0 0 0 0 8v-2.3z" />
                          <path fill="#ea4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35L15 2.02A9 9 0 0 0 .95 5l3 2.3C4.66 5.17 6.65 3.58 9 3.58z" />
                        </svg>
                        <span>Sign in with Google</span>
                      </button>
                    )}
                  </div>
                )}

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
        )}

      </div>

      {/* Mock Google Account Selector Popup */}
      {isMockGoogleOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(3, 3, 5, 0.9)',
          backdropFilter: 'blur(16px)',
          zIndex: 5000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '1.5rem'
        }} onClick={() => setIsMockGoogleOpen(false)}>
          
          <div style={{
            width: '100%',
            maxWidth: '400px',
            background: '#ffffff',
            color: '#202124',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            padding: '2.5rem',
            fontFamily: 'Roboto, Arial, sans-serif',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            position: 'relative'
          }} onClick={(e) => e.stopPropagation()}>
            
            {/* Close Button */}
            <button
              onClick={() => setIsMockGoogleOpen(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                color: '#5f6368',
                cursor: 'pointer',
                fontSize: '1.2rem'
              }}
            >
              ✕
            </button>

            {/* Google Logo */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <svg width="74" height="24" viewBox="0 0 74 24">
                <g fill="none" fillRule="evenodd">
                  <path fill="#4285F4" d="M11.64 22.8c-6.13 0-11.14-5.06-11.14-11.3S5.5.2 11.64.2c3.35 0 5.86 1.3 7.68 3.03l-2.73 2.74c-1.3-.1.22-2.12-2.22-3.23-3.77-3.77-2.67-4.73-5.46-4.73-4.95 0-8.98 4-8.98 8.96s4.03 8.97 8.98 8.97c3.12 0 4.88-1.25 6.01-2.38 1.13-1.13 1.83-2.74 2.06-4.9H11.63V8.83h11.96c.12.63.18 1.34.18 2.13 0 2.53-.7 5.3-2.95 7.55-2.2 2.29-5.03 4.29-9.18 4.29z" />
                  <path fill="#EA4335" d="M30.65 22.8c-3.66 0-6.72-2.85-6.72-6.7s3.06-6.7 6.72-6.7c3.63 0 6.69 2.85 6.69 6.7s-3.06 6.7-6.69 6.7zm0-10.45c-2.02 0-3.73 1.66-3.73 3.75s1.7 3.74 3.73 3.74 3.7-1.65 3.7-3.74-1.68-3.75-3.7-3.75z" />
                  <path fill="#FBBC05" d="M45.65 22.8c-3.66 0-6.72-2.85-6.72-6.7s3.06-6.7 6.72-6.7c3.63 0 6.69 2.85 6.69 6.7s-3.06 6.7-6.69 6.7zm0-10.45c-2.02 0-3.73 1.66-3.73 3.75s1.7 3.74 3.73 3.74 3.7-1.65 3.7-3.74-1.68-3.75-3.7-3.75z" />
                  <path fill="#4285F4" d="M60.27 22.8c-3.53 0-6.39-2.9-6.39-6.7s2.86-6.7 6.39-6.7c1.7 0 3.01.69 3.96 1.6l-1.57 1.58c-.62-.6-1.42-1-2.39-1-2.02 0-3.63 1.65-3.63 3.52s1.6 3.52 3.63 3.52c1.94 0 2.76-.78 3.39-1.4.53-.54.91-1.34 1.03-2.4H60.27v-2.89h12.5c.08.43.12.93.12 1.48 0 3.77-2.52 6.89-6.39 6.89z" />
                  <path fill="#34A853" d="M75.65 22.8h-2.92V.8h2.92v22z" />
                  <path fill="#FBBC05" d="M84.27 22.8c-1.8 0-3.32-.93-4.13-2.28l10.82-4.48-.38-.95c-.34-.93-1.38-2.69-3.5-2.69-2.1 0-3.83 1.66-3.83 3.75 0 3.65 2.89 6.65 6.74 6.65 3.12 0 4.93-1.9 5.68-3.03l-2.31-1.54c-.75 1.13-1.78 1.68-3.37 1.68zm-.12-10.45c-.97 0-1.8.5-2.23 1.25l7.24-3c-.4-.76-1.22-1.25-2.23-1.25z" />
                </g>
              </svg>
            </div>

            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 500, color: '#202124', fontFamily: 'Roboto, sans-serif', letterSpacing: 'normal' }}>
                Choose an account
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#5f6368', marginTop: '0.35rem' }}>
                to continue to Luxury My Travel
              </p>
            </div>

            {/* Account List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
              {[
                { name: 'Aditya Traveler', email: 'aditya@gmail.com', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150' },
                { name: 'Jane Doe', email: 'jane.doe@gmail.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150' }
              ].map(acc => (
                <button
                  key={acc.email}
                  onClick={() => {
                    handleGoogleLoginSuccess(acc.email, acc.name, acc.avatar);
                    setIsMockGoogleOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    width: '100%',
                    padding: '0.6rem 0.75rem',
                    background: 'none',
                    border: '1px solid #dadce0',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#f7f8f9'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                  type="button"
                >
                  <img src={acc.avatar} alt={acc.name} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 500, color: '#3c4043' }}>{acc.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#70757a' }}>{acc.email}</div>
                  </div>
                </button>
              ))}

              <div style={{ margin: '0.5rem 0', height: '1px', background: '#dadce0' }} />

              {/* Use custom account */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#5f6368' }}>Or connect custom Google Account</span>
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  value={customGoogleName}
                  onChange={(e) => setCustomGoogleName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    border: '1px solid #dadce0',
                    borderRadius: '4px',
                    color: '#202124',
                    background: '#ffffff',
                    fontSize: '0.8rem',
                    outline: 'none'
                  }}
                />
                <input 
                  type="email" 
                  placeholder="Google Email" 
                  value={customGoogleEmail}
                  onChange={(e) => setCustomGoogleEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    border: '1px solid #dadce0',
                    borderRadius: '4px',
                    color: '#202124',
                    background: '#ffffff',
                    fontSize: '0.8rem',
                    outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const name = customGoogleName.trim() || 'Google Traveler';
                    const email = customGoogleEmail.trim() || 'traveler@gmail.com';
                    const mockAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;
                    handleGoogleLoginSuccess(email, name, mockAvatar);
                    setIsMockGoogleOpen(false);
                  }}
                  style={{
                    background: '#1a73e8',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.5rem 0',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    marginTop: '0.25rem'
                  }}
                >
                  Sign in with Custom Account
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
