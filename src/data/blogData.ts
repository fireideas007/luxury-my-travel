export interface BlogPost {
  id: string;
  title: string;
  description: string;
  content: string;
  image: string;
  category: 'aviation' | 'lodging' | 'gastronomy' | 'experience';
  author: string;
  publishedDate: string;
  readTime: string;
  tags: string[];
}

export const STAFF_CREDENTIALS = [
  {
    email: 'admin@luxurymytravel.com',
    password: 'admin2026',
    name: 'LuxeTravel Administrator',
    role: 'Administrator'
  },
  {
    email: 'editor@luxurymytravel.com',
    password: 'editorial2026',
    name: 'LuxeTravel Chief Editor',
    role: 'Chief Editor'
  },
  {
    email: 'concierge@luxurymytravel.com',
    password: 'concierge2026',
    name: 'LuxeTravel Concierge Manager',
    role: 'Concierge Manager'
  },
  {
    email: 'writer@luxurymytravel.com',
    password: 'writer2026',
    name: 'LuxeTravel Staff Writer',
    role: 'Staff Writer'
  }
];

export const AUTHOR_CREDENTIALS = STAFF_CREDENTIALS[1];

export const initialBlogPosts: BlogPost[] = [
  {
    id: "blog-1",
    title: "The Golden Sky: Inside the Gulfstream G650ER Private Charter Experience",
    description: "Discover the standard of ultra-luxury private aviation, from bespoke Michelin menus to custom cabin layouts.",
    content: `For the discerning globetrotter, private aviation represents the pinnacle of travel autonomy. The Gulfstream G650ER stands alone as the crown jewel of transcontinental flight, combining a class-leading range of 7,500 nautical miles with whisper-quiet cabin acoustics.\n\n### The Cabin Atmosphere\nStepping aboard the G650ER is akin to entering a custom-designed lounge in Mayfair. The cabin features sixteen panoramic oval windows that flood the space with natural light. A state-of-the-art air purification system replaces the cabin air every two minutes, reducing fatigue and ensuring travelers arrive refreshed.\n\n### Bespoke Dining at 51,000 Feet\nUnlike commercial first-class catering, luxury charters offer entirely personalized gastronomic curations. Prior to takeoff, travelers coordinate with culinary concierges to design custom menus. From fresh Beluga caviar paired with Dom Pérignon to bespoke organic vegetarian selections sourced from local estates, every meal is prepared by an onboard flight chef.\n\n### Seamless Connectivity & Sleep\nWith bed configurations for up to eight guests and a dedicated master suite, the aircraft offers sleeping quarters matching five-star resorts. The high-speed Ka-band satellite internet ensures uninterrupted streaming and communications across the Atlantic. For long-haul routes like London to Singapore, the Gulfstream G650ER remains the ultimate expression of flight utility.`,
    image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=800",
    category: "aviation",
    author: "Chief Editor",
    publishedDate: "2026-05-15",
    readTime: "4 min read",
    tags: ["Private Jet", "Gulfstream", "Aviation", "Luxury Travel"]
  },
  {
    id: "blog-2",
    title: "Maldives Sanctuary: Inside the Retractable Overwater Villas of Soneva Jani",
    description: "Explore Soneva Jani's double-story lagoon reserves, featuring curved private water slides and retractable roofs.",
    content: `Nestled in the pristine, turquoise waters of the Noonu Atoll, Soneva Jani represents the absolute peak of eco-luxury resort design. By combining high-end architecture with sustainable wood sourcing, the property has constructed overwater reserves that feel like private islands.\n\n### Architecture of Light and Sea\nEach villa features double-story ceilings with open-air lounge platforms. The master bedroom is equipped with a retractable roof that slides back at the touch of a button, letting guests stargaze directly from their bed. A curved private water slide drops directly from the top deck into the crystal-clear lagoon below, blending playful design with absolute luxury.\n\n### The Barefoot Guardian Experience\nUpon arrival, guests are welcomed by their dedicated 'Barefoot Guardian' (butler). Operating under Soneva's signature 'No News, No Shoes' philosophy, guests are encouraged to disconnect entirely. Your guardian handles reservations, coordinates private catamaran charters, arranges sandbank picnics, and curates organic spa wellness paths.\n\n### Sustainable Luxury\nSoneva Jani runs on advanced solar grids and offsets carbon footprints through waste-to-wealth centers. The on-site observatory, featuring a research-grade telescope, provides guests with guided celestial views, rounding out a resort experience that respects the ecology as much as it pampers the guest.`,
    image: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&q=80&w=800",
    category: "lodging",
    author: "Elena Rostova",
    publishedDate: "2026-05-20",
    readTime: "5 min read",
    tags: ["Maldives", "Overwater Villa", "Eco Luxury", "Resorts"]
  },
  {
    id: "blog-3",
    title: "Celestial Gastronomy: Lunar-Cycle Dining at Three-Star Mirazur",
    description: "Discover Mauro Colagreco's avant-garde garden-to-table menus on the cliffs of the French Riviera.",
    content: `Perched on the steep cliffs of Menton, France, overlooking the sparkling Mediterranean Sea, Mirazur is not simply a restaurant—it is a cosmic sensory journey. Chef Mauro Colagreco has reimagined fine dining by aligning his entire culinary calendar with the lunar cycle.\n\n### The Four Lunar Menus\nMirazur's culinary creations are split into four distinct menus: Root, Leaf, Flower, and Fruit. Depending on the moon's position and its influence on biodynamic crops in the restaurant's private gardens, the tasting journey changes. On a 'Flower Day,' the dishes are delicate, featuring local orange blossoms and edible micro-herbs. On a 'Fruit Day,' the kitchen focuses on robust, sun-drenched coastal tomatoes and citrus.\n\n### The French Riviera Setting\nThe dining room features floor-to-ceiling glass windows that frame the historic port of Menton. Before sitting down, guests are guided through the multi-tiered biodynamic gardens, tasting fresh herbs straight from the soil.\n\n### Signature Creation\nA standout dish is the local Riviera Gamberoni (scarlet prawns) served with a citrus reduction and wild sea herbs. Combined with an extensive selection of natural and biodynamic wines, Mirazur offers a dining experience that connects the soil, the sea, and the sky in perfect harmony.`,
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800",
    category: "gastronomy",
    author: "Jean-Pierre Blanc",
    publishedDate: "2026-05-24",
    readTime: "3 min read",
    tags: ["Michelin Star", "Mirazur", "Fine Dining", "French Riviera"]
  }
];
