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
    name: 'Luxury My Travel Administrator',
    role: 'Administrator'
  },
  {
    email: 'editor@luxurymytravel.com',
    password: 'editorial2026',
    name: 'Luxury My Travel Chief Editor',
    role: 'Chief Editor'
  },
  {
    email: 'concierge@luxurymytravel.com',
    password: 'concierge2026',
    name: 'Luxury My Travel Concierge Manager',
    role: 'Concierge Manager'
  },
  {
    email: 'writer@luxurymytravel.com',
    password: 'writer2026',
    name: 'Luxury My Travel Staff Writer',
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
    author: "Luxury My Travel Chief Editor",
    publishedDate: "2026-05-20",
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
    publishedDate: "2026-05-21",
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
    publishedDate: "2026-05-22",
    readTime: "3 min read",
    tags: ["Michelin Star", "Mirazur", "Fine Dining", "French Riviera"]
  },
  {
    id: "blog-4",
    title: "Into the Wild: The Untamed Majesty of Singita Ebony Lodge",
    description: "A masterclass in luxury African safaris, blending five-star comforts with direct wilderness integration.",
    content: `In the heart of South Africa's Sabi Sand Game Reserve, Singita Ebony Lodge stands as a beacon of architectural brilliance and safari heritage. Ebony Lodge is designed as a contemporary interpretation of the classic safari tent, combining canvas and local stone with polished mahogany panels.\n\n### Luxury Framed by Wilderness\nEvery private suite features a heated plunge pool overlooking the Sand River, where herds of elephants and solitary leopards regularly wander. The suites are completely open to the sights and sounds of the bush, featuring outdoor showers, open fireplaces, and expansive cotton-draped beds.\n\n### Conservation & Community\nSingita operates with a core mission of preserving wilderness areas. Game drives are led by world-class trackers and conservationists, offering guests intimate access to Africa's Big Five. In the evenings, dinners are curated around local South African vintages from the lodge's private cellar, creating a culinary safari under the Southern Cross.`,
    image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=800",
    category: "lodging",
    author: "Naledi Dube",
    publishedDate: "2026-05-23",
    readTime: "5 min read",
    tags: ["Singita", "Safari", "Lodging", "South Africa"]
  },
  {
    id: "blog-5",
    title: "Romance on the Rails: The Belmond Venice Simplon-Orient-Express Journey",
    description: "Step into the golden age of train travel inside legendary 1920s Art Deco dining carriages.",
    content: `Few journeys evoke the sheer glamour of travel like the legendary Venice Simplon-Orient-Express. Moving across European borders from Venice to Paris, this historic train is a moving masterpiece of Art Deco design and culinary excellence.\n\n### Living History\nThe train's carriages are original 1920s vintage sleepers, meticulously restored to show their original marquetry, velvet upholstery, and brass fixtures. Grand Suites offer private marble bathrooms, 24-hour butler service, and complimentary champagne throughout the voyage.\n\n### Gastronomy on the Move\nChef Jean Imbert curates a gourmet menu prepared in exceptionally compact galley kitchens. Dishes feature fresh lobster, French cheeses, and seasonal truffles sourced at stops along the route. The Lounge Car features a resident pianist, drawing travelers together in black-tie attire for midnight cocktails, capturing the golden age of high society.`,
    image: "https://images.unsplash.com/photo-1532103054090-334e6e60ab29?auto=format&fit=crop&q=80&w=800",
    category: "experience",
    author: "Claude Monet",
    publishedDate: "2026-05-24",
    readTime: "4 min read",
    tags: ["Orient Express", "Luxury Train", "Belmond", "Europe"]
  },
  {
    id: "blog-6",
    title: "The Garden Sanctuary: Aman Kyoto's Minimalist Whispers",
    description: "Inside the hidden gardens of Kyoto's Oku-Hidari-Daimon district, where nature meets classic ryokan luxury.",
    content: `Tucked away at the foot of Kyoto's symbolic mountain, Aman Kyoto lies within a forgotten garden that was once home to a textile museum. The property is designed with minimalist pavilions that pay tribute to traditional Japanese ryokans.\n\n### The Sacred Moss Garden\nThe resort is defined by its stone pathways winding through massive granite boulders covered in vibrant green moss. Towering maples and cedar trees provide a dense canopy, creating an atmospheric quiet. Natural hot spring (onsen) baths are fed by local mineral waters, offering hot spring therapies surrounded by forest.\n\n### Kaiseki Craftsmanship\nAt the signature restaurant Taka-An, dining is an art form. The chef prepares multi-course Kaiseki menus using locally forged mushrooms, Kyotango beef, and pristine mountain water. Every dish is served on antique lacquerware, creating a deep connection between ancient culinary traditions and contemporary luxury.`,
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=800",
    category: "lodging",
    author: "Kenji Sato",
    publishedDate: "2026-05-25",
    readTime: "5 min read",
    tags: ["Aman", "Kyoto", "Japan", "Onsen"]
  },
  {
    id: "blog-7",
    title: "SubliMotion Ibiza: The World's Most Tech-Forward Culinary Theater",
    description: "Inside Chef Paco Roncero's high-tech chamber where gastronomy meets immersive virtual reality.",
    content: `SubliMotion in Ibiza is not just a dinner; it is a multisensory show that merges avant-garde culinary arts with theatrical staging. With a ticket price exceeding $2,000 per guest, only twelve seats are available each night inside a highly controlled, projector-mapped room.\n\n### Immersion of the Senses\nThe dining table and walls serve as massive high-resolution screens. As guests enjoy their courses, the environment changes from a lush orchard in spring to a deep-sea cavern, and eventually to a futuristic space station. Virtual reality headsets are used to blend digital worlds with Chef Paco Roncero's edible masterpieces.\n\n### The Menu Architecture\nCourses are designed to provoke emotional reactions, combining micro-gastronomy with temperature plays and dry-ice vapors. Cocktails mix themselves using magnetic stirrers, and desserts float above the table using ultrasonic levitation. It is a glimpse into the future of fine dining, where food, art, and technology coalesce.`,
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=800",
    category: "gastronomy",
    author: "Paco Roncero Staff",
    publishedDate: "2026-05-26",
    readTime: "4 min read",
    tags: ["SubliMotion", "Ibiza", "Tech Dining", "Fine Dining"]
  },
  {
    id: "blog-8",
    title: "Maldives Perfection: Cheval Blanc Randheli by LVMH",
    description: "An intimate look at LVMH's signature Maldives maison, featuring architectural villas and private seaplane transfers.",
    content: `Cheval Blanc Randheli, the second luxury resort in LVMH Hotel Management's portfolio, represents the absolute height of French art de vivre in the Indian Ocean. Designed by legendary architect Jean-Michel Gathy, the property combines Maldivian details with contemporary lines.\n\n### The Custom Seaplane Arrival\nGuests begin their journey at Male airport, boarding the Cheval Blanc custom private seaplane, complete with signature yellow livery and leather interiors. The villas feature massive 7-meter high doors that open to panoramic ocean views, private infinity pools, and direct lagoon access.\n\n### Haute Gastronomy\nThe resort's culinary focal point is Le 1947, a Michelin-caliber French restaurant named after Cheval Blanc's prestigious vintage. A 12-course tasting menu is served inside a striking white dining salon, accompanied by private sommeliers, proving that LVMH's hospitality is just as refined as its fashion houses.`,
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=800",
    category: "lodging",
    author: "Chantal Laurent",
    publishedDate: "2026-05-27",
    readTime: "4 min read",
    tags: ["Cheval Blanc", "LVMH", "Maldives", "Luxury Resorts"]
  },
  {
    id: "blog-9",
    title: "Royal Mansour: The Moroccan Royal Palace Experience",
    description: "Discover Marrakech's grandest hotel, commissioned by the King of Morocco to showcase imperial craftsmanship.",
    content: `Royal Mansour Marrakech is a hotel like no other. Commissioned by King Mohammed VI, the property was built without budget constraints to serve as a showcase of traditional Moroccan imperial design. Rather than hotel rooms, guests reside in private multi-story riads.\n\n### Imperial Riads & Secret Tunnels\nEvery riad is an architectural wonder, featuring hand-carved cedar wood, plaster lace, and zellige tilework. Riads are equipped with private plunge pools, sun decks, and fireplaces. Staff navigate the property through a series of underground tunnels, ensuring absolute privacy for high-profile guests.\n\n### The Oasis Spa\nThe resort's spa features a breathtaking white iron atrium resembling a birdcage, where guests undergo traditional hammam rituals. Michelin-starred dining is curated by Chef Yannick Alléno, offering guests an authentic taste of royal Moroccan hospitality within a secure estate.`,
    image: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&q=80&w=800",
    category: "lodging",
    author: "Karim Al-Alawi",
    publishedDate: "2026-05-28",
    readTime: "5 min read",
    tags: ["Royal Mansour", "Marrakech", "Morocco", "Palace Hotel"]
  },
  {
    id: "blog-10",
    title: "Tuscan Estates: Inside Rosewood Castiglion del Bosco",
    description: "An authentic retreat inside a 800-year-old estate, celebrating Brunello di Montalcino wines and rustic Italian beauty.",
    content: `Located in the UNESCO-listed Val d'Orcia, Rosewood Castiglion del Bosco is a meticulously restored 800-year-old Tuscan village. Surrounded by vineyards and cypress trees, the estate offers an authentic taste of rural Italian noble life.\n\n### Historic Villas & Vineyards\nThe accommodations are split between suites in the central village and private villas converted from historic 17th-century farmhouses. Villas feature private infinity pools overlooking rolling hills, antique stone bread ovens, and custom kitchens.\n\n### The Brunello Winery\nThe estate is home to its own private winery, producing award-winning Brunello di Montalcino. Guests can participate in private harvest experiences, barrel tastings, and cooking classes utilizing ingredients grown in the villa's organic garden. Dining at the Michelin-starred Campo del Drago showcases contemporary Tuscan gastronomy, making this the perfect epicurean sanctuary.`,
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=800",
    category: "gastronomy",
    author: "Giovanni Rossi",
    publishedDate: "2026-05-29",
    readTime: "5 min read",
    tags: ["Rosewood", "Tuscany", "Italy", "Vineyard"]
  }
];
