export interface PaymentTransaction {
  id: string;
  amount: number;
  currency: string;
  date: string;
  method: string;
  status: string;
  reference: string;
}

export interface BookedCuration {
  id: string;
  name: string;
  type: 'travel' | 'stay' | 'food' | 'experience';
  location: string;
  image: string;
  dateBooked: string;
  price: number;
  priceUnit: string;
  details: {
    reference: string;
    seatNumber?: string;
    mealPref?: string;
    carrierName?: string;
    aircraftName?: string;
    stayProvider?: string;
    checkIn?: string;
    checkOut?: string;
    tableSize?: number;
    preferredTime?: string;
  };
}

export interface UserAccount {
  username: string;
  email: string;
  password?: string;
  avatarUrl?: string;
  authProvider?: 'local' | 'google';
  title: string;
  bornOn: string;
  phoneNumber: string;
  gender: string;
  membershipTier: 'Centurion Onyx' | 'Bespoke Elite' | 'Royal Concierge' | 'Standard Access';
  paymentCardType: 'Amex Centurion' | 'Visa Infinite' | 'Mastercard World Elite';
  bookings: BookedCuration[];
  payments: PaymentTransaction[];
}

export interface TravelItem {
  id: string;
  category: 'flight' | 'yacht' | 'train' | 'taxi';
  type: string; // e.g. "Private Jet Charter", "Superyacht", "Luxury Rail", "Chauffeur Service"
  name: string;
  description: string;
  image: string;
  price: number;
  priceUnit: string;
  rating: number;
  location: string;
  highlights: string[];
  specs: { [key: string]: string };
  apiSource: 'AirService' | 'LodgingService' | 'ConciergeRegistry';
  apiEndpoints: string[];
}

export interface StayItem {
  id: string;
  category: 'hotel' | 'villa' | 'resort';
  name: string;
  description: string;
  image: string;
  price: number;
  priceUnit: string;
  rating: number;
  reviewsCount: number;
  location: string;
  highlights: string[];
  features: string[];
  apiSource: 'LodgingService' | 'ConciergeRegistry';
  apiEndpoints: string[];
}

export interface FoodItem {
  id: string;
  category: 'restaurant' | 'bar';
  name: string;
  description: string;
  image: string;
  priceRange: string; // e.g. "$$$$"
  rating: number;
  reviewsCount: number;
  location: string;
  michelinStars?: number;
  highlights: string[];
  signatureDish: string;
  apiSource: 'ConciergeRegistry';
  apiEndpoints: string[];
}

export interface ExperienceItem {
  id: string;
  category: 'experience';
  name: string;
  description: string;
  image: string;
  price: number;
  priceUnit: string;
  rating: number;
  location: string;
  duration: string;
  highlights: string[];
  apiSource: 'ConciergeRegistry' | 'LodgingService';
  apiEndpoints: string[];
}

export type LuxuryItem = 
  | { type: 'travel'; data: TravelItem }
  | { type: 'stay'; data: StayItem }
  | { type: 'food'; data: FoodItem }
  | { type: 'experience'; data: ExperienceItem };

