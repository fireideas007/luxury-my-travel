'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserAccount, LuxuryItem, BookedCuration, PaymentTransaction } from '../data/mockData';
import { allLuxuryItems } from '../data/mockData';
import { TravelService } from '../services/travelService';

interface ToastState {
  message: string;
  show: boolean;
}

interface AppContextProps {
  // Navigation & Curation
  selectedCuration: LuxuryItem | null;
  setSelectedCuration: (item: LuxuryItem | null) => void;
  currentCategory: string;
  setCurrentCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchLocation: string;
  setSearchLocation: (location: string) => void;
  filteredItems: LuxuryItem[];
  setFilteredItems: (items: LuxuryItem[]) => void;
  liveTravelItems: LuxuryItem[];
  liveStayItems: LuxuryItem[];

  // Itinerary / Cart
  itinerary: LuxuryItem[];
  setItinerary: React.Dispatch<React.SetStateAction<LuxuryItem[]>>;
  autoCheckout: boolean;
  setAutoCheckout: (checkout: boolean) => void;
  handleAddToItinerary: (item: LuxuryItem) => void;
  handleRemoveFromItinerary: (id: string) => void;
  clearItinerary: () => void;

  // Authentication
  currentUser: UserAccount | null;
  setCurrentUser: (user: UserAccount | null) => void;
  isAuthOpen: boolean;
  setIsAuthOpen: (open: boolean) => void;
  handleLogin: (user: UserAccount) => void;
  handleLogout: () => void;
  handleAddBooking: (newBookings: BookedCuration[], newPayments: PaymentTransaction[]) => void;
  boardingPassToShow: BookedCuration | null;
  setBoardingPassToShow: (pass: BookedCuration | null) => void;

  // Currency
  currentCurrency: string;
  setCurrentCurrency: (currency: string) => void;
  exchangeRates: { [key: string]: number };
  convertPrice: (priceUSD: any) => number;
  getCurrencySymbol: (code: string) => string;
  formatPrice: (priceUSD: any) => string;

  // API logs & Toast alerts
  toast: ToastState;
  showToast: (message: string) => void;
  triggerApiLog: (api: 'AirService' | 'LodgingService' | 'ConciergeRegistry', endpoint: string, request: any, response: any) => void;

