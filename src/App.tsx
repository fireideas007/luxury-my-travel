import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ItemGrid } from './components/ItemGrid';
import { CurationDetail } from './components/CurationDetail';
import { Itinerary } from './components/Itinerary';
import { Concierge } from './components/Concierge';
import { BlogSystem } from './components/BlogSystem';
import { AboutUs } from './components/AboutUs';
import type { LuxuryItem } from './data/mockData';
import { allLuxuryItems } from './data/mockData';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { TravelService } from './services/travelService';
import { MembershipModal } from './components/MembershipModal';
import type { BookedCuration, UserAccount, PaymentTransaction } from './data/mockData';
import { Plane, X } from 'lucide-react';

const generateDynamicStays = (locationName: string): LuxuryItem[] => {
  const cleanLoc = locationName.replace(/\s*\([A-Z]{3}\)\s*/g, '').trim();
  const lower = cleanLoc.toLowerCase();

  if (lower.includes('jaipur')) {
    return [
      {
        type: 'stay',
        data: {
          id: 'stay-jaipur-rambagh',
          category: 'resort',
          name: 'The Rambagh Palace',
          description: 'Spanning 47 acres of lush gardens, this heritage landmark is the former residence of the Maharaja of Jaipur. Experience ultimate royal grandeur, majestic dining halls, and bespoke butler services.',
          image: 'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?auto=format&fit=crop&q=80&w=800',
          price: 1800,
          priceUnit: 'per night',
          rating: 4.9,
          reviewsCount: 380,
          location: 'Jaipur, India',
          highlights: ['Former royal palace residence', 'Peacock-filled heritage gardens', 'Bespoke Royal Butler Service', 'Award-winning Jiva Grand Spa'],
          features: ['Private Butler', 'Royal Dining', 'Heritage Gardens', 'Historic Palace tours'],
          apiSource: 'LodgingService',
          apiEndpoints: ['POST /stays/search']
        }
      },
      {
        type: 'stay',
        data: {
          id: 'stay-jaipur-amanbagh',
          category: 'resort',
          name: 'Amanbagh Sanctuary Resort',
          description: 'Set within a walled oasis in the rugged Aravalli Hills, Amanbagh is a modern-day palace paying homage to India\'s golden age. Rose-pink marble domes and private pool pavilions offer a serene retreat.',
          image: 'https://images.unsplash.com/photo-1540553016722-983e48a2cd10?auto=format&fit=crop&q=80&w=800',
          price: 2200,
          priceUnit: 'per night',
          rating: 4.9,
          reviewsCount: 140,
          location: 'Alwar, Jaipur Region',
          highlights: ['Rose-pink marble architecture', 'Private pool pavilions', 'Custom Ayurvedic wellness paths', 'Guided heritage village excursions'],
          features: ['Private plunge pools', 'Ayurvedic wellness center', 'Aravalli wilderness tours', 'Organic kitchen garden'],
          apiSource: 'LodgingService',
          apiEndpoints: ['POST /stays/search']
        }
      }
    ];
  }

  if (lower.includes('delhi')) {
    return [
      {
        type: 'stay',
        data: {
          id: 'stay-delhi-leela',
          category: 'resort',
          name: 'The Leela Palace New Delhi',
          description: 'Located in the prestigious Diplomatic Enclave, this palatial hotel blends Lutyens\' architecture with royal Indian heritage. Features gilded ceilings, custom chandeliers, and a rooftop infinity pool.',
          image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
          price: 1200,
          priceUnit: 'per night',
          rating: 4.9,
          reviewsCount: 420,
          location: 'New Delhi, India',
          highlights: ['Michelin-grade dining at Megu', 'Rooftop infinity pool', 'Spacious royal suites', 'Personal butler service'],
          features: ['Diplomatic enclave security', 'Rooftop infinity pool', 'Megu fine dining', 'Palace butler services'],
          apiSource: 'LodgingService',
          apiEndpoints: ['POST /stays/search']
        }
      }
    ];
  }

  if (lower.includes('mumbai')) {
    return [
      {
        type: 'stay',
        data: {
          id: 'stay-mumbai-taj',
          category: 'resort',
          name: 'The Taj Mahal Palace',
          description: 'Mumbai\'s premier landmark overlooking the Gateway of India since 1903. Host to royalty, presidents, and legends of the world.',
          image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800',
          price: 1400,
          priceUnit: 'per night',
          rating: 4.9,
          reviewsCount: 950,
          location: 'Colaba, Mumbai',
          highlights: ['Historic sea-facing rooms', '9 award-winning dining outlets', 'Taj Salon beauty treatments', 'Exclusive Palace Lounge access'],
          features: ['Palace sea views', '9 signature restaurants', 'Luxury yachts charter access', 'Bespoke high-tea service'],
          apiSource: 'LodgingService',
          apiEndpoints: ['POST /stays/search']
        }
      }
    ];
  }

  if (lower.includes('paris')) {
    return [
      {
        type: 'stay',
        data: {
          id: 'stay-paris-crillon',
          category: 'resort',
          name: 'Hôtel de Crillon',
          description: 'Overlooking the Place de la Concorde, this historic palace is a celebration of the French art de vivre. Exquisite interiors by Karl Lagerfeld.',
          image: 'https://images.unsplash.com/photo-1498503182468-3b51cbb6cb24?auto=format&fit=crop&q=80&w=800',
          price: 2800,
          priceUnit: 'per night',
          rating: 4.9,
          reviewsCount: 290,
          location: 'Paris, France',
          highlights: ['Views of Place de la Concorde', 'Karl Lagerfeld designed suites', 'Michelin star dining at L\'Écrin', 'Private subterranean spa'],
          features: ['Concorde suite balconies', 'Karl Lagerfeld custom suites', 'Butler signature packing', 'Subterranean luxury pool'],
          apiSource: 'LodgingService',
          apiEndpoints: ['POST /stays/search']
        }
      },
      {
        type: 'stay',
        data: {
          id: 'stay-paris-meurice',
          category: 'resort',
          name: 'Le Meurice Palace',
          description: 'The hotel of artists and thinkers, combining 18th-century opulence with modern Dali-esque touches. Directly opposite the Tuileries Garden.',
          image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800',
          price: 2500,
          priceUnit: 'per night',
          rating: 4.8,
          reviewsCount: 310,
          location: 'Paris, France',
          highlights: ['Alain Ducasse double-star dining', 'Direct Tuileries Garden views', 'Valmont luxury spa treatments', 'Art-infused private salons'],
          features: ['Opposite Tuileries Gardens', 'Alain Ducasse gastronomy', 'Valmont spa therapies', '18th-century French lounges'],
          apiSource: 'LodgingService',
          apiEndpoints: ['POST /stays/search']
        }
      }
    ];
  }

  if (lower.includes('london')) {
    return [
      {
        type: 'stay',
        data: {
          id: 'stay-london-ritz',
          category: 'resort',
          name: 'The Ritz London',
          description: 'The benchmark of luxury hospitality in Piccadilly. Enjoy classic Edwardian elegance, afternoon tea in the Palm Court, and royal service.',
          image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=800',
          price: 2100,
          priceUnit: 'per night',
          rating: 4.9,
          reviewsCount: 880,
          location: 'London, United Kingdom',
          highlights: ['Edwardian heritage salons', 'Legendary Palm Court tea rooms', 'Michelin-starred Ritz Restaurant', 'Private chauffeur airport pick-up'],
          features: ['Palm Court afternoon tea', 'Royal suite amenities', 'Rolls-Royce fleet access', 'Michelin fine dining'],
          apiSource: 'LodgingService',
          apiEndpoints: ['POST /stays/search']
        }
      }
    ];
  }

  if (lower.includes('new york')) {
    return [
      {
        type: 'stay',
        data: {
          id: 'stay-nyc-plaza',
          category: 'resort',
          name: 'The Plaza Hotel',
          description: 'The historic castle on Fifth Avenue, overlooking Central Park. Experience unmatched Manhattan prestige, gold-plated fixtures, and butler service.',
          image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800',
          price: 1900,
          priceUnit: 'per night',
          rating: 4.8,
          reviewsCount: 1250,
          location: 'New York, United States',
          highlights: ['Overlooking Central Park', 'Bespoke 24-karat gold fixtures', 'Iconic Champagne Bar', 'Exclusive Guerlain Spa access'],
          features: ['Central Park views', 'Guerlain beauty spa', 'Gold-plated fixtures', 'Plaza legacy butler service'],
          apiSource: 'LodgingService',
          apiEndpoints: ['POST /stays/search']
        }
      }
    ];
  }

  if (lower.includes('maldives') || lower.includes('malé') || lower.includes('mle')) {
    return [
      {
        type: 'stay',
        data: {
          id: 'stay-maldives-soneva',
          category: 'resort',
          name: 'Soneva Jani Resort & Reserves',
          description: 'Nestled in the Medhufaru lagoon, Soneva Jani features overwater villas with retractable roofs to stargaze, water slides, and private pools.',
          image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&q=80&w=800',
          price: 4200,
          priceUnit: 'per night',
          rating: 4.9,
          reviewsCount: 190,
          location: 'Noonu Atoll, Maldives',
          highlights: ['Retractable villa roofs', 'Water slide into the lagoon', 'Private water reserves', 'Mr. Friday 24/7 Butler Service'],
          features: ['Overwater water slide', 'Retractable stargazing roof', 'Private lagoon reserve', 'Mr. Friday butler concierge'],
          apiSource: 'LodgingService',
          apiEndpoints: ['POST /stays/search']
        }
      }
    ];
  }

  if (lower.includes('los angeles') || lower.includes('california') || lower.includes('beverly')) {
    return [
      {
        type: 'stay',
        data: {
          id: 'stay-la-beverly',
          category: 'resort',
          name: 'The Beverly Hills Hotel',
          description: 'The legendary \'Pink Palace\' on Sunset Boulevard. Host to Hollywood\'s elite for over a century, featuring private bungalows and cabanas.',
          image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=800',
          price: 2400,
          priceUnit: 'per night',
          rating: 4.9,
          reviewsCount: 750,
          location: 'Beverly Hills, California',
          highlights: ['Bespoke celebrity bungalows', 'Polo Lounge historic dining', 'Palm-lined swimming pool', 'Chauffeur Tesla transfer'],
          features: ['Famous Polo Lounge', 'Pink Bungalows', 'Hollywood luxury cabanas', 'Palm-lined swimming pool'],
          apiSource: 'LodgingService',
          apiEndpoints: ['POST /stays/search']
        }
      }
    ];
  }

  const titleCity = cleanLoc.charAt(0).toUpperCase() + cleanLoc.slice(1);
  return [
    {
      type: 'stay',
      data: {
        id: `stay-dynamic-${lower.replace(/\s+/g, '-')}`,
        category: 'resort',
        name: `The Royal ${titleCity} Sanctuary`,
        description: `Experience state-of-the-art luxury accommodations, curated resort experiences, and unmatched privacy in the heart of ${titleCity}.`,
        image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=800',
        price: 1950,
        priceUnit: 'per night',
        rating: 4.9,
        reviewsCount: 88,
        location: `${titleCity}, Luxury Destination`,
        highlights: ['Private butler service', 'Exclusive infinity pools', 'Michelin fine dining', 'Bespoke wellness sanctuary'],
        features: ['Private butler service', 'Infinity edge pools', 'Fine dining restaurant', 'Holistic spa treatment'],
        apiSource: 'LodgingService',
        apiEndpoints: ['POST /stays/search']
      }
    }
  ];
};

