import React, { useEffect } from 'react';
import type { LuxuryItem } from '../data/mockData';
import { ArrowLeft, Star, ShieldCheck, Layers, Plus, MapPin, Check } from 'lucide-react';

interface CurationDetailProps {
  item: LuxuryItem;
  onBack: () => void;
  onAddToItinerary: (item: LuxuryItem) => void;
  triggerApiLog: (api: 'AirService' | 'LodgingService' | 'ConciergeRegistry', endpoint: string, request: any, response: any) => void;
  formatPrice: (amountUSD: number) => string;
  allRecommendations: LuxuryItem[];
  onSelectRelated: (item: LuxuryItem) => void;
  itinerary: LuxuryItem[];
}

export const CurationDetail: React.FC<CurationDetailProps> = ({
  item,
  onBack,
  onAddToItinerary,
  triggerApiLog,
  formatPrice,
  allRecommendations,
  onSelectRelated,
  itinerary,
}) => {
  const { name, description, image, rating, location, highlights, apiSource, category } = item.data;
  
  const apiName = category === 'taxi' 
    ? 'Chauffeur Fleet' 
    : apiSource === 'AirService' 
      ? 'Private Aviation' 
      : apiSource === 'LodgingService' 
        ? 'Exclusive Stays' 
        : 'Priority Tables';

  const specs: [string, string][] = [];
  if (item.type === 'travel') {
    if (item.data.specs) {
      Object.entries(item.data.specs).forEach(([k, v]) => specs.push([k, v]));
    }
  } else if (item.type === 'stay') {
    const stay = item.data;
    if (stay.features) {
      specs.push(['Features', stay.features.join(', ')]);
    }
    if (stay.reviewsCount) {
      specs.push(['Reviews', `${stay.reviewsCount} reviews`]);
    }
  } else if (item.type === 'food') {
    const food = item.data;
    if (food.signatureDish) {
      specs.push(['Signature Dish', food.signatureDish]);
    }
    if (food.priceRange) {
      specs.push(['Price Range', food.priceRange]);
    }
    if (food.michelinStars) {
      specs.push(['Michelin Stars', '★'.repeat(food.michelinStars)]);
    }
  } else if (item.type === 'experience') {
    const exp = item.data;
    if (exp.duration) {
      specs.push(['Duration', exp.duration]);
    }
  }

  // Handle Inspect API Payload
  const handleInspectAPI = () => {
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

  // Trigger API logs automatically on page load
  useEffect(() => {
    handleInspectAPI();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // SEO updates
    const prevTitle = document.title;
    document.title = `${name} | Luxury My Travel Curation`;

    let metaDesc = document.querySelector('meta[name="description"]');
    const prevDesc = metaDesc ? metaDesc.getAttribute('content') : '';
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    return () => {
      document.title = prevTitle;
      if (metaDesc && prevDesc) {
        metaDesc.setAttribute('content', prevDesc);
      }
    };
  }, [item]);

  // Find related curation recommendations
  const relatedItems = allRecommendations
    .filter(rec => rec.data.id !== item.data.id && (rec.type === item.type || rec.data.category === item.data.category))
    .slice(0, 3);

  // If we don't have enough, pull general ones
  if (relatedItems.length < 3) {
    const ids = new Set(relatedItems.map(r => r.data.id));
    ids.add(item.data.id);
    const extra = allRecommendations
      .filter(rec => !ids.has(rec.data.id))
      .slice(0, 3 - relatedItems.length);
    relatedItems.push(...extra);
  }

  const safeFormatPrice = typeof formatPrice === 'function' ? formatPrice : (amount: number) => `$${amount.toLocaleString()}`;

  return (
    <div style={{ paddingBottom: '6rem' }}>
      {/* Hero Banner Section */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '420px',
        overflow: 'hidden',
        borderBottom: '1px solid var(--color-border)'
      }}>
        <img 
          src={image} 
          alt={name} 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
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
        
        {/* Obsidian Overlay Gradient */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to bottom, rgba(6, 6, 8, 0.3) 0%, rgba(6, 6, 8, 0.85) 100%)',
          zIndex: 1
        }} />

        {/* Content Info Container inside Hero */}
        <div className="luxury-container" style={{
          position: 'absolute',
          bottom: '2.5rem',
          left: 0,
          right: 0,
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          {/* Breadcrumb / Back button */}
          <button 
            onClick={onBack}
            className="glass-panel"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--color-text-primary)',
              background: 'rgba(6, 6, 8, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '0.5rem 1rem',
              fontSize: '0.8rem',
              fontWeight: 500,
              borderRadius: '30px',
              cursor: 'pointer',
              alignSelf: 'flex-start',
              marginBottom: '1rem',
              transition: 'var(--transition-smooth)'
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-gold)';
              (e.currentTarget as HTMLElement).style.color = 'var(--color-gold)';
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.1)';
              (e.currentTarget as HTMLElement).style.color = 'var(--color-text-primary)';
            }}
          >
            <ArrowLeft size={14} />
            <span>Back to Catalog</span>
          </button>

          {/* Badges Row */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{
              background: 'var(--grad-gold)',
              color: '#060608',
              padding: '0.25rem 0.75rem',
              fontSize: '0.7rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              {item.type}
            </span>
            <span style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: 'var(--color-text-primary)',
              padding: '0.25rem 0.75rem',
              fontSize: '0.7rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
              letterSpacing: '0.05em'
            }}>
              {apiName}
            </span>
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: '3rem',
            lineHeight: '1.1',
            fontFamily: 'var(--font-serif)',
            fontWeight: 400,
            textShadow: '0 2px 10px rgba(0,0,0,0.5)'
          }}>
            {name}
          </h1>

          {/* Location & Rating Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MapPin size={16} style={{ color: 'var(--color-gold)' }} />
              <span>{location}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Star size={16} fill="var(--color-gold)" stroke="var(--color-gold)" />
              <span style={{ fontWeight: 600, color: 'var(--color-gold-light)' }}>{rating} rating</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Page Columns */}
      <div className="luxury-container" style={{ marginTop: '3rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 380px',
          gap: '3rem'
        }} className="detail-layout-grid">
          
          {/* Left Column (Content) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {/* Overview */}
            <div>
              <h2 style={{
                fontSize: '1.75rem',
                fontFamily: 'var(--font-serif)',
                fontWeight: 500,
                marginBottom: '1rem',
                borderBottom: '1px solid var(--color-border)',
                paddingBottom: '0.5rem'
              }}>
                Curation Overview
              </h2>
              <p style={{
                fontSize: '1.05rem',
                lineHeight: '1.8',
                color: 'var(--color-text-secondary)'
              }}>
                {description}
              </p>
            </div>

            {/* Specifications */}
            {specs.length > 0 && (
              <div>
                <h2 style={{
                  fontSize: '1.75rem',
                  fontFamily: 'var(--font-serif)',
                  fontWeight: 500,
                  marginBottom: '1.25rem',
                  borderBottom: '1px solid var(--color-border)',
                  paddingBottom: '0.5rem'
                }}>
                  Curation Specifications
                </h2>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                  gap: '1.25rem'
                }}>
                  {specs.map(([k, v]) => (
                    <div 
                      key={k} 
                      className="glass-panel"
                      style={{
                        padding: '1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.25rem',
                        borderRadius: 'var(--radius-md)'
                      }}
                    >
                      <span style={{
                        fontSize: '0.7rem',
                        textTransform: 'uppercase',
                        color: 'var(--color-text-muted)',
                        fontWeight: 600,
                        letterSpacing: '0.05em'
                      }}>
                        {k}
                      </span>
                      <span style={{
                        fontSize: '1rem',
                        color: 'var(--color-text-primary)',
                        fontWeight: 500
                      }}>
                        {v}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bespoke Inclusions */}
            <div>
              <h2 style={{
                fontSize: '1.75rem',
                fontFamily: 'var(--font-serif)',
                fontWeight: 500,
                marginBottom: '1.25rem',
                borderBottom: '1px solid var(--color-border)',
                paddingBottom: '0.5rem'
              }}>
                Bespoke Inclusions
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1rem'
              }}>
                {highlights.map((hl, i) => (
                  <div 
                    key={i} 
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.6rem',
                      fontSize: '0.95rem'
                    }}
                  >
                    <ShieldCheck size={18} style={{ color: 'var(--color-gold)', flexShrink: 0, marginTop: '0.15rem' }} />
                    <span style={{ color: 'var(--color-text-secondary)' }}>{hl}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (Booking Widget) */}
          <div>
            <div 
              className="glass-panel-glow" 
              style={{
                position: 'sticky',
                top: '6rem',
                padding: '2rem',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                boxShadow: 'var(--shadow-premium), 0 15px 40px rgba(0,0,0,0.6)'
              }}
            >
              <div>
                <span style={{
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-muted)',
                  fontWeight: 600,
                  display: 'block',
                  marginBottom: '0.25rem',
                  letterSpacing: '0.05em'
                }}>
                  Exclusive Luxury Curation Rate
                </span>
                
                {(item.data as any).price ? (
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                    <span style={{
                      fontSize: '2.5rem',
                      fontWeight: 600,
                      color: 'var(--color-text-primary)',
                      fontFamily: 'var(--font-serif)',
                      lineHeight: 1
                    }}>
                      {safeFormatPrice((item.data as any).price)}
                    </span>
                    <span style={{
                      fontSize: '0.85rem',
                      color: 'var(--color-text-muted)'
                    }}>
                      / {(item.data as any).priceUnit}
                    </span>
                  </div>
                ) : (
                  <span style={{
                    fontSize: '1.8rem',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    fontFamily: 'var(--font-serif)'
                  }}>
                    {(item.data as any).priceRange} Price Tier
                  </span>
                )}
              </div>

              {/* Specs Snippet */}
              <div style={{
                borderTop: '1px solid var(--color-border)',
                borderBottom: '1px solid var(--color-border)',
                padding: '1rem 0',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Location</span>
                  <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{location}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Curation Rating</span>
                  <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{rating} / 5.0</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Provider Service</span>
                  <span style={{ color: 'var(--color-gold)', fontWeight: 500 }}>{apiName}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {(() => {
                  const isAdded = itinerary.some(it => it.data.id === item.data.id);
                  return (
                    <button
                      onClick={() => {
                        if (!isAdded) {
                          onAddToItinerary(item);
                          handleInspectAPI(); // also log api request/response payload
                        }
                      }}
                      className={isAdded ? "btn-secondary" : "btn-primary"}
                      disabled={isAdded}
                      style={{
                        width: '100%',
                        padding: '1rem 2rem',
                        fontSize: '0.95rem',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        opacity: isAdded ? 0.7 : 1,
                        cursor: isAdded ? 'default' : 'pointer'
                      }}
                    >
                      {isAdded ? <Check size={18} /> : <Plus size={18} />}
                      <span>{isAdded ? 'Curation Reserved' : 'Reserve Curation'}</span>
                    </button>
                  );
                })()}

                <button
                  onClick={handleInspectAPI}
                  className="btn-secondary"
                  style={{
                    width: '100%',
                    padding: '0.85rem 2rem',
                    fontSize: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Layers size={16} />
                  <span>Inspect GDS Payload</span>
                </button>
              </div>

              {/* Security/Trust Tag */}
              <div style={{
                textAlign: 'center',
                fontSize: '0.75rem',
                color: 'var(--color-text-muted)',
                marginTop: '0.5rem'
              }}>
                Fully backed by Luxury My Travel Bespoke Guarantee & Priority Booking Channels.
              </div>
            </div>
          </div>

        </div>

        {/* Related Recommendations Carousel / Section */}
        {relatedItems.length > 0 && (
          <div style={{ marginTop: '6rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '2rem'
            }}>
              <h2 style={{
                fontSize: '2rem',
                fontFamily: 'var(--font-serif)',
                fontWeight: 500
              }}>
                Bespoke Recommendations
              </h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '2rem'
            }}>
              {relatedItems.map(rec => {
                const recData = rec.data;
                const recApiName = recData.category === 'taxi' 
                  ? 'Chauffeur Fleet' 
                  : recData.apiSource === 'AirService' 
                    ? 'Private Aviation' 
                    : recData.apiSource === 'LodgingService' 
                      ? 'Exclusive Stays' 
                      : 'Priority Tables';

                return (
                  <div
                    key={recData.id}
                    className="glass-panel"
                    style={{
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      transition: 'var(--transition-smooth)'
                    }}
                    onClick={() => {
                      onSelectRelated(rec);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    {/* Image Cover */}
                    <div style={{
                      position: 'relative',
                      height: '200px',
                      overflow: 'hidden'
                    }}>
                      <img 
                        src={recData.image} 
                        alt={recData.name} 
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'var(--transition-slow)'
                        }}
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
                          const key = recData.category || rec.type;
                          target.src = fallbacks[key] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800';
                        }}
                      />
                      
                      <div style={{
                        position: 'absolute',
                        top: '0.75rem',
                        left: '0.75rem',
                        background: 'rgba(6, 6, 8, 0.85)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'var(--color-text-primary)',
                        padding: '0.15rem 0.5rem',
                        fontSize: '0.65rem',
                        borderRadius: 'var(--radius-sm)',
                        fontWeight: 600,
                        textTransform: 'uppercase'
                      }}>
                        {rec.type}
                      </div>

                      <div style={{
                        position: 'absolute',
                        bottom: '0.75rem',
                        right: '0.75rem',
                        background: 'rgba(6,6,8,0.7)',
                        padding: '0.2rem 0.4rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.65rem',
                        color: 'var(--color-gold)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                      }}>
                        {recApiName}
                      </div>
                    </div>

                    {/* Content body */}
                    <div style={{
                      padding: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      flex: 1,
                      gap: '0.5rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{recData.location}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
                          <Star size={12} fill="var(--color-gold)" stroke="var(--color-gold)" />
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-gold-light)' }}>{recData.rating}</span>
                        </div>
                      </div>

                      <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: 500,
                        lineHeight: '1.3'
                      }}>
                        {recData.name}
                      </h3>

                      <div style={{
                        marginTop: 'auto',
                        paddingTop: '0.75rem',
                        borderTop: '1px solid var(--color-border)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          color: 'var(--color-text-primary)',
                          fontFamily: 'var(--font-serif)'
                        }}>
                          {(recData as any).price ? safeFormatPrice((recData as any).price) : (recData as any).priceRange}
                        </span>
                        <span style={{
                          fontSize: '0.75rem',
                          color: 'var(--color-gold)',
                          fontWeight: 500
                        }}>
                          View Details &rarr;
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