// Mock data items
export const travelList: TravelItem[] = [
  {
    id: "t-1",
    category: "flight",
    type: "Private Jet Charter",
    name: "Gulfstream G650ER",
    description: "The gold standard in private aviation. Exceptional range and class-leading cabin comfort, flying you non-stop from London to Singapore.",
    image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=800",
    price: 18500,
    priceUnit: "per hour",
    rating: 4.9,
    location: "Global coverage",
    highlights: ["16 passenger capacity", "Bespoke fine dining onboard", "State-of-the-art air purification", "Bed configurations for 6-8"],
    specs: {
      "Range": "7,500 nm (13,890 km)",
      "Max Speed": "Mach 0.925",
      "Cabin Height": "6 ft 3 in",
      "Luggage Volume": "195 cu ft"
    },
    apiSource: "AirService",
    apiEndpoints: ["GET /v1/offers", "POST /v1/offer_requests", "POST /v1/orders"]
  },
  {
    id: "t-2",
    category: "flight",
    type: "Ultra First Class",
    name: "Singapore Airlines A380 Suites",
    description: "Your own private cabin in the sky. Featuring a separate full-flat bed, leather armchair, sliding doors, and personal dining service.",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800",
    price: 12400,
    priceUnit: "round trip",
    rating: 4.8,
    location: "SIA Hub (SIN)",
    highlights: ["Poltrona Frau leather armchair", "Double bed conversion", "Lalique amenity kit", "Dom Pérignon champagne"],
    specs: {
      "Seat Pitch": "81 inches",
      "Bed Length": "76 inches",
      "Screen Size": "32-inch HD",
      "Privacy": "Full Sliding Doors"
    },
    apiSource: "AirService",
    apiEndpoints: ["GET /v1/offers", "GET /v1/seat_maps"]
  },
  {
    id: "t-3",
    category: "yacht",
    type: "Superyacht Charter",
    name: "Benetti Oasis 40M",
    description: "A glamorous floating estate designed for seamless indoor-outdoor living. Includes a wellness deck, infinity pool, and dedicated crew.",
    image: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=800",
    price: 32000,
    priceUnit: "per day",
    rating: 5.0,
    location: "Mediterranean / Caribbean",
    highlights: ["Glazed-backed dipping pool", "5 luxurious staterooms", "Water toys, jet skis, & subwing", "Michelin-trained private chef"],
    specs: {
      "Length": "133 feet (40.8 meters)",
      "Guests": "10 in 5 cabins",
      "Crew": "9 professional crew",
      "Cruising Speed": "11 knots"
    },
    apiSource: "LodgingService",
    apiEndpoints: ["GET /v2/shopping/charters/yachts", "POST /v2/booking/charters"]
  },
  {
    id: "t-4",
    category: "train",
    type: "Luxury Rail",
    name: "Venice Simplon-Orient-Express",
    description: "Travel back in time to the golden age of travel. Art Deco carriages, polished wood paneling, and gourmet dining across Europe.",
    image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&q=80&w=800",
    price: 6800,
    priceUnit: "per journey",
    rating: 4.9,
    location: "Venice to Paris / London",
    highlights: ["Authentic 1920s carriages", "Personal cabin steward", "Three exquisite restaurant cars", "Champagne bar lounge"],
    specs: {
      "Accommodation": "Grand Suite with Private Bath",
      "Service": "24-Hour Dedicated Butler",
      "Dress Code": "Black Tie / Formal",
      "Gastronomy": "Bespoke Seasonal Menu"
    },
    apiSource: "LodgingService",
    apiEndpoints: ["GET /v1/travel/rail/routes", "GET /v1/travel/rail/fares"]
  },
  {
    id: "t-5",
    category: "taxi",
    type: "Elite Chauffeur",
    name: "Rolls-Royce Phantom VIII Chauffeur",
    description: "The ultimate expression of bespoke luxury. Arrive in absolute silence, luxury, and style with a professional security-certified driver.",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800",
    price: 250,
    priceUnit: "per hour",
    rating: 4.9,
    location: "Major Capitals",
    highlights: ["Starlight Headliner", "Whisper-quiet double glazed windows", "Champagne chiller in console", "Privacy glass dividers"],
    specs: {
      "Engine": "6.75L Twin-Turbo V12",
      "Interior": "Bespoke Hand-stitched Leather",
      "Capacity": "3 Passengers",
      "Luggage": "4 Large Suitcases"
    },
    apiSource: "LodgingService",
    apiEndpoints: ["POST /v1/transport/transfers/booking", "GET /v1/transport/transfers/offers"]
  }
];

export const stayList: StayItem[] = [
  {
    id: "s-1",
    category: "resort",
    name: "Soneva Jani, Maldives",
    description: "Overwater sanctuary featuring massive double-story villas with retractable roofs to stargaze, private waterslides, and private lagoons.",
    image: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&q=80&w=800",
    price: 4500,
    priceUnit: "per night",
    rating: 4.95,
    reviewsCount: 1420,
    location: "Noonu Atoll, Maldives",
    highlights: ["Retractable master bedroom roof", "Private curved water slide", "Outdoor cinema over the sea", "Dedicated 'Barefoot Guardian' butler"],
    features: ["Private Pool", "Spa & Wellness", "Wine Cellar", "Overwater Observatory"],
    apiSource: "LodgingService",
    apiEndpoints: ["GET /v3/shopping/hotel-offers", "POST /v1/booking/hotel-orders"]
  },
  {
    id: "s-2",
    category: "hotel",
    name: "Aman Tokyo",
    description: "A sanctuary at the top of the Otemachi Tower. Combining traditional Japanese design with modern minimalism and unparalleled vistas.",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800",
    price: 2100,
    priceUnit: "per night",
    rating: 4.9,
    reviewsCount: 885,
    location: "Chiyoda-ku, Tokyo, Japan",
    highlights: ["Traditional Washi paper screens", "Giant basalt stone stone baths", "30-meter high-altitude indoor pool", "Aman Spa overlooking Fuji"],
    features: ["Fuji Views", "Michelin Dining Onsite", "Traditional Onsen", "Personal Concierge"],
    apiSource: "LodgingService",
    apiEndpoints: ["GET /v3/shopping/hotel-offers", "GET /v3/shopping/hotels/by-id"]
  },
  {
    id: "s-3",
    category: "villa",
    name: "Villa d'Este, Lake Como",
    description: "A legendary 16th-century royal palace converted into a luxury hotel. Surrounded by 25 acres of breathtaking Renaissance gardens.",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=800",
    price: 3600,
    priceUnit: "per night",
    rating: 4.88,
    reviewsCount: 912,
    location: "Cernobbio, Lake Como, Italy",
    highlights: ["Floating swimming pool on the lake", "Centuries-old private parkland", "Helipad & private boat marina", "Historic imperial furnishings"],
    features: ["Lakefront Terrace", "Floating Pool", "Renaissance Gardens", "Private Yacht Access"],
    apiSource: "ConciergeRegistry",
    apiEndpoints: ["GET /v1/location/{locationId}/details", "GET /v1/location/{locationId}/reviews"]
  }
];

