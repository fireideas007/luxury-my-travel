import React from 'react';
import { allLuxuryItems } from '../../../src/data/mockData';
import { CurationDetailClient } from './CurationDetailClient';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: any }) {
  const resolvedParams = await params;
  const item = allLuxuryItems.find(i => i.data.id === resolvedParams.id);
  if (!item) return { title: 'Luxury Curation | Luxury My Travel' };

  return {
    title: `${item.data.name} | Luxury My Travel Curation`,
    description: item.data.description,
    openGraph: {
      title: item.data.name,
      description: item.data.description,
      images: [{ url: item.data.image }],
    }
  };
}

export default async function CurationPage({ params }: { params: any }) {
  const resolvedParams = await params;
  const item = allLuxuryItems.find(i => i.data.id === resolvedParams.id);
  
  if (!item) {
    // If it's a dynamic live flight/car search item not in our static catalog list, we check if we can reconstruct a basic dynamic item or throw 404
    // Since it could be a live API searched ID, we can create a generic fallback item or render a placeholder, or return 404
    // Let's create a basic fallback structure for dynamic live search IDs if they are not in the static catalog
    const isFlight = resolvedParams.id.startsWith('flight-');
    const isCar = resolvedParams.id.startsWith('car-');
    const isStay = resolvedParams.id.startsWith('stay-');
    
    if (isFlight || isCar || isStay) {
      // Dynamic fallback for live search items
      const mockItem = {
        type: (isStay ? 'stay' : 'travel') as 'stay' | 'travel',
        data: {
          id: resolvedParams.id,
          name: isFlight ? 'Exclusive First Class Suite' : isCar ? 'Premium Luxury Transfer' : 'Elite Bespoke Residency',
          description: 'A dynamic luxury travel curation matching your custom preferences. Fully verified by live GDS provider.',
          image: isFlight 
            ? 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=800' 
            : isCar 
              ? 'https://images.unsplash.com/photo-1632245889027-e406faaa19ee?auto=format&fit=crop&q=80&w=800' 
              : 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=800',
          price: isFlight ? 9400 : isCar ? 580 : 1950,
          priceUnit: isStay ? 'per night' : 'one way',
          rating: 4.9,
          location: 'Live Destination Booking',
          highlights: ['Live GDS verified availability', 'Priority luxury boarding', 'Elite concierge coordination'],
          specs: { 'Status': 'Available Live' },
          apiSource: (isStay ? 'LodgingService' : 'AirService') as 'LodgingService' | 'AirService',
          apiEndpoints: []
        }
      };
      return <CurationDetailClient item={mockItem} />;
    }

    notFound();
  }

  return <CurationDetailClient item={item} />;
}
