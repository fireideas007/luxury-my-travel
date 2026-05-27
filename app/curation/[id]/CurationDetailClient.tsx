'use client';

import React from 'react';
import { CurationDetail } from '../../../src/components/CurationDetail';
import { useAppContext } from '../../../src/context/AppContext';
import { allLuxuryItems } from '../../../src/data/mockData';
import { useRouter } from 'next/navigation';

export function CurationDetailClient({ item }: { item: any }) {
  const {
    handleAddToItinerary,
    triggerApiLog,
    formatPrice,
    itinerary
  } = useAppContext();

  const router = useRouter();

  return (
    <CurationDetail 
      item={item}
      onBack={() => router.push('/')}
      onAddToItinerary={handleAddToItinerary}
      triggerApiLog={triggerApiLog}
      formatPrice={formatPrice}
      allRecommendations={allLuxuryItems}
      onSelectRelated={(relatedItem) => router.push(`/curation/${relatedItem.data.id}`)}
      itinerary={itinerary}
    />
  );
}
