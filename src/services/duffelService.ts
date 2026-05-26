import type { TravelItem, LuxuryItem } from '../data/mockData';

// Duffel Offer Request interface
export interface DuffelSearchRequest {
  origin: string;
  destination: string;
  departureDate: string;
  cabinClass?: 'first' | 'business' | 'economy';
  passengers?: Array<{ type: 'adult' | 'child' | 'infant_without_seat' }>;
}

export class DuffelService {
  private static PROXY_BASE = '/api/duffel';

  /**
   * Helper to format ISO 8601 Durations (like PT13H45M) to readable text
   */
  private static formatDuration(isoDuration: string): string {
    if (!isoDuration) return 'N/A';
    const matches = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (!matches) return isoDuration.replace('PT', '');
    const hours = matches[1] ? `${matches[1]}h` : '';
    const minutes = matches[2] ? `${matches[2]}m` : '';
    return `${hours} ${minutes}`.trim() || 'Direct';
  }

  /**
   * Creates a flight search offer request on Duffel and retrieves real offers
   */
  static async searchFlights(params: DuffelSearchRequest): Promise<{ 
    offers: TravelItem[];
    rawRequest: any;
    rawResponse: any;
  }> {
    const defaultDate = params.departureDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // Duffel standard request format
    const requestBody = {
      data: {
        slices: [
          {
            origin: params.origin.toUpperCase().trim(),
            destination: params.destination.toUpperCase().trim(),
            departure_date: defaultDate
          }
        ],
        passengers: params.passengers || [{ type: 'adult' }],
        cabin_class: params.cabinClass || 'first'
      }
    };

    const url = `${this.PROXY_BASE}/air/offer_requests`;

    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errText = await response.text();
      let errJson;
      try {
        errJson = JSON.parse(errText);
      } catch {
        errJson = { error: errText };
      }
      throw {
        status: response.status,
        statusText: response.statusText,
        errorPayload: errJson
      };
    }

    const resJson = await response.json();