const generateDynamicCars = (locationName: string): LuxuryItem[] => {
  const cleanLoc = locationName.replace(/\s*\([A-Z]{3}\)\s*/g, '').trim();
  const lower = cleanLoc.toLowerCase();
  const titleCity = cleanLoc.charAt(0).toUpperCase() + cleanLoc.slice(1);

  let carName = `Rolls-Royce Ghost (${titleCity} Chauffeur)`;
  let carImage = 'https://images.unsplash.com/photo-1632245889027-e406faaa19ee?auto=format&fit=crop&q=80&w=800';
  let price = 580;
  let highlights = ['Starlight Headliner', 'Whisper-quiet double glazed windows', 'Champagne chiller in console', 'Privacy glass dividers'];
  let carType = 'Elite Chauffeur';

  if (lower.includes('jaipur')) {
    carName = 'Vintage Rolls-Royce Silver Wraith (Jaipur Chauffeur)';
    carImage = 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=800';
    price = 450;
    highlights = ['Fully restored vintage classic', 'Cold rose-water towels onboard', 'Royal concierge escort', 'Champagne service'];
  } else if (lower.includes('paris')) {
    carName = 'Bentley Flying Spur (Paris Chauffeur)';
    carImage = 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800';
    price = 500;
    highlights = ['Bespoke leather interior', 'Fresh macarons & champagne', 'Bi-lingual security chauffeur', 'VIP airport lane access'];
  } else if (lower.includes('london')) {
    carName = 'Rolls-Royce Phantom VIII (London Chauffeur)';
    price = 750;
  } else if (lower.includes('maldives') || lower.includes('malé') || lower.includes('mle')) {
    carName = 'Azimut 55 Private Luxury Yacht (Maldives Sea-Transfer)';
    carImage = 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=800';
    price = 1800;
    highlights = ['Italian luxury design yacht', 'Onboard chef and host', 'Sunset sailing itineraries', 'Direct resort jetty dropoff'];
    carType = 'Private Yacht Charter';
  } else if (lower.includes('los angeles') || lower.includes('california')) {
    carName = 'Lucid Air Sapphire (LA Chauffeur)';
    carImage = 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=800';
    price = 400;
    highlights = ['1,200 HP luxury electric sedan', 'Whisper-quiet cabin', 'Local premium organic snacks', 'VIP airport terminal greeting'];
  }

  return [
    {
      type: 'travel',
      data: {
        id: `car-dynamic-${lower.replace(/\s+/g, '-')}`,
        category: 'taxi',
        type: carType,
        name: carName,
        description: `Enjoy elite high-performance driving. Premium specifications and chauffeur details configured by our exclusive local fleet registry.`,
        image: carImage,
        price,
        priceUnit: 'one way',
        rating: 4.9,
        location: `${titleCity} Executive Services`,
        highlights,
        specs: {
          'Supplier': 'Luxe Chauffeur Registry',
          'Transmission': 'Automatic',
          'Fuel Type': lower.includes('maldives') ? 'Diesel Marine' : 'Electric/Petrol',
          'Category': lower.includes('maldives') ? 'Motor Yacht' : 'Luxury Sedan'
        },
        apiSource: 'AirService',
        apiEndpoints: ['POST /cars/search']
      }
    }
  ];
};