export const foodList: FoodItem[] = [
  {
    id: "f-1",
    category: "restaurant",
    name: "Mirazur",
    description: "A three-Michelin-star restaurant bordering the Italian Riviera. Featuring a biodynamic menu inspired by the connection between Earth and cosmos.",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800",
    priceRange: "$$$$",
    rating: 4.95,
    reviewsCount: 1654,
    location: "Menton, France",
    michelinStars: 3,
    highlights: ["World's Best Restaurant winner", "9-course lunar-cycle tasting menu", "Cliffs overlooking the Mediterranean", "Private garden tour before dining"],
    signatureDish: "Gamberoni with local citrus and wild herbs",
    apiSource: "ConciergeRegistry",
    apiEndpoints: ["GET /v1/location/{locationId}/details", "GET /v1/location/{locationId}/photos"]
  },
  {
    id: "f-2",
    category: "bar",
    name: "Connaught Bar",
    description: "Regularly named the World's Best Bar. Where classic cocktail artistry meets ultra-premium service inside an Edwardian room.",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800",
    priceRange: "$$$$",
    rating: 4.85,
    reviewsCount: 2110,
    location: "Mayfair, London, UK",
    highlights: ["Signature Tableside Martini Trolley", "Handmade bespoke glassware", "Rare and vintage spirits collection", "Intimate silver-and-gold art deco room"],
    signatureDish: "Connaught Martini (with custom bitter drops)",
    apiSource: "ConciergeRegistry",
    apiEndpoints: ["GET /v1/location/{locationId}/details"]
  },
  {
    id: "f-3",
    category: "restaurant",
    name: "Osteria Francescana",
    description: "Massimo Bottura's legendary restaurant. An avant-garde culinary journey reimagining classic Italian dishes through contemporary art.",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800",
    priceRange: "$$$$",
    rating: 4.92,
    reviewsCount: 1845,
    location: "Modena, Italy",
    michelinStars: 3,
    highlights: ["Extremely exclusive (12 tables only)", "Curated modern art collection", "Iconic dish storytelling", "Exceptional parmigiano reggiano curation"],
    signatureDish: "Oops! I dropped the lemon tart",
    apiSource: "ConciergeRegistry",
    apiEndpoints: ["GET /v1/location/{locationId}/details", "GET /v1/location/{locationId}/reviews"]
  }
];

export const experienceList: ExperienceItem[] = [
  {
    id: "e-1",
    category: "experience",
    name: "Private Helicopter Volcanic Tour & Champagne Landing",
    description: "Soar above active volcanic craters, thermal lakes, and giant geysers, then land on a secluded volcanic peak for a premium champagne picnic.",
    image: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&q=80&w=800",
    price: 3400,
    priceUnit: "per charter",
    rating: 4.98,
    location: "Reykjavík, Iceland",
    duration: "4 hours",
    highlights: ["Private Airbus H130 helicopter", "Landing on a premium active volcanic peak", "Dom Pérignon & caviar degustation", "Professional geologist guide"],
    apiSource: "LodgingService",
    apiEndpoints: ["GET /v1/shopping/activities", "GET /v1/shopping/activities/{activityId}"]
  },
  {
    id: "e-2",
    category: "experience",
    name: "After-Hours Private Louvre Museum Tour",
    description: "Walk the silent halls of the world's most famous museum completely alone, guided by an art historian, and enjoy a private violin recital.",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800",
    price: 7500,
    priceUnit: "per group",
    rating: 5.0,
    location: "Paris, France",
    duration: "3 hours",
    highlights: ["Completely private, closed-doors access", "Stand inches from the Mona Lisa alone", "Exclusive champagne reception under the Glass Pyramid", "Violin solo recital in the Grande Galerie"],
    apiSource: "ConciergeRegistry",
    apiEndpoints: ["GET /v1/location/{locationId}/details"]
  },
  {
    id: "e-3",
    category: "experience",
    name: "Private Island Castaway & Marine Biologist Coral Reef Safari",
    description: "Depart via luxury catamaran to your own uninhabited sandbank in Fiji. Includes an executive gourmet lunch and private guided reef dive.",
    image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=800",
    price: 5200,
    priceUnit: "per day",
    rating: 4.96,
    location: "Denarau, Fiji",
    duration: "Full Day",
    highlights: ["Entire island sandbank reserved", "Five-course lobster and champagne beach lunch", "Personal PADI-certified marine biologist", "Custom underwater photography session"],
    apiSource: "ConciergeRegistry",
    apiEndpoints: ["GET /v1/location/{locationId}/details", "GET /v1/location/{locationId}/photos"]
  }
];

export const allLuxuryItems = [
  ...travelList.map(item => ({ type: 'travel' as const, data: item })),
  ...stayList.map(item => ({ type: 'stay' as const, data: item })),
  ...foodList.map(item => ({ type: 'food' as const, data: item })),
  ...experienceList.map(item => ({ type: 'experience' as const, data: item }))
];
