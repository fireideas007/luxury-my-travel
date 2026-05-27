'use client';

import { useState, useEffect } from 'react';
import { Plane, Home, Utensils, Compass, Search, Users, MapPin, Calendar } from 'lucide-react';

interface HeroProps {
  onSearch: (category: string, query: string, location: string, origin?: string, departureDate?: string, lat?: number, lng?: number, skipScroll?: boolean) => void;
  triggerApiLog: (api: 'AirService' | 'LodgingService' | 'ConciergeRegistry', endpoint: string, request: any, response: any) => void;
}

const LUXURY_DESTINATIONS_FALLBACK = [
  { iata_code: 'JAI', name: 'Sanganeer Airport', city_name: 'Jaipur', country_name: 'India', type: 'airport' },
  { iata_code: 'DEL', name: 'Indira Gandhi International Airport', city_name: 'Delhi', country_name: 'India', type: 'airport' },
  { iata_code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International', city_name: 'Mumbai', country_name: 'India', type: 'airport' },
  { iata_code: 'LAX', name: 'Los Angeles International Airport', city_name: 'Los Angeles, California', country_name: 'United States', type: 'airport' },
  { iata_code: 'SFO', name: 'San Francisco International Airport', city_name: 'San Francisco, California', country_name: 'United States', type: 'airport' },
  { iata_code: 'SAN', name: 'San Diego International Airport', city_name: 'San Diego, California', country_name: 'United States', type: 'airport' },
  { iata_code: 'MLE', name: 'Velana International Airport', city_name: 'Malé', country_name: 'Maldives', type: 'airport' },
  { iata_code: 'SIN', name: 'Changi Airport', city_name: 'Singapore', country_name: 'Singapore', type: 'airport' },
  { iata_code: 'LHR', name: 'Heathrow Airport', city_name: 'London', country_name: 'United Kingdom', type: 'airport' },
  { iata_code: 'JFK', name: 'John F. Kennedy International Airport', city_name: 'New York', country_name: 'United States', type: 'airport' },
  { iata_code: 'DXB', name: 'Dubai International Airport', city_name: 'Dubai', country_name: 'United Arab Emirates', type: 'airport' },
  { iata_code: 'HND', name: 'Haneda Airport', city_name: 'Tokyo', country_name: 'Japan', type: 'airport' },
  { iata_code: 'VCE', name: 'Marco Polo Airport', city_name: 'Venice', country_name: 'Italy', type: 'airport' },
  { iata_code: 'CDG', name: 'Charles de Gaulle Airport', city_name: 'Paris', country_name: 'France', type: 'airport' },
  { iata_code: 'MXP', name: 'Malpensa Airport (Lake Como)', city_name: 'Lake Como, Milan', country_name: 'Italy', type: 'airport' },
  { iata_code: 'PMI', name: 'Palma de Mallorca Airport', city_name: 'Mallorca', country_name: 'Spain', type: 'airport' },
  { iata_code: 'ATH', name: 'Eleftherios Venizelos International', city_name: 'Athens (Mykonos)', country_name: 'Greece', type: 'airport' },
  { iata_code: 'HNL', name: 'Daniel K. Inouye International Airport', city_name: 'Oahu, Hawaii', country_name: 'United States', type: 'airport' }
];

export const Hero: React.FC<HeroProps> = ({ onSearch, triggerApiLog }) => {
  const [activeSegment, setActiveSegment] = useState<'travel' | 'stay' | 'food' | 'experience'>('travel');
  const [location, setLocation] = useState('');
  const [origin, setOrigin] = useState('LHR');
  const [departureDate, setDepartureDate] = useState('2026-06-15');
  const [searchQuery, setSearchQuery] = useState('');
  const [guestCount, setGuestCount] = useState('2 Guests');

  // Autocomplete suggestions states
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [activeSuggestionField, setActiveSuggestionField] = useState<'origin' | 'destination' | null>(null);
  const [debounceTimeout, setDebounceTimeout] = useState<any>(null);
  const [selectedDestinationCoords, setSelectedDestinationCoords] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveSuggestionField(null);
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const fetchSuggestions = async (val: string, field: 'origin' | 'destination') => {
    if (val.trim().length < 2) {
      setSuggestions([]);
      setActiveSuggestionField(null);
      return;
    }

    try {
      const res = await fetch(`/api/travel/place_suggestions?query=${encodeURIComponent(val)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          triggerApiLog('AirService', `GET /places/suggestions?query=${val}`, { query: val }, json);
          setSuggestions(json.data);
          setActiveSuggestionField(field);
          return;
        }
      }
      
      // If res is OK but returned 0 matches, run the local match fallback
      const q = val.toLowerCase();
      const matched = LUXURY_DESTINATIONS_FALLBACK.filter(
        item => item.city_name.toLowerCase().includes(q) ||
                item.iata_code.toLowerCase().includes(q) ||
                item.name.toLowerCase().includes(q) ||
                (item.country_name && item.country_name.toLowerCase().includes(q))
      );
      setSuggestions(matched);
      setActiveSuggestionField(field);
    } catch (err) {
      // Local fallback suggestions matching query on request exceptions
      const q = val.toLowerCase();
      const matched = LUXURY_DESTINATIONS_FALLBACK.filter(
        item => item.city_name.toLowerCase().includes(q) ||
                item.iata_code.toLowerCase().includes(q) ||
                item.name.toLowerCase().includes(q) ||
                (item.country_name && item.country_name.toLowerCase().includes(q))
      );
      setSuggestions(matched);
      setActiveSuggestionField(field);
    }
  };

  const handleInputChange = (val: string, field: 'origin' | 'destination') => {
    if (field === 'origin') {
      setOrigin(val);
    } else {
      setLocation(val);
      setSelectedDestinationCoords(null);
    }

    if (debounceTimeout) clearTimeout(debounceTimeout);

    if (val.trim().length < 2) {
      setSuggestions([]);
      setActiveSuggestionField(null);
      return;
    }

    const timeout = setTimeout(() => {
      fetchSuggestions(val, field);
    }, 250);
    setDebounceTimeout(timeout);
  };

  const segments = [
    { id: 'travel', label: 'Charter & Travel', icon: Plane, api: 'AirService' as const },
    { id: 'stay', label: 'Villas & Stays', icon: Home, api: 'LodgingService' as const },
    { id: 'food', label: 'Fine Dining', icon: Utensils, api: 'ConciergeRegistry' as const },
    { id: 'experience', label: 'Bespoke Experiences', icon: Compass, api: 'ConciergeRegistry' as const }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Select correct API source and mock endpoint
    const currentSeg = segments.find(s => s.id === activeSegment);
    if (!currentSeg) return;

    let endpoint = '';
    let mockReq = {};
    let mockRes = {};

    const extractIata = (str: string) => {
      const match = str.match(/\(([A-Z]{3})\)/);
      return match ? match[1] : str.toUpperCase().trim();
    };

    if (activeSegment === 'travel') {
      endpoint = 'POST /v1/offer_requests';
      mockReq = {
        cabin_class: "first",
        passengers: [{ type: "adult" }],
        slices: [{
          origin: extractIata(origin) || "LHR",
          destination: extractIata(location) || "SIN",
          departure_date: departureDate || "2026-06-15"
        }]
      };
      mockRes = {
        data: {
          offers: [
            { id: "off_g650", price: "18,500 USD/hr", carrier: "Gulfstream Charter", flight_number: "G6-880" },
            { id: "off_sq380", price: "12,400 USD", carrier: "Singapore Airlines Suites", flight_number: "SQ-321" }
          ],
          offer_request_id: "orq_0000A231F"
        }
      };
    } else if (activeSegment === 'stay') {
      endpoint = 'GET /v3/shopping/hotel-offers';
      mockReq = {
        cityCode: location ? extractIata(location).slice(0, 3).toUpperCase() : "MLE",
        ratings: [5],
        checkInDate: "2026-06-15",
        checkOutDate: "2026-06-22",
        roomQuantity: 1,
        adults: guestCount ? parseInt(guestCount) || 2 : 2
      };
      mockRes = {
        data: [
          { hotelId: "HOT_SJN1", name: "Soneva Jani Maldives", rateCode: "LUX_VILLA", currency: "USD", price: "4,500.00" },
          { hotelId: "HOT_AMN1", name: "Aman Tokyo", rateCode: "PREM_SUITE", currency: "USD", price: "2,100.00" }
        ]
      };
    } else {
      endpoint = 'GET /v1/location/search';
      mockReq = {
        searchQuery: searchQuery || "Michelin",
        category: activeSegment === 'food' ? "restaurants" : "attractions",
        location: location || "Menton, France"
      };
      mockRes = {
        data: activeSegment === 'food' ? [
          { location_id: "loc_mirazur", name: "Mirazur", rating: "4.95", rating_image_url: "https://api.luxurymytravel.com/assets/ratings/5.svg" },
          { location_id: "loc_connaught", name: "Connaught Bar", rating: "4.85", rating_image_url: "https://api.luxurymytravel.com/assets/ratings/5.svg" }
        ] : [
          { location_id: "loc_helitour", name: "Helicopter Volcano Tour", rating: "4.98" },
          { location_id: "loc_louvre", name: "After-Hours Louvre Tour", rating: "5.0" }
        ]
      };
    }

    // Trigger API Log
    triggerApiLog(currentSeg.api, endpoint, mockReq, mockRes);
    
    // Call parent search
    onSearch(activeSegment, searchQuery, location, origin, departureDate, selectedDestinationCoords?.lat, selectedDestinationCoords?.lng);
  };

  return (
    <div style={{
      position: 'relative',
      padding: '4rem 0 3rem 0',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '70vh',
      overflow: 'hidden'
    }} className="animate-fade-in">
      
      {/* Background radial glow */}
      <div style={{
        position: 'absolute',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(223,195,132,0.06) 0%, rgba(6,6,8,0) 70%)',
        top: '-10%',
        zIndex: -1
      }} />

      {/* Gold badge */}
      <div style={{ marginBottom: '1.5rem' }}>
        <span className="gold-badge">EXCLUSIVELY HIGH-END</span>
      </div>

      {/* Main Title */}
      <h1 style={{
        fontSize: 'calc(2.5rem + 2vw)',
        lineHeight: 1.15,
        maxWidth: '900px',
        marginBottom: '1.5rem',
        fontWeight: 400
      }}>
        Bespoke Luxury Travel <br />
        <span className="luxury-text-gradient" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
          Tailored For The Elite
        </span>
      </h1>

      {/* Subtitle */}
      <p style={{
        fontSize: '1.15rem',
        color: 'var(--color-text-secondary)',
        maxWidth: '650px',
        marginBottom: '3rem',
        lineHeight: '1.8'
      }}>
        Access private jet charters, elite yacht reservations, 5-star sanctuaries, Michelin-starred tables, and custom-curated itineraries. Powered by real-time luxury APIs.
      </p>

      {/* Search Container */}
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '950px',
        padding: '1.5rem',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-premium), var(--shadow-gold-glow)'
      }}>
        
        {/* Segment Toggles */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0.5rem',
          borderBottom: '1px solid var(--color-border)',
          paddingBottom: '1rem',
          marginBottom: '1.5rem'
        }} className="search-tabs">
          {segments.map((seg) => {
            const Icon = seg.icon;
            const isActive = activeSegment === seg.id;
            return (
              <button
                key={seg.id}
                onClick={() => {
                  setActiveSegment(seg.id as any);
                  onSearch(seg.id, '', '', seg.id === 'travel' ? origin : undefined, seg.id === 'travel' ? departureDate : undefined, undefined, undefined, true);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  background: isActive ? 'rgba(223, 195, 132, 0.08)' : 'transparent',
                  border: isActive ? '1px solid rgba(223, 195, 132, 0.3)' : '1px solid transparent',
                  borderRadius: 'var(--radius-md)',
                  color: isActive ? 'var(--color-gold)' : 'var(--color-text-secondary)',
                  padding: '0.75rem 1rem',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'var(--transition-smooth)'
                }}
              >
                <Icon size={16} />
                <span>{seg.label}</span>
              </button>
            );
          })}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSearchSubmit} style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          {/* Origin (Only for Charter & Travel) */}
          {activeSegment === 'travel' && (
            <div style={{
              flex: '1.5 1 150px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: 'var(--color-bg-hover)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem',
              position: 'relative'
            }} onClick={(e) => e.stopPropagation()}>
              <MapPin size={18} style={{ color: 'var(--color-gold)' }} />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
                <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 600, letterSpacing: '0.05em' }}>Origin</span>
                <input
                  type="text"
                  placeholder="Departure Hub (e.g. LHR, JFK)"
                  value={origin}
                  onChange={(e) => handleInputChange(e.target.value, 'origin')}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (origin.length >= 2) fetchSuggestions(origin, 'origin');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    color: 'var(--color-text-primary)',
                    fontSize: '0.9rem',
                    width: '100%',
                    marginTop: '0.1rem'
                  }}
                />
              </div>

              {activeSuggestionField === 'origin' && suggestions.length > 0 && (
                <div className="suggestions-dropdown" style={{
                  position: 'absolute',
                  top: '105%',
                  left: 0,
                  right: 0,
                  background: 'rgba(18, 18, 24, 0.98)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  maxHeight: '220px',
                  overflowY: 'auto',
                  zIndex: 1000,
                  boxShadow: 'var(--shadow-premium), 0 8px 24px rgba(0,0,0,0.5)'
                }}>
                  {suggestions.map((s) => (
                    <div
                      key={s.id || s.iata_code}
                      onClick={(e) => {
                        e.stopPropagation();
                        setOrigin(`${s.city_name || s.name} (${s.iata_code})`);
                        setActiveSuggestionField(null);
                        setSuggestions([]);
                      }}
                      className="suggestion-item"
                      style={{
                        padding: '0.65rem 1rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
                        textAlign: 'left'
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ color: 'var(--color-text-primary)', fontSize: '0.85rem', fontWeight: 500 }}>
                          {s.name}
                        </span>
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem' }}>
                          {s.city_name ? `${s.city_name}, ` : ''}{s.country_name || s.iata_country_code || ''}
                        </span>
                      </div>
                      <span style={{
                        background: 'rgba(223, 195, 132, 0.08)',
                        border: '1px solid rgba(223, 195, 132, 0.3)',
                        color: 'var(--color-gold)',
                        borderRadius: '4px',
                        padding: '0.1rem 0.4rem',
                        fontSize: '0.7rem',
                        fontWeight: 600
                      }}>
                        {s.iata_code}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Destination/Location */}
          <div style={{
            flex: activeSegment === 'travel' ? '1.5 1 150px' : '2 1 200px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: 'var(--color-bg-hover)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1rem',
            position: 'relative'
          }} onClick={(e) => e.stopPropagation()}>
            <MapPin size={18} style={{ color: 'var(--color-gold)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 600, letterSpacing: '0.05em' }}>Destination</span>
              <input
                type="text"
                placeholder={activeSegment === 'travel' ? "Arrival Hub (e.g. SIN, MLE)" : "City, Country (e.g. Como, Paris)"}
                value={location}
                onChange={(e) => handleInputChange(e.target.value, 'destination')}
                onClick={(e) => {
                  e.stopPropagation();
                  if (location.length >= 2) {
                    fetchSuggestions(location, 'destination');
                  }
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--color-text-primary)',
                  fontSize: '0.9rem',
                  width: '100%',
                  marginTop: '0.1rem'
                }}
              />
            </div>

            {activeSuggestionField === 'destination' && suggestions.length > 0 && (
              <div className="suggestions-dropdown" style={{
                position: 'absolute',
                top: '105%',
                left: 0,
                right: 0,
                background: 'rgba(18, 18, 24, 0.98)',
                backdropFilter: 'blur(10px)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                maxHeight: '220px',
                overflowY: 'auto',
                zIndex: 1000,
                boxShadow: 'var(--shadow-premium), 0 8px 24px rgba(0,0,0,0.5)'
              }}>
                {suggestions.map((s) => (
                  <div
                    key={s.id || s.iata_code}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (activeSegment === 'travel') {
                        setLocation(`${s.city_name || s.name} (${s.iata_code})`);
                      } else {
                        setLocation(s.city_name || s.name);
                      }
                      setSelectedDestinationCoords(s.latitude && s.longitude ? { lat: Number(s.latitude), lng: Number(s.longitude) } : null);
                      setActiveSuggestionField(null);
                      setSuggestions([]);
                    }}
                    className="suggestion-item"
                    style={{
                      padding: '0.65rem 1rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ color: 'var(--color-text-primary)', fontSize: '0.85rem', fontWeight: 500 }}>
                        {s.name}
                      </span>
                      <span style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem' }}>
                        {s.city_name ? `${s.city_name}, ` : ''}{s.country_name || s.iata_country_code || ''}
                      </span>
                    </div>
                    <span style={{
                      background: 'rgba(223, 195, 132, 0.08)',
                      border: '1px solid rgba(223, 195, 132, 0.3)',
                      color: 'var(--color-gold)',
                      borderRadius: '4px',
                      padding: '0.1rem 0.4rem',
                      fontSize: '0.7rem',
                      fontWeight: 600
                    }}>
                      {s.iata_code}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Departure Date (Only for Charter & Travel) */}
          {activeSegment === 'travel' && (
            <div style={{
              flex: '1.2 1 120px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: 'var(--color-bg-hover)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem'
            }}>
              <Calendar size={18} style={{ color: 'var(--color-gold)' }} />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
                <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 600, letterSpacing: '0.05em' }}>Date</span>
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  style={{
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    color: 'var(--color-text-primary)',
                    fontSize: '0.9rem',
                    width: '100%',
                    marginTop: '0.1rem',
                    cursor: 'pointer'
                  }}
                />
              </div>
            </div>
          )}

          {/* Specific Query */}
          <div style={{
            flex: '2 1 200px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: 'var(--color-bg-hover)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1rem'
          }}>
            <Search size={18} style={{ color: 'var(--color-gold)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 600, letterSpacing: '0.05em' }}>Search Keyword</span>
              <input
                type="text"
                placeholder={activeSegment === 'travel' ? "e.g. Private Jet, Suites" : activeSegment === 'stay' ? "e.g. Resort, Villa, Aman" : activeSegment === 'food' ? "e.g. Michelin, Rooftop" : "e.g. Helicopter, Private Tour"}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--color-text-primary)',
                  fontSize: '0.9rem',
                  width: '100%',
                  marginTop: '0.1rem'
                }}
              />
            </div>
          </div>

          {/* Guest Count */}
          <div style={{
            flex: '1 1 120px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: 'var(--color-bg-hover)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1rem'
          }} className="guest-select">
            <Users size={18} style={{ color: 'var(--color-gold)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 600, letterSpacing: '0.05em' }}>Capacity</span>
              <select
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--color-text-primary)',
                  fontSize: '0.9rem',
                  width: '100%',
                  marginTop: '0.1rem',
                  cursor: 'pointer'
                }}
              >
                <option value="1 Guest">1 Guest</option>
                <option value="2 Guests">2 Guests</option>
                <option value="4 Guests">4 Guests</option>
                <option value="6 Guests">6+ Guests</option>
                <option value="Private Charter">Private Charter</option>
              </select>
            </div>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="btn-primary"
            style={{
              padding: '1.1rem 2rem',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: '1 1 150px'
            }}
          >
            <span>Search</span>
            <Search size={16} />
          </button>
        </form>

      </div>

      <style>{`
        .suggestion-item {
          transition: background-color 0.2s ease;
        }
        .suggestion-item:hover {
          background-color: rgba(223, 195, 132, 0.08) !important;
        }
        @media (max-width: 768px) {
          .search-tabs {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.5rem !important;
          }
          .guest-select {
            flex: 1 1 100% !important;
          }
        }
      `}</style>
    </div>
  );
};