const generateDynamicFlights = (origin: string, destination: string): LuxuryItem[] => {
  const cleanOrig = origin.replace(/\s*\([A-Z]{3}\)\s*/g, '').trim().toUpperCase();
  const cleanDest = destination.replace(/\s*\([A-Z]{3}\)\s*/g, '').trim().toUpperCase();

  return [
    {
      type: 'travel',
      data: {
        id: `flight-dynamic-${cleanOrig}-${cleanDest}-1`,
        category: 'flight',
        type: 'Commercial First Class',
        name: 'Singapore Airlines Suites',
        description: `Experience state-of-the-art luxury suites in the sky from ${cleanOrig} to ${cleanDest}. Award-winning cabins with double beds and Michelin-curated menus.`,
        image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=800',
        price: 8900,
        priceUnit: 'one way',
        rating: 4.9,
        location: `${cleanOrig} to ${cleanDest}`,
        highlights: [
          'Michelin-curated menu',
          'Private cabin with sliding doors',
          'Standalone flat bed & plush seat',
          'Luxury lounge access'
        ],
        specs: {
          'Carrier': 'Singapore Airlines',
          'Duration': '12h 30m',
          'Depart Time': '11:30 AM',
          'Arrive Time': '08:00 AM'
        },
        apiSource: 'AirService',
        apiEndpoints: ['POST /air/offer_requests']
      }
    },
    {
      type: 'travel',
      data: {
        id: `flight-dynamic-${cleanOrig}-${cleanDest}-2`,
        category: 'flight',
        type: 'Commercial First Class',
        name: 'Emirates First Class',
        description: `Indulge in your own private oasis. Slide the doors shut, adjust the mood lighting, and enjoy your personal mini-bar, vanity table, and luxury dining.`,
        image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800',
        price: 9400,
        priceUnit: 'one way',
        rating: 4.9,
        location: `${cleanOrig} to ${cleanDest}`,
        highlights: [
          'A380 Onboard Shower Spa',
          'Fully enclosed private suites',
          'Unlimited Dom Pérignon & Caviar',
          'Onboard Lounge Bar access'
        ],
        specs: {
          'Carrier': 'Emirates',
          'Duration': '13h 15m',
          'Depart Time': '02:15 PM',
          'Arrive Time': '11:30 AM'
        },
        apiSource: 'AirService',
        apiEndpoints: ['POST /air/offer_requests']
      }
    }
  ];
};