    // Map Duffel offers to TravelItems
    const rawOffers = resJson.data?.offers || [];
    const mappedOffers: TravelItem[] = rawOffers.map((offer: any) => {
      const owner = offer.owner || { name: 'Exclusive Airline' };
      const slice = offer.slices?.[0] || {};
      const segment = slice.segments?.[0] || {};
      const carrier = segment.operating_carrier || owner;
      const aircraft = segment.aircraft?.name || 'Luxury Air Jet';
      const duration = slice.duration ? this.formatDuration(slice.duration) : 'N/A';
      
      const departTime = segment.departing_at 
        ? new Date(segment.departing_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        : 'N/A';
      const arriveTime = segment.arriving_at 
        ? new Date(segment.arriving_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        : 'N/A';

      // Nice default airline images
      let image = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800'; // Default flight
      if (owner.name.toLowerCase().includes('singapore')) {
        image = 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=800';
      } else if (owner.name.toLowerCase().includes('emirates')) {
        image = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800';
      }

      return {
        id: offer.id,
        category: 'flight',
        type: 'Commercial First Class',
        name: `${owner.name} Suites`,
        description: `Experience state-of-the-art luxury suites in the sky. Premium services and customized bedding accommodations provided by ${owner.name}.`,
        image,
        price: parseFloat(offer.total_amount) || 9800,
        priceUnit: 'one way',
        rating: 4.8,
        location: `${slice.origin?.name || slice.origin?.iata_code} to ${slice.destination?.name || slice.destination?.iata_code}`,
        highlights: [
          'Michelin-curated menu',
          'Private suite doors & partition',
          `Aircraft: ${aircraft}`,
          'Exclusive lounge priority checks'
        ],
        specs: {
          'Carrier': carrier.name || owner.name,
          'Duration': duration,
          'Depart Time': departTime,
          'Arrive Time': arriveTime
        },
        apiSource: 'AirService',
        apiEndpoints: ['POST /air/offer_requests', 'GET /air/offers']
      };
    });

    return {
      offers: mappedOffers,
      rawRequest: requestBody,
      rawResponse: resJson
    };
  }

  /**
   * Search stays on Duffel Stays API
   */
  static async searchStays(params: {
    lat: number;
    lng: number;
    checkInDate: string;
    checkOutDate: string;
    radius?: number;
  }): Promise<{
    stays: LuxuryItem[];
    rawRequest: any;
    rawResponse: any;
  }> {
    const radius = params.radius || 15;
    const requestBody = {
      lat: params.lat,
      lng: params.lng,
      radius,
      checkInDate: params.checkInDate,
      checkOutDate: params.checkOutDate
    };

    const response = await fetch(`${this.PROXY_BASE}/stays/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const resJson = await response.json();
    const results = resJson.data?.results || [];

    const mappedStays: LuxuryItem[] = results.map((result: any) => {
      const accommodation = result.accommodation || {};
      const rates = result.rates || [];
      const primaryRate = rates[0] || {};
      const address = accommodation.location?.address || {};

      return {
        id: accommodation.id || `stay-${Date.now()}-${Math.random()}`,
        type: 'stay',
        data: {
          id: accommodation.id || `stay-${Date.now()}-${Math.random()}`,
          category: accommodation.rating >= 4 ? 'resort' : 'villa',
          name: accommodation.name || 'Bespoke Sanctuary Lodge',
          description: accommodation.description || 'Experience state-of-the-art luxury accommodations and curated resort experiences.',
          image: accommodation.photos?.[0]?.url || 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=800',
          price: parseFloat(primaryRate.total_amount) || 2800,
          priceUnit: 'per night',
          rating: accommodation.rating || 4.9,
          location: `${address.city_name || 'Premium Location'}, ${address.country_code || 'GBL'}`,
          highlights: accommodation.amenities?.slice(0, 4).map((a: any) => a.description) || [
            'Private butler service',
            'Michelin fine dining',
            'Infinity pools',
            'Wellness spa & retreat'
          ],
          specs: {
            'Provider': accommodation.chain?.name || 'Luxe Lodges Consortium',
            'Check In After': accommodation.check_in_information?.check_in_after_time || '15:00',
            'Check Out Before': accommodation.check_in_information?.check_out_before_time || '12:00',
            'Payment Type': primaryRate.payment_type || 'pay_now'
          },
          apiSource: 'LodgingService',
          apiEndpoints: ['POST /stays/search', 'GET /stays/quotes']
        }
      };
    });

    return {
      stays: mappedStays,
      rawRequest: requestBody,
      rawResponse: resJson
    };
  }

  /**
   * Search cars on Duffel Cars API
   */
  static async searchCars(params: {
    lat: number;
    lng: number;
    pickupDate: string;
    dropoffDate: string;
  }): Promise<{
    cars: LuxuryItem[];
    rawRequest: any;
    rawResponse: any;
  }> {
    const requestBody = {
      lat: params.lat,
      lng: params.lng,
      pickupDate: params.pickupDate,
      dropoffDate: params.dropoffDate
    };

    const response = await fetch(`${this.PROXY_BASE}/cars/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const resJson = await response.json();
    const offers = resJson.data?.offers || [];

    const mappedCars: LuxuryItem[] = offers.map((offer: any) => {
      const car = offer.car || {};
      const supplier = offer.supplier || {};

      return {
        id: offer.id || `car-${Date.now()}-${Math.random()}`,
        type: 'travel',
        data: {
          id: offer.id || `car-${Date.now()}-${Math.random()}`,
          category: 'taxi',
          name: `${car.name || 'Luxury Cruiser'} (${supplier.name || 'Premium Cars'})`,
          description: `Enjoy elite high-performance driving. Premium specifications and chauffeur pickup details configured by ${supplier.name || 'Fleet Service'}.`,
          image: car.images?.[0]?.url || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800',
          price: parseFloat(offer.total_amount) || 680,
          priceUnit: 'one way',
          rating: 4.8,
          location: `Airport Terminal Pick-up`,
          highlights: [
            'Unlimited mileage',
            'Full executive coverage',
            `ACRISS Class: ${car.code || 'Luxury Sedan'}`,
            'Airport concierge greeting'
          ],
          specs: {
            'Supplier': supplier.name || 'Private Chauffeur',
            'Transmission': car.transmission || 'Automatic',
            'Fuel Type': car.fuel || 'Electric/Petrol',
            'Category': car.category || 'Luxury Elite'
          },
          apiSource: 'AirService',
          apiEndpoints: ['POST /cars/search']
        }
      };
    });

    return {
      cars: mappedCars,
      rawRequest: requestBody,
      rawResponse: resJson
    };
  }

  /**
   * Book a flight by creating an order on the Duffel GDS API
   */
  static async bookFlight(params: {
    offerId: string;
    passengers: Array<{
      given_name: string;
      family_name: string;
      born_on: string;
      email: string;
      phone_number: string;
      title: 'mr' | 'ms' | 'mrs' | 'miss';
      gender: 'm' | 'f';
    }>;
    totalAmount: number;
    currency: string;
  }): Promise<{
    order: any;
    rawRequest: any;
    rawResponse: any;
  }> {
    // Map passengers, adding standard passenger IDs if not provided
    // For live GDS offer passenger matches, standard passenger records are referenced
    const formattedPassengers = params.passengers.map((p, idx) => ({
      id: `pas_${idx}`,
      given_name: p.given_name,
      family_name: p.family_name,
      born_on: p.born_on,
      email: p.email,
      phone_number: p.phone_number,
      title: p.title,
      gender: p.gender
    }));

    const requestBody = {
      selected_offers: [params.offerId],
      passengers: formattedPassengers,
      payments: [
        {
          type: 'balance',
          currency: params.currency || 'USD',
          amount: params.totalAmount.toString()
        }
      ]
    };

    const response = await fetch(`${this.PROXY_BASE}/air/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errText = await response.text();
      let errJson;
      try {
        errJson = JSON.parse(errText);
      } catch {
        errJson = { error: errText };
      }
      throw {
        status: response.status,
        statusText: response.statusText,
        errorPayload: errJson
      };
    }

    const resJson = await response.json();
    return {
      order: resJson.data,
      rawRequest: requestBody,
      rawResponse: resJson
    };
  }
}