  // Core functions
  handleSearch: (
    category: string,
    query: string,
    location: string,
    origin?: string,
    departureDate?: string,
    lat?: number,
    lng?: number,
    skipScroll?: boolean
  ) => Promise<void>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCuration, setSelectedCuration] = useState<LuxuryItem | null>(null);
  const [itinerary, setItinerary] = useState<LuxuryItem[]>([]);
  const [autoCheckout, setAutoCheckout] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastState>({ message: '', show: false });
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [boardingPassToShow, setBoardingPassToShow] = useState<BookedCuration | null>(null);

  // Search states
  const [currentCategory, setCurrentCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchLocation, setSearchLocation] = useState<string>('');
  const [filteredItems, setFilteredItems] = useState<LuxuryItem[]>(allLuxuryItems);
  const [liveTravelItems, setLiveTravelItems] = useState<LuxuryItem[]>([]);
  const [liveStayItems, setLiveStayItems] = useState<LuxuryItem[]>([]);

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

  const showToast = (message: string) => {
    setToast({ message, show: true });
  };

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast(prev => ({ ...prev, show: false }));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  // Load session & itinerary from localStorage on client-side startup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUserStr = localStorage.getItem('luxetravel_current_user');
      if (savedUserStr) {
        try {
          setCurrentUser(JSON.parse(savedUserStr));
        } catch (e) {
          console.error('Failed to parse saved user credentials', e);
        }
      }

      const savedItineraryStr = localStorage.getItem('luxetravel_itinerary');
      if (savedItineraryStr) {
        try {
          setItinerary(JSON.parse(savedItineraryStr));
        } catch (e) {
          console.error('Failed to parse saved itinerary', e);
        }
      }
    }
  }, []);

  // Sync itinerary to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('luxetravel_itinerary', JSON.stringify(itinerary));
    }
  }, [itinerary]);

  useEffect(() => {
    // 1. Fetch Exchange Rates
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

    const savedAccountsStr = localStorage.getItem('luxetravel_accounts') || '[]';
    const savedAccounts: UserAccount[] = JSON.parse(savedAccountsStr);
    const updatedAccounts = savedAccounts.map(acc => 
      acc.email.toLowerCase() === currentUser.email.toLowerCase() ? updatedUser : acc
    );
    localStorage.setItem('luxetravel_accounts', JSON.stringify(updatedAccounts));

    setItinerary([]);
  };

  const triggerApiLog = (
    _api: 'AirService' | 'LodgingService' | 'ConciergeRegistry',
    _endpoint: string,
    _request: any,
    _response: any
  ) => {
    // Disabled sandbox logging
  };

  const handleAddToItinerary = (item: LuxuryItem) => {
    const exists = itinerary.some(it => it.data.id === item.data.id);
    if (!exists) {
      setItinerary(prev => [...prev, item]);
      showToast(`✨ ${item.data.name} has been added to your itinerary.`);
    } else {
      showToast(`ℹ️ ${item.data.name} is already in your itinerary.`);
    }

    if (item.type === 'travel' && item.data.category === 'flight') {
      setAutoCheckout(true);
    }
  };

  const handleRemoveFromItinerary = (id: string) => {
    setItinerary(prev => prev.filter(item => item.data.id !== id));
  };

  const clearItinerary = () => {
    setItinerary([]);
  };

  const generateDynamicStays = (locationName: string): LuxuryItem[] => {
    const cleanLoc = locationName.replace(/\s*\([A-Z]{3}\)\s*/g, '').trim();
    const lower = cleanLoc.toLowerCase();
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

  useEffect(() => {
    let result = allLuxuryItems;

    // Replace static flights and cars with live GDS offers
    if (liveTravelItems.length > 0) {
      const nonFlightOrTaxiItems = result.filter(item => !(item.type === 'travel' && (item.data.category === 'flight' || item.data.category === 'taxi')));
      result = [...liveTravelItems, ...nonFlightOrTaxiItems];
    }

    // Merge live stays
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

        const travelRes = await TravelService.searchFlights({
          origin: finalOrigin,
          destination: finalDestination,
          departureDate: departureDate || '2026-06-15'
        });

        const mappedLuxuryFlights: LuxuryItem[] = travelRes.offers.map(item => ({ type: 'travel', data: item }));
        
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
        } catch (carErr: any) {
          console.warn("Cars search failed, generating localized mock vehicles:", carErr);
          mappedLuxuryCars = generateDynamicCars(location);
        }

        setLiveTravelItems([...mappedLuxuryFlights, ...mappedLuxuryCars]);
        setLiveStayItems([]);

      } catch (err: any) {
        console.error("Flight search failed, falling back to mock travel curations:", err);
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
      } catch (err: any) {
        console.error("Stays search failed, falling back to mock stay curations:", err);
        setLiveStayItems(generateDynamicStays(location));
        setLiveTravelItems([]);
      }
    } else {
      setLiveTravelItems([]);
      setLiveStayItems([]);
    }
    
    if (!skipScroll) {
      const targetElement = document.getElementById('recommendations-grid');
      if (targetElement) {
        setTimeout(() => {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  };

  return (
    <AppContext.Provider value={{
      selectedCuration, setSelectedCuration,
      currentCategory, setCurrentCategory,
      searchQuery, setSearchQuery,
      searchLocation, setSearchLocation,
      filteredItems, setFilteredItems,
      liveTravelItems, liveStayItems,
      itinerary, setItinerary,
      autoCheckout, setAutoCheckout,
      handleAddToItinerary,
      handleRemoveFromItinerary,
      clearItinerary,
      currentUser, setCurrentUser,
      isAuthOpen, setIsAuthOpen,
      handleLogin, handleLogout,
      handleAddBooking,
      boardingPassToShow, setBoardingPassToShow,
      currentCurrency, setCurrentCurrency,
      exchangeRates,
      convertPrice,
      getCurrencySymbol,
      formatPrice,
      toast, showToast,
      triggerApiLog,
      handleSearch
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