function App() {
  const [activeTab, setActiveTab] = useState<string>('explore');
  const [selectedCuration, setSelectedCuration] = useState<LuxuryItem | null>(null);
  const [itinerary, setItinerary] = useState<LuxuryItem[]>([]);
  const [autoCheckout, setAutoCheckout] = useState<boolean>(false);
  
  // Membership States
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [boardingPassToShow, setBoardingPassToShow] = useState<BookedCuration | null>(null);

  // Currency States
  const [currentCurrency, setCurrentCurrency] = useState<string>('USD');
  const [exchangeRates, setExchangeRates] = useState<{ [key: string]: number }>({
    USD: 1,
    INR: 95.25,
    EUR: 0.92,
    GBP: 0.79,
    AED: 3.67,
    CAD: 1.36,
    AUD: 1.51
  });

  useEffect(() => {
    // 1. Fetch Exchange Rates from Open ER API
    const fetchRates = async () => {
      try {
        const res = await fetch('https://open.er-api.com/v6/latest/USD');
        if (res.ok) {
          const data = await res.json();
          if (data.rates) {
            setExchangeRates(data.rates);
          }
        }
      } catch (err) {
        console.error("Failed to fetch exchange rates:", err);
      }
    };

    // 2. Detect User Currency via IP Geolocation
    const detectCurrency = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        if (res.ok) {
          const data = await res.json();
          const detected = data.currency;
          const supported = ['USD', 'INR', 'EUR', 'GBP', 'AED', 'CAD', 'AUD'];
          if (detected && supported.includes(detected)) {
            setCurrentCurrency(detected);
            console.log("Automatically detected user location currency:", detected);
          }
        }
      } catch (err: any) {
        console.log("GeoIP currency detection skipped, using USD default:", err.message);
      }
    };

    fetchRates();
    detectCurrency();
  }, []);

  const getCurrencySymbol = (code: string) => {
    const symbols: { [key: string]: string } = {
      USD: '$',
      INR: '₹',
      EUR: '€',
      GBP: '£',
      AED: 'AED ',
      CAD: 'C$',
      AUD: 'A$'
    };
    return symbols[code] || '$';
  };

  const convertPrice = (priceUSD: any): number => {
    const numPrice = typeof priceUSD === 'number' ? priceUSD : parseFloat(priceUSD);
    if (isNaN(numPrice)) return 0;
    const rate = exchangeRates[currentCurrency] || 1;
    return Math.round(numPrice * rate);
  };

  const formatPrice = (priceUSD: any): string => {
    const numPrice = typeof priceUSD === 'number' ? priceUSD : parseFloat(priceUSD);
    if (isNaN(numPrice)) return 'N/A';
    const converted = convertPrice(numPrice);
    const symbol = getCurrencySymbol(currentCurrency);
    return `${symbol}${converted.toLocaleString()}`;
  };

  // Load session from localStorage on startup
  useEffect(() => {
    const savedUserStr = localStorage.getItem('luxetravel_current_user');
    if (savedUserStr) {
      try {
        setCurrentUser(JSON.parse(savedUserStr));
      } catch (e) {
        console.error('Failed to parse saved user credentials', e);
      }
    }
  }, []);

  const handleLogin = (user: UserAccount) => {
    setCurrentUser(user);
    localStorage.setItem('luxetravel_current_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('luxetravel_current_user');
  };

  const handleAddBooking = (newBookings: BookedCuration[], newPayments: PaymentTransaction[]) => {
    if (!currentUser) return;

    const updatedUser: UserAccount = {
      ...currentUser,
      bookings: [...currentUser.bookings, ...newBookings],
      payments: [...currentUser.payments, ...newPayments]
    };

    setCurrentUser(updatedUser);
    localStorage.setItem('luxetravel_current_user', JSON.stringify(updatedUser));

    // Also update this user's record in the general accounts database
    const savedAccountsStr = localStorage.getItem('luxetravel_accounts') || '[]';
    const savedAccounts: UserAccount[] = JSON.parse(savedAccountsStr);
    const updatedAccounts = savedAccounts.map(acc => 
      acc.email.toLowerCase() === currentUser.email.toLowerCase() ? updatedUser : acc
    );
    localStorage.setItem('luxetravel_accounts', JSON.stringify(updatedAccounts));

    // Clear checked-out items from itinerary!
    setItinerary([]);
  };
  
  // Filtering states
  const [currentCategory, setCurrentCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchLocation, setSearchLocation] = useState<string>('');
  const [filteredItems, setFilteredItems] = useState<LuxuryItem[]>(allLuxuryItems);
  const [liveTravelItems, setLiveTravelItems] = useState<LuxuryItem[]>([]);
  const [liveStayItems, setLiveStayItems] = useState<LuxuryItem[]>([]);

  // Trigger custom Sandbox log (no-op now that Sandbox UI is removed)
  const triggerApiLog = (
    _api: 'AirService' | 'LodgingService' | 'ConciergeRegistry',
    _endpoint: string,
    _request: any,
    _response: any
  ) => {
    // Disabled sandbox logging
  };

  // Filter items logic
  useEffect(() => {
    let result = allLuxuryItems;

    // Replace static flights and cars with live GDS offers if retrieved
    if (liveTravelItems.length > 0) {
      const nonFlightOrTaxiItems = result.filter(item => !(item.type === 'travel' && (item.data.category === 'flight' || item.data.category === 'taxi')));
      result = [...liveTravelItems, ...nonFlightOrTaxiItems];
    }

    // Merge live stays if search retrieved them
    if (liveStayItems.length > 0) {
      const nonStayItems = result.filter(item => item.type !== 'stay');
      result = [...liveStayItems, ...nonStayItems];
    }

    // Category filter
    if (currentCategory !== 'all') {
      result = result.filter(item => item.type === currentCategory);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.data.name.toLowerCase().includes(q) || 
        item.data.description.toLowerCase().includes(q) ||
        item.data.highlights.some(hl => hl.toLowerCase().includes(q))
      );
    }

    // Location filter
    if (searchLocation.trim()) {
      const iataMatch = searchLocation.match(/\(([A-Z]{3})\)/);
      const iata = iataMatch ? iataMatch[1].toLowerCase() : '';
      const cityName = searchLocation.replace(/\s*\([A-Z]{3}\)\s*/g, '').trim().toLowerCase();

      result = result.filter(item => {
        // Live GDS flight, taxi, or stay offers are pre-filtered by request params, so skip text filter
        if (item.data.apiSource === 'AirService' && (item.data.category === 'flight' || item.data.category === 'taxi')) {
          return true;
        }
        if (item.data.apiSource === 'LodgingService') {
          return true;
        }

        const itemLoc = item.data.location.toLowerCase();
        const itemDesc = item.data.description.toLowerCase();

        return (
          itemLoc.includes(cityName) ||
          itemDesc.includes(cityName) ||
          (iata && (itemLoc.includes(iata) || itemDesc.includes(iata)))
        );
      });
    }

    setFilteredItems(result);
  }, [currentCategory, searchQuery, searchLocation, liveTravelItems, liveStayItems]);

  const handleSearch = async (
    category: string, 
    query: string, 
    location: string, 
    origin?: string, 
    departureDate?: string,
    lat?: number,
    lng?: number,
    skipScroll?: boolean
  ) => {
    setSelectedCuration(null);
    setCurrentCategory(category === 'all' ? 'all' : category);
    setSearchQuery(query);
    setSearchLocation(location);

    const getCoords = (searchStr: string): { lat: number, lng: number } => {
      const lower = searchStr.toLowerCase();
      if (lower.includes('jaipur') || lower.includes('jai')) return { lat: 26.8242, lng: 75.8122 };
      if (lower.includes('delhi') || lower.includes('del')) return { lat: 28.5562, lng: 77.1000 };
      if (lower.includes('mumbai') || lower.includes('bom')) return { lat: 19.0896, lng: 72.8656 };
      if (lower.includes('los angeles') || lower.includes('california') || lower.includes('lax')) return { lat: 34.0522, lng: -118.2437 };
      if (lower.includes('san francisco') || lower.includes('sfo')) return { lat: 37.7749, lng: -122.4194 };
      if (lower.includes('san diego') || lower.includes('san')) return { lat: 32.7157, lng: -117.1611 };
      if (lower.includes('malé') || lower.includes('maldives') || lower.includes('mle')) return { lat: 4.1919, lng: 73.5291 };
      if (lower.includes('singapore') || lower.includes('sin')) return { lat: 1.3521, lng: 103.8198 };
      if (lower.includes('london') || lower.includes('lhr')) return { lat: 51.5074, lng: -0.1278 };
      if (lower.includes('new york') || lower.includes('jfk')) return { lat: 40.7128, lng: -74.0060 };
      if (lower.includes('dubai') || lower.includes('dxb')) return { lat: 25.2048, lng: 55.2708 };
      if (lower.includes('tokyo') || lower.includes('hnd')) return { lat: 35.6762, lng: 139.6503 };
      if (lower.includes('venice') || lower.includes('vce')) return { lat: 45.4408, lng: 12.3155 };
      if (lower.includes('paris') || lower.includes('cdg')) return { lat: 48.8566, lng: 2.3522 };
      if (lower.includes('como') || lower.includes('milan') || lower.includes('mxp')) return { lat: 45.4642, lng: 9.1900 };
      if (lower.includes('mallorca') || lower.includes('pmi')) return { lat: 39.5696, lng: 2.6502 };
      if (lower.includes('mykonos') || lower.includes('athens') || lower.includes('ath')) return { lat: 37.9838, lng: 23.7275 };
      if (lower.includes('hawaii') || lower.includes('hnl')) return { lat: 21.3069, lng: -157.8583 };
      return { lat: 48.8566, lng: 2.3522 }; // default Paris
    };

    // If search is for travel (flights & cars) and destination is provided, trigger real requests
    if (category === 'travel' && location.trim()) {
      try {
        const extractIata = (str: string) => {
          const match = str.match(/\(([A-Z]{3})\)/);
          return match ? match[1] : str.toUpperCase().trim();
        };

        let finalOrigin = extractIata(origin || 'LHR');
        let finalDestination = extractIata(location);
        
        if (location.toUpperCase().includes(' TO ')) {
          const parts = location.toUpperCase().split(' TO ');
          finalOrigin = extractIata(parts[0]?.trim() || 'LHR');
          finalDestination = extractIata(parts[1]?.trim() || '');
        }

        // Fetch flight offers
        const travelRes = await TravelService.searchFlights({
          origin: finalOrigin,
          destination: finalDestination,
          departureDate: departureDate || '2026-06-15'
        });

        const mappedLuxuryFlights: LuxuryItem[] = travelRes.offers.map(item => ({ type: 'travel', data: item }));
        
        // Log flights search
        triggerApiLog('AirService', 'POST /air/offer_requests', travelRes.rawRequest, travelRes.rawResponse);

        // Fetch car offers at the destination location
        let mappedLuxuryCars: LuxuryItem[] = [];
        try {
          const coords = lat && lng ? { lat, lng } : getCoords(location);
          const travelCarsRes = await TravelService.searchCars({
            lat: coords.lat,
            lng: coords.lng,
            pickupDate: departureDate || '2026-06-15',
            dropoffDate: '2026-06-22'
          });
          mappedLuxuryCars = travelCarsRes.cars;
          // Log cars search
          triggerApiLog('AirService', 'POST /cars/search', travelCarsRes.rawRequest, travelCarsRes.rawResponse);
        } catch (carErr: any) {
          console.warn("Cars search failed, generating localized mock vehicles:", carErr);
          mappedLuxuryCars = generateDynamicCars(location);
        }

        setLiveTravelItems([...mappedLuxuryFlights, ...mappedLuxuryCars]);
        setLiveStayItems([]);

      } catch (err: any) {
        console.error("Flight search failed, falling back to mock travel curations:", err);
        const extractIata = (str: string) => {
          const match = str.match(/\(([A-Z]{3})\)/);
          return match ? match[1] : str.toUpperCase().trim();
        };
        
        let errorPayload = { error: "Network error or invalid credentials in .env.local" };
        try {
          if (err.errorPayload) {
            errorPayload = err.errorPayload;
          } else if (err.message) {
            errorPayload = JSON.parse(err.message);
          }
        } catch {
          errorPayload = { error: err.message || "Network error or invalid credentials in .env.local" };
        }

        triggerApiLog('AirService', 'POST /air/offer_requests (FAILED)', 
          { origin: extractIata(origin || "LHR"), destination: extractIata(location), departure_date: departureDate || "2026-06-15" }, 
          errorPayload
        );
        
        // Fallback to localized, dynamic high-fidelity mock flights and cars
        const dynamicFlights = generateDynamicFlights(origin || "LHR", location);
        const dynamicCars = generateDynamicCars(location);
        setLiveTravelItems([...dynamicFlights, ...dynamicCars]);
        setLiveStayItems([]);
      }
    } else if (category === 'stay' && location.trim()) {
      try {
        const coords = lat && lng ? { lat, lng } : getCoords(location);
        const travelStaysRes = await TravelService.searchStays({
          lat: coords.lat,
          lng: coords.lng,
          checkInDate: '2026-06-15',
          checkOutDate: '2026-06-22'
        });
        setLiveStayItems(travelStaysRes.stays);
        setLiveTravelItems([]);
        
        // Log stays search
        triggerApiLog('LodgingService', 'POST /stays/search', travelStaysRes.rawRequest, travelStaysRes.rawResponse);
      } catch (err: any) {
        console.error("Stays search failed, falling back to mock stay curations:", err);
        let errorPayload = { error: "Failed to search stays on GDS" };
        try {
          if (err.message) {
            errorPayload = JSON.parse(err.message);
          }
        } catch {
          errorPayload = { error: err.message || "Failed to search stays on GDS" };
        }

        triggerApiLog('LodgingService', 'POST /stays/search (FAILED)', 
          { location, lat, lng }, 
          errorPayload
        );
        // Fall back to localized, dynamic high-fidelity mock stays
        setLiveStayItems(generateDynamicStays(location));
        setLiveTravelItems([]);
      }
    } else {
      setLiveTravelItems([]);
      setLiveStayItems([]);
    }
    
    // Jump straight to search results grid
    if (!skipScroll) {
      const targetElement = document.getElementById('recommendations-grid');
      if (targetElement) {
        setTimeout(() => {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  };

  const handleAddToItinerary = (item: LuxuryItem) => {
    // Check if already in itinerary
    const exists = itinerary.some(it => it.data.id === item.data.id);
    if (!exists) {
      setItinerary(prev => [...prev, item]);
      
      // Simulate API verification
      triggerApiLog(
        item.data.apiSource,
        item.type === 'travel' && item.data.category === 'flight' 
          ? 'POST /v1/offer_requests' 
          : item.type === 'stay' 
            ? 'GET /v3/shopping/hotel-offers' 
            : 'GET /v1/location/' + item.data.id + '/details',
        { validation_check: "pre-reserve", itemId: item.data.id },
        { status: "validated", price_locked: true, currency: "USD", amount: (item.data as any).price || "N/A" }
      );
    }

    // Auto navigate to itinerary and trigger checkout for flights
    if (item.type === 'travel' && item.data.category === 'flight') {
      setAutoCheckout(true);
      setActiveTab('itinerary');
    }
  };

  const handleRemoveFromItinerary = (id: string) => {
    setItinerary(prev => prev.filter(item => item.data.id !== id));
  };

  const clearItinerary = () => {
    setItinerary([]);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Sticky Header Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'explore') {
            setSelectedCuration(null);
          }
        }} 
        itineraryCount={itinerary.length}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        currentCurrency={currentCurrency}
        setCurrentCurrency={setCurrentCurrency}
      />

      {/* Main Page Area */}
      <main style={{ flex: 1, paddingBottom: '5rem' }}>
        {activeTab === 'explore' && (
          <div>
            {selectedCuration ? (
              <CurationDetail 
                item={selectedCuration}
                onBack={() => setSelectedCuration(null)}
                onAddToItinerary={handleAddToItinerary}
                triggerApiLog={triggerApiLog}
                formatPrice={formatPrice}
                allRecommendations={allLuxuryItems}
                onSelectRelated={setSelectedCuration}
              />
            ) : (
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
                          setSelectedCuration(null);
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
                    onSelectItem={setSelectedCuration}
                    triggerApiLog={triggerApiLog}
                    formatPrice={formatPrice}
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
                  <button 
                    onClick={() => {
                      setActiveTab('concierge');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="btn-primary"
                    style={{ fontSize: '0.85rem', padding: '0.8rem 2rem', gap: '0.5rem', marginTop: '2rem' }}
                  >
                    <span>Consult Luxury My Travel Concierge</span>
                    <ArrowRight size={14} />
                  </button>
                </section>
              </>
            )}
          </div>
        )}

        {activeTab === 'concierge' && (
          <div className="luxury-container" style={{ marginTop: '3rem' }}>
            <Concierge onAddToItinerary={handleAddToItinerary} triggerApiLog={triggerApiLog} />
          </div>
        )}

        {activeTab === 'blog' && (
          <BlogSystem triggerApiLog={triggerApiLog} />
        )}

        {activeTab === 'itinerary' && (
          <div className="luxury-container" style={{ marginTop: '3rem' }}>
            <Itinerary 
              itinerary={itinerary} 
              onRemoveFromItinerary={handleRemoveFromItinerary} 
              triggerApiLog={triggerApiLog}
              clearItinerary={clearItinerary}
              autoOpenCheckout={autoCheckout}
              onCloseCheckout={() => setAutoCheckout(false)}
              currentUser={currentUser}
              onOpenAuth={() => setIsAuthOpen(true)}
              onAddBooking={handleAddBooking}
              currentCurrency={currentCurrency}
              convertPrice={convertPrice}
              formatPrice={formatPrice}
            />
          </div>
        )}

        {activeTab === 'about' && (
          <div className="luxury-container" style={{ marginTop: '3rem' }}>
            <AboutUs onBackToCatalog={() => setActiveTab('explore')} />
          </div>
        )}
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
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--color-text-primary)', cursor: 'pointer' }} onClick={() => setActiveTab('explore')}>
            Luxury My Travel
          </span>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', maxWidth: '500px' }}>
            A premium curation of ultra luxury service providers meant for the elite. Works with realtime AI agents for luxury hospitality.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              &copy; 2026 Luxury My Travel. All privileges reserved.
            </span>
            <span style={{ color: 'rgba(255,255,255,0.1)' }}>|</span>
            <button 
              onClick={() => setActiveTab('about')}
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
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-gold-light)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-gold)'}
            >
              About Us & Legal Info
            </button>
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
    </div>
  );
}

export default App;
