import React, { useState } from 'react';
import type { LuxuryItem } from '../data/mockData';
import { Star, ShieldCheck, Plus, Sparkles, HelpCircle, Layers, X, MapPin } from 'lucide-react';

interface ItemGridProps {
  items: LuxuryItem[];
  onAddToItinerary: (item: LuxuryItem) => void;
  triggerApiLog: (api: 'AirService' | 'LodgingService' | 'ConciergeRegistry', endpoint: string, request: any, response: any) => void;
  formatPrice: (amountUSD: number) => string;
}

export const ItemGrid: React.FC<ItemGridProps> = ({ items, onAddToItinerary, triggerApiLog, formatPrice }) => {
  const [selectedItem, setSelectedItem] = useState<LuxuryItem | null>(null);
  const safeFormatPrice = typeof formatPrice === 'function' ? formatPrice : (amount: number) => `$${amount.toLocaleString()}`;
  
  const handleInspectAPI = (item: LuxuryItem) => {
    let endpoint = '';
    let mockReq = {};
    let mockRes = {};

    if (item.type === 'travel') {
      const data = item.data;
      if (data.category === 'flight') {
        endpoint = 'GET /v1/offers/' + data.id;
        mockReq = { offer_id: data.id };
        mockRes = {
          data: {
            id: data.id,
            price: `${data.price} USD ${data.priceUnit}`,
            carrier: data.name,
            cabin_class: "first",
            passenger_capacity: data.highlights[0],
            specifications: data.specs,
            available_seats: [
              { seat_number: "1A", type: "suite", status: "available" },
              { seat_number: "1B", type: "suite", status: "booked" }
            ]
          }
        };
      } else if (data.category === 'yacht') {
        endpoint = 'GET /v2/shopping/charters/yachts/' + data.id;
        mockReq = { yacht_id: data.id };
        mockRes = {
          data: {
            id: data.id,
            name: data.name,
            charter_type: data.type,
            rates: [{ amount: data.price, currency: "USD", duration: "day" }],
            yacht_details: data.specs,
            crew_complement: data.highlights[2]
          }
        };
      } else {
        endpoint = 'GET /v1/travel/rail/routes';
        mockReq = { route_name: data.name };
        mockRes = {
          data: {
            route_id: data.id,
            train_name: data.name,
            cabin_tier: "Grand Suite",
            fares: [{ amount: data.price, currency: "USD", description: "Per journey" }],
            itinerary: ["Day 1: Departure", "Day 2: Scenic Alpine Cruising", "Day 3: Arrival"]
          }
        };
      }
    } else if (item.type === 'stay') {
      const data = item.data;
      endpoint = 'GET /v3/shopping/hotels/by-id';
      mockReq = { hotelId: data.id };
      mockRes = {
        data: {
          hotelId: data.id,
          name: data.name,
          location: data.location,
          rating: data.rating,
          amenities: data.features,
          exclusive_privileges: data.highlights,
          pricing: {
            base_rate: data.price,
            currency: "USD",
            rate_type: data.priceUnit
          }
        }
      };
    } else if (item.type === 'food') {
      const data = item.data;
      endpoint = 'GET /v1/location/' + data.id + '/details';
      mockReq = { locationId: data.id };
      mockRes = {
        data: {
          location_id: data.id,
          name: data.name,
          ranking_category: "restaurant",
          rating: data.rating.toString(),
          num_reviews: data.reviewsCount.toString(),
          price_level: data.priceRange,
          awards: data.michelinStars ? [`${data.michelinStars} Michelin Stars`] : ["Top Fine Dining Award"],
          features: data.highlights,
          specialties: [data.signatureDish]
        }
      };
    } else {
      const data = item.data;
      endpoint = 'GET /v1/location/' + data.id + '/details';
      mockReq = { activity_id: data.id };
      mockRes = {
        data: {
          id: data.id,
          name: data.name,
          duration: data.duration,
          location: data.location,
          rating: data.rating,
          inclusions: data.highlights,
          pricing: {
            amount: data.price,
            currency: "USD",
            tier: data.priceUnit
          }
        }
      };
    }

    triggerApiLog(item.data.apiSource, endpoint, mockReq, mockRes);
  };

  if (items.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '5rem 2rem',
        border: '1px dashed var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        margin: '2rem 0'
      }}>
        <HelpCircle size={48} style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }} />
        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No Curations Found</h3>
        <p style={{ color: 'var(--color-text-muted)', maxWidth: '400px', margin: '0 auto' }}>
          We could not find any luxury travel packages matching your search. Try adjusting your query or filters.
        </p>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: '5rem' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={18} style={{ color: 'var(--color-gold)' }} />
          <h2 style={{ fontSize: '2rem', fontWeight: 500 }}>
            Luxury Recommendations
          </h2>
        </div>
        <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
          Showing {items.length} curated options
        </span>
      </div>

      {/* Grid Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '2.5rem'
      }} className="luxury-grid">
        {items.map((item) => {
          const { id, name, description, image, rating, location, highlights, apiSource, category } = item.data;
          
          return (
            <div 
              key={id} 
              className="glass-panel" 
              style={{
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                height: '100%',
                position: 'relative',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedItem(item)}
            >
              {/* Card Image Cover */}
              <div 
                style={{
                  width: '100%',
                  height: '240px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                className="image-zoom-container"
              >
                <img 
                  src={image} 
                  alt={name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'var(--transition-slow)'
                  }}
                  className="card-image"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    const fallbacks: Record<string, string> = {
                      flight: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800',
                      yacht: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=800',
                      train: 'https://images.unsplash.com/photo-1541427468627-a89a96e5ca1d?auto=format&fit=crop&q=80&w=800',
                      taxi: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800',
                      hotel: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
                      villa: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
                      resort: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
                      restaurant: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800',
                      bar: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800',
                      experience: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&q=80&w=800'
                    };
                    const key = category || item.type;
                    target.src = fallbacks[key] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800';
                  }}
                />
                
                {/* Top badges */}
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  left: '1rem',
                  display: 'flex',
                  gap: '0.5rem',
                  zIndex: 2
                }}>
                  <span style={{
                    background: 'rgba(6, 6, 8, 0.85)',
                    backdropFilter: 'blur(4px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'var(--color-text-primary)',
                    padding: '0.2rem 0.6rem',
                    fontSize: '0.7rem',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {item.type}
                  </span>

                  {item.type === 'food' && (item.data as any).michelinStars && (
                    <span style={{
                      background: 'rgba(239, 68, 68, 0.9)',
                      color: '#ffffff',
                      padding: '0.2rem 0.6rem',
                      fontSize: '0.7rem',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.2rem'
                    }}>
                      <Star size={10} fill="#ffffff" />
                      {(item.data as any).michelinStars} Michelin Stars
                    </span>
                  )}
                </div>

                {/* API Source tag */}
                <div style={{
                  position: 'absolute',
                  bottom: '1rem',
                  right: '1rem',
                  background: 'rgba(6,6,8,0.7)',
                  backdropFilter: 'blur(4px)',
                  padding: '0.25rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.7rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  zIndex: 2
                }}>
                  <Layers size={10} style={{ color: 'var(--color-gold)' }} />
                  <span style={{ color: 'var(--color-gold)', fontWeight: 500 }}>
                    {category === 'taxi' ? 'Chauffeur Fleet' : apiSource === 'AirService' ? 'Private Aviation' : apiSource === 'LodgingService' ? 'Exclusive Stays' : 'Priority Tables'}
                  </span>
                </div>

                {/* Gradient overlay */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'var(--grad-dark-overlay)',
                  zIndex: 1
                }} />
              </div>

              {/* Card Body */}
              <div style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                flex: 1
              }}>
                {/* Meta details */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.75rem'
                }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{location}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Star size={14} fill="var(--color-gold)" stroke="var(--color-gold)" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-gold-light)' }}>{rating}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 
                  style={{
                    fontSize: '1.45rem',
                    lineHeight: '1.3',
                    marginBottom: '0.75rem',
                    fontWeight: 500
                  }}
                  className="card-title-hover"
                >
                  {name}
                </h3>

                {/* Description */}
                <p style={{
                  fontSize: '0.875rem',
                  lineHeight: '1.6',
                  color: 'var(--color-text-secondary)',
                  marginBottom: '1.25rem',
                  flex: 1
                }}>
                  {description}
                </p>

                {/* Specifications Block (Flights/Yachts specific) */}
                {item.type === 'travel' && item.data.specs && (
                  <div style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem',
                    marginBottom: '1.25rem',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.5rem 1rem'
                  }} onClick={(e) => e.stopPropagation()}>
                    {Object.entries(item.data.specs).map(([key, val]) => (
                      <div key={key} style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>{key}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-primary)', fontWeight: 500 }}>{val}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Highlights Bullet List */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
                    Bespoke Inclusions
                  </span>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {highlights.slice(0, 3).map((hl, i) => (
                      <li key={i} style={{
                        fontSize: '0.8rem',
                        color: 'var(--color-text-primary)',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.4rem',
                        marginBottom: '0.35rem'
                      }}>
                        <ShieldCheck size={12} style={{ color: 'var(--color-gold)', marginTop: '0.2rem', flexShrink: 0 }} />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price and Action Section */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid var(--color-border)',
                  paddingTop: '1.25rem',
                  marginTop: 'auto'
                }}>
                  <div>
                    {(item.data as any).price ? (
                      <>
                        <span style={{
                          fontSize: '1.4rem',
                          fontWeight: 600,
                          color: 'var(--color-text-primary)',
                          fontFamily: 'var(--font-serif)'
                        }}>
                          {safeFormatPrice((item.data as any).price)}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginLeft: '0.2rem' }}>
                          {(item.data as any).priceUnit}
                        </span>
                      </>
                    ) : (
                      <span style={{
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        color: 'var(--color-text-primary)',
                        fontFamily: 'var(--font-serif)'
                      }}>
                        {(item.data as any).priceRange} Range
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInspectAPI(item);
                      }}
                      style={{
                        background: 'none',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text-secondary)',
                        padding: '0.5rem',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'var(--transition-smooth)'
                      }}
                      title="Inspect Simulated API payload"
                      className="inspect-btn"
                    >
                      <Layers size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToItinerary(item);
                        handleInspectAPI(item); // also trigger API logs on adding!
                      }}
                      className="btn-primary"
                      style={{
                        padding: '0.5rem 1rem',
                        fontSize: '0.8rem',
                        borderRadius: 'var(--radius-md)'
                      }}
                    >
                      <Plus size={14} />
                      <span>Reserve</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Listing Details Modal */}
      {selectedItem && (() => {
        const { name, description, image, rating, location, highlights, apiSource, category } = selectedItem.data;
        const apiName = category === 'taxi' ? 'Chauffeur Fleet' : apiSource === 'AirService' ? 'Private Aviation' : apiSource === 'LodgingService' ? 'Exclusive Stays' : 'Priority Tables';
        
        const specs: [string, string][] = [];
        if (selectedItem.type === 'travel') {
          if (selectedItem.data.specs) {
            Object.entries(selectedItem.data.specs).forEach(([k, v]) => specs.push([k, v]));
          }
        } else if (selectedItem.type === 'stay') {
          const stay = selectedItem.data;
          if (stay.features) {
            specs.push(['Features', stay.features.join(', ')]);
          }
          if (stay.reviewsCount) {
            specs.push(['ReviewsCount', `${stay.reviewsCount} reviews`]);
          }
        } else if (selectedItem.type === 'food') {
          const food = selectedItem.data;
          if (food.signatureDish) {
            specs.push(['Signature Dish', food.signatureDish]);
          }
          if (food.priceRange) {
            specs.push(['Price Range', food.priceRange]);
          }
          if (food.michelinStars) {
            specs.push(['Michelin Stars', '★'.repeat(food.michelinStars)]);
          }
        } else if (selectedItem.type === 'experience') {
          const exp = selectedItem.data;
          if (exp.duration) {
            specs.push(['Duration', exp.duration]);
          }
        }

        return (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(3, 3, 5, 0.85)',
            backdropFilter: 'blur(12px)',
            zIndex: 2000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '1.5rem'
          }} onClick={() => setSelectedItem(null)}>
            
            <div style={{
              width: '100%',
              maxWidth: '650px',
              maxHeight: '90vh',
              background: 'rgba(18, 18, 24, 0.96)',
              border: '1px solid var(--color-border)',
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
                onClick={() => setSelectedItem(null)}
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

              {/* Cover Image */}
              <div style={{ width: '100%', height: '280px', position: 'relative', overflow: 'hidden' }}>
                <img 
                   src={image} 
                   alt={name} 
                   style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                   onError={(e) => {
                     const target = e.target as HTMLImageElement;
                     const fallbacks: Record<string, string> = {
                       flight: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800',
                       yacht: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=800',
                       train: 'https://images.unsplash.com/photo-1541427468627-a89a96e5ca1d?auto=format&fit=crop&q=80&w=800',
                       taxi: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800',
                       hotel: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
                       villa: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
                       resort: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
                       restaurant: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800',
                       bar: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800',
                       experience: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&q=80&w=800'
                     };
                     const key = (selectedItem.data as any).category || selectedItem.type;
                     target.src = fallbacks[key] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800';
                   }}
                 />
                <div style={{
                  position: 'absolute',
                  bottom: '1rem',
                  left: '1.5rem',
                  background: 'rgba(6, 6, 8, 0.75)',
                  backdropFilter: 'blur(4px)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'var(--color-gold)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {apiName}
                </div>
              </div>

              {/* Content body */}
              <div style={{ padding: '2rem' }}>
                {/* Meta Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
                    <MapPin size={14} style={{ color: 'var(--color-gold)' }} />
                    <span>{location}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Star size={14} fill="var(--color-gold)" stroke="var(--color-gold)" />
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-gold-light)' }}>{rating}</span>
                  </div>
                </div>

                {/* Title */}
                <h2 style={{
                  fontSize: '2rem',
                  fontWeight: 400,
                  marginBottom: '1rem',
                  fontFamily: 'var(--font-serif)',
                  lineHeight: '1.2'
                }}>
                  {name}
                </h2>

                {/* Full Description */}
                <p style={{
                  fontSize: '0.925rem',
                  lineHeight: '1.7',
                  color: 'var(--color-text-secondary)',
                  marginBottom: '2rem'
                }}>
                  {description}
                </p>

                {/* Specs / Features Grid */}
                {specs.length > 0 && (
                  <div style={{
                    marginBottom: '2rem',
                    background: 'rgba(255, 255, 255, 0.01)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem'
                  }}>
                    <h4 style={{
                      fontSize: '0.8rem',
                      textTransform: 'uppercase',
                      color: 'var(--color-text-muted)',
                      fontWeight: 600,
                      letterSpacing: '0.05em',
                      marginBottom: '0.75rem'
                    }}>
                      Technical & Service Details
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      {specs.map(([k, v]) => (
                        <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                          <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>{k}</span>
                          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-primary)', fontWeight: 500 }}>{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Inclusions List */}
                <div style={{ marginBottom: '2.5rem' }}>
                  <h4 style={{
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    color: 'var(--color-text-muted)',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    marginBottom: '0.75rem'
                  }}>
                    Bespoke Inclusions
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    {highlights.map((hl, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', fontSize: '0.85rem' }}>
                        <ShieldCheck size={14} style={{ color: 'var(--color-gold)', marginTop: '0.2rem', flexShrink: 0 }} />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Section */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid var(--color-border)',
                  paddingTop: '1.5rem'
                }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block' }}>
                      Exclusive Rate
                    </span>
                    {(selectedItem.data as any).price ? (
                      <>
                        <span style={{ fontSize: '1.8rem', fontWeight: 600, color: 'var(--color-text-primary)', fontFamily: 'var(--font-serif)' }}>
                          {safeFormatPrice((selectedItem.data as any).price)}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginLeft: '0.25rem' }}>
                          {(selectedItem.data as any).priceUnit}
                        </span>
                      </>
                    ) : (
                      <span style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--color-text-primary)', fontFamily: 'var(--font-serif)' }}>
                        {(selectedItem.data as any).priceRange} Range
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      onClick={() => handleInspectAPI(selectedItem)}
                      style={{
                        background: 'none',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text-secondary)',
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'var(--transition-smooth)'
                      }}
                      title="Inspect Simulated API payload"
                      className="inspect-btn"
                    >
                      <Layers size={18} />
                    </button>
                    <button
                      onClick={() => {
                        onAddToItinerary(selectedItem);
                        handleInspectAPI(selectedItem);
                        setSelectedItem(null);
                      }}
                      className="btn-primary"
                      style={{
                        padding: '0.75rem 1.75rem',
                        fontSize: '0.9rem',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <Plus size={16} />
                      <span>Reserve Curation</span>
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>
        );
      })()}

      <style>{`
        .image-zoom-container:hover .card-image {
          transform: scale(1.05);
        }
        .inspect-btn:hover {
          border-color: var(--color-gold) !important;
          color: var(--color-gold) !important;
        }
        .card-title-hover {
          transition: color 0.2s ease;
        }
        .card-title-hover:hover {
          color: var(--color-gold) !important;
        }
        .modal-close-btn:hover {
          border-color: var(--color-gold) !important;
          color: var(--color-gold) !important;
          background: rgba(223, 195, 132, 0.08) !important;
        }
        @keyframes modalSlideUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @media (max-width: 768px) {
          .luxury-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
