import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Plus, Layers, Check } from 'lucide-react';
import type { LuxuryItem } from '../data/mockData';
import { travelList, stayList, foodList, experienceList } from '../data/mockData';

interface Message {
  id: string;
  sender: 'user' | 'concierge';
  text: string;
  timestamp: Date;
  recommendations?: LuxuryItem[];
  apiSourceInfo?: string;
}

interface ConciergeProps {
  onAddToItinerary: (item: LuxuryItem) => void;
  triggerApiLog: (api: 'AirService' | 'LodgingService' | 'ConciergeRegistry', endpoint: string, request: any, response: any) => void;
  itinerary: LuxuryItem[];
}

export const Concierge: React.FC<ConciergeProps> = ({ onAddToItinerary, triggerApiLog, itinerary }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'concierge',
      text: 'Good day. I am your personal Luxury My Travel Concierge. Tell me where you wish to journey, or let me design an exquisite itinerary of private aviation, superyachts, 5-star sanctuaries, and fine dining.',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    { text: "Romantic Lake Como yacht getaway", type: "lake_como" },
    { text: "Private Jet trip to Maldives villa", type: "maldives" },
    { text: "Michelin-starred European gastro tour", type: "michelin" }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string, type?: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text,
      timestamp: new Date()
    };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputText('');
    setIsTyping(true);

    const catalog = [
      ...travelList.map(t => ({ type: 'travel', data: t })),
      ...stayList.map(s => ({ type: 'stay', data: s })),
      ...foodList.map(f => ({ type: 'food', data: f })),
      ...experienceList.map(e => ({ type: 'experience', data: e }))
    ];

    try {
      const response = await fetch('/api/concierge/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ sender: m.sender, text: m.text })),
          catalog
        })
      });

      if (!response.ok) {
        throw new Error('Fallback to mock');
      }

      const data = await response.json();
      const replyText = data.reply;

      // Extract recommendations based on keywords in response text
      const recommendations: LuxuryItem[] = [];
      const lowerReply = replyText.toLowerCase();
      
      travelList.forEach(t => {
        if (lowerReply.includes(t.name.toLowerCase()) && !recommendations.some(r => r.data.id === t.id)) {
          recommendations.push({ type: 'travel', data: t });
        }
      });
      stayList.forEach(s => {
        if (lowerReply.includes(s.name.toLowerCase()) && !recommendations.some(r => r.data.id === s.id)) {
          recommendations.push({ type: 'stay', data: s });
        }
      });
      foodList.forEach(f => {
        if (lowerReply.includes(f.name.toLowerCase()) && !recommendations.some(r => r.data.id === f.id)) {
          recommendations.push({ type: 'food', data: f });
        }
      });
      experienceList.forEach(e => {
        if (lowerReply.includes(e.name.toLowerCase()) && !recommendations.some(r => r.data.id === e.id)) {
          recommendations.push({ type: 'experience', data: e });
        }
      });

      // Log to inspect panel
      triggerApiLog('ConciergeRegistry', 'POST /api/concierge/chat', { prompt: text }, { reply: replyText });

      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Math.random().toString(),
        sender: 'concierge',
        text: replyText,
        timestamp: new Date(),
        recommendations,
        apiSourceInfo: 'Luxury My Travel Security-Fortified AI Agent'
      }]);

    } catch (err) {
      console.warn("AI Concierge API failed, using fallback mock response:", err);
      
      // Simulate concierge thinking & querying APIs (Fallback)
      setTimeout(() => {
        let replyText = '';
        let recommendations: LuxuryItem[] = [];
        let apiSourceInfo = '';

        const lctype = type || text.toLowerCase();

        if (lctype.includes('como') || lctype.includes('lake_como') || lctype.includes('italy')) {
          apiSourceInfo = 'Luxury Lodging & Dining Registries';
          replyText = "An outstanding choice. Lake Como represents the pinnacle of Italian romance. I have consulted our dining curations database and Luxury Yacht Charter registries. Here are my elite recommendations for your getaway: Villa d'Este, the iconic Benetti Oasis superyacht, and a dining reservation at Osteria Francescana in nearby Modena.";
          
          const villa = stayList.find(s => s.id === 's-3');
          const yacht = travelList.find(t => t.id === 't-3');
          const dining = foodList.find(f => f.id === 'f-3');
          
          if (yacht) recommendations.push({ type: 'travel', data: yacht });
          if (villa) recommendations.push({ type: 'stay', data: villa });
          if (dining) recommendations.push({ type: 'food', data: dining });

          triggerApiLog('LodgingService', 'GET /v2/shopping/charters/yachts', { location: "Lake Como" }, { data: [yacht] });
          triggerApiLog('ConciergeRegistry', 'GET /v1/location/s-3/details', { locationId: "s-3" }, { data: villa });

        } else if (lctype.includes('maldives') || lctype.includes('jet') || lctype.includes('flight')) {
          apiSourceInfo = 'Aviation Charter & Luxury Stays systems';
          replyText = "To ensure absolute privacy and luxury, I have arranged flight paths for a Gulfstream G650ER private charter, combined with an overwater retreat at Soneva Jani, Maldives retrieved from our luxury accommodations registry.";
          
          const jet = travelList.find(t => t.id === 't-1');
          const soneva = stayList.find(s => s.id === 's-1');
          const islandEx = experienceList.find(e => e.id === 'e-3');

          if (jet) recommendations.push({ type: 'travel', data: jet });
          if (soneva) recommendations.push({ type: 'stay', data: soneva });
          if (islandEx) recommendations.push({ type: 'experience', data: islandEx });

          triggerApiLog('AirService', 'POST /v1/offer_requests', { origin: "LHR", destination: "MLE" }, { data: { offers: [jet] } });
          triggerApiLog('LodgingService', 'GET /v3/shopping/hotel-offers', { hotelId: "s-1" }, { data: soneva });

        } else if (lctype.includes('michelin') || lctype.includes('food') || lctype.includes('dining')) {
          apiSourceInfo = 'Gourmet Culinary Registries';
          replyText = "For the refined palate, I have queried our elite culinary database. I recommend reserving a table at Mirazur in Menton, France (3 Michelin Stars) and dropping by the famous Connaught Bar in Mayfair, London. I can also schedule an exclusive private wine-tasting excursion.";
          
          const mirazur = foodList.find(f => f.id === 'f-1');
          const connaught = foodList.find(f => f.id === 'f-2');
          const wineEx = experienceList.find(e => e.id === 'e-1');

          if (mirazur) recommendations.push({ type: 'food', data: mirazur });
          if (connaught) recommendations.push({ type: 'food', data: connaught });
          if (wineEx) recommendations.push({ type: 'experience', data: wineEx });

          triggerApiLog('ConciergeRegistry', 'GET /v1/location/f-1/details', { locationId: "f-1" }, { data: mirazur });
          triggerApiLog('ConciergeRegistry', 'GET /v1/location/f-2/details', { locationId: "f-2" }, { data: connaught });

        } else {
          apiSourceInfo = 'Bespoke Curations Registry';
          replyText = `I have received your request for "${text}". I have queried our linked travel and dining systems. Let me recommend these outstanding location-dependent bespoke selections to construct your ultimate itinerary:`;
          
          const exp = experienceList[1] || experienceList[0];
          const stay = stayList[1] || stayList[0];
          
          if (stay) recommendations.push({ type: 'stay', data: stay });
          if (exp) recommendations.push({ type: 'experience', data: exp });

          triggerApiLog('LodgingService', 'GET /v3/shopping/hotel-offers', { search: text }, { data: [stay] });
        }

        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: Math.random().toString(),
          sender: 'concierge',
          text: replyText,
          timestamp: new Date(),
          recommendations,
          apiSourceInfo
        }]);
      }, 1500);
    }
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', paddingBottom: '3rem' }} className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <Sparkles size={24} style={{ color: 'var(--color-gold)' }} />
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 400 }}>Bespoke Luxury Concierge</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Chat with our AI travel planner connected to our integrated luxury distribution networks</p>
        </div>
      </div>

      {/* Main chat window */}
      <div className="glass-panel" style={{
        display: 'flex',
        flexDirection: 'column',
        height: '600px',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        border: '1px solid rgba(223, 195, 132, 0.15)'
      }}>
        {/* Messages area */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          {messages.map((msg) => {
            const isConcierge = msg.sender === 'concierge';
            return (
              <div 
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: isConcierge ? 'flex-start' : 'flex-end',
                  gap: '1rem',
                  alignItems: 'flex-start',
                  maxWidth: '85%'
                }}
                className={isConcierge ? 'msg-concierge' : 'msg-user'}
              >
                {isConcierge && (
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'var(--grad-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#060608',
                    flexShrink: 0
                  }}>
                    <Sparkles size={16} />
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {/* Chat bubble */}
                  <div style={{
                    background: isConcierge ? 'var(--color-bg-hover)' : 'var(--grad-gold)',
                    color: isConcierge ? 'var(--color-text-primary)' : '#060608',
                    padding: '1rem 1.25rem',
                    borderRadius: isConcierge ? '0 16px 16px 16px' : '16px 0 16px 16px',
                    border: isConcierge ? '1px solid var(--color-border)' : 'none',
                    fontSize: '0.925rem',
                    lineHeight: '1.6',
                    boxShadow: isConcierge ? 'none' : '0 4px 12px rgba(223, 195, 132, 0.15)'
                  }}>
                    {msg.text}

                    {/* Metadata tag */}
                    {isConcierge && msg.apiSourceInfo && (
                      <div style={{
                        marginTop: '0.75rem',
                        fontSize: '0.7rem',
                        color: 'var(--color-gold)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        borderTop: '1px solid rgba(255,255,255,0.05)',
                        paddingTop: '0.5rem'
                      }}>
                        <Layers size={10} />
                        <span>Retrieved via APIs: {msg.apiSourceInfo}</span>
                      </div>
                    )}
                  </div>

                  {/* Recommendations block */}
                  {isConcierge && msg.recommendations && msg.recommendations.length > 0 && (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                      marginTop: '0.5rem'
                    }}>
                      <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                        Recommended Curations:
                      </span>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem'
                      }}>
                        {msg.recommendations.map((rec, i) => (
                          <div 
                            key={i}
                            className="glass-panel"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '0.75rem 1rem',
                              borderRadius: 'var(--radius-md)',
                              background: '#09090b',
                              gap: '1rem'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <img 
                                src={rec.data.image} 
                                alt={rec.data.name} 
                                style={{ width: '50px', height: '40px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  const fallbacks: Record<string, string> = {
                                    travel: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800',
                                    stay: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
                                    food: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800',
                                    experience: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&q=80&w=800'
                                  };
                                  target.src = fallbacks[rec.type] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800';
                                }}
                              />
                              <div>
                                <span style={{ fontSize: '0.65rem', color: 'var(--color-gold)', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>
                                  {rec.type}
                                </span>
                                <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                                  {rec.data.name}
                                </span>
                              </div>
                            </div>
                            {(() => {
                              const isAdded = itinerary.some(it => it.data.id === rec.data.id);
                              return (
                                <button
                                  onClick={() => !isAdded && onAddToItinerary(rec)}
                                  className={isAdded ? "btn-secondary" : "btn-primary"}
                                  disabled={isAdded}
                                  style={{ 
                                    padding: '0.4rem 0.75rem', 
                                    fontSize: '0.7rem', 
                                    borderRadius: 'var(--radius-sm)',
                                    opacity: isAdded ? 0.7 : 1,
                                    cursor: isAdded ? 'default' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem'
                                  }}
                                >
                                  {isAdded ? <Check size={10} /> : <Plus size={10} />}
                                  <span>{isAdded ? 'Added' : 'Add'}</span>
                                </button>
                              );
                            })()}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {!isConcierge && (
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-text-primary)',
                    flexShrink: 0
                  }}>
                    <User size={16} />
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'var(--grad-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#060608'
              }}>
                <Sparkles size={16} />
              </div>
              <div style={{
                background: 'var(--color-bg-hover)',
                border: '1px solid var(--color-border)',
                padding: '0.75rem 1.25rem',
                borderRadius: '0 16px 16px 16px',
                display: 'flex',
                gap: '0.25rem',
                alignItems: 'center'
              }}>
                <span className="dot" style={{ width: '6px', height: '6px', background: 'var(--color-gold)', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out' }} />
                <span className="dot" style={{ width: '6px', height: '6px', background: 'var(--color-gold)', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out 0.2s' }} />
                <span className="dot" style={{ width: '6px', height: '6px', background: 'var(--color-gold)', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out 0.4s' }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input box */}
        <div style={{
          padding: '1.25rem',
          borderTop: '1px solid var(--color-border)',
          background: '#09090b',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {/* Quick recommendations */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p.text, p.type)}
                style={{
                  background: 'none',
                  border: '1px solid var(--color-border)',
                  borderRadius: '20px',
                  color: 'var(--color-text-secondary)',
                  padding: '0.35rem 1rem',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  transition: 'var(--transition-smooth)'
                }}
                className="pill-btn"
              >
                {p.text}
              </button>
            ))}
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
            style={{ display: 'flex', gap: '0.75rem' }}
          >
            <input
              type="text"
              placeholder="Inquire with your concierge (e.g. 'Plan a private jet trip to Maldives overwater resort')..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={{
                flex: 1,
                background: 'var(--color-bg-hover)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text-primary)',
                padding: '0.75rem 1.25rem',
                outline: 'none',
                fontSize: '0.9rem',
                transition: 'var(--transition-smooth)'
              }}
              className="chat-input"
            />
            <button 
              type="submit" 
              className="btn-primary"
              style={{ padding: '0 1.5rem' }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .pill-btn:hover {
          border-color: var(--color-gold) !important;
          color: var(--color-gold) !important;
        }
        .chat-input:focus {
          border-color: rgba(223, 195, 132, 0.4) !important;
          box-shadow: 0 0 10px rgba(223, 195, 132, 0.08);
        }
        .msg-user {
          margin-left: auto;
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1.0); }
        }
      `}</style>
    </div>
  );
};
