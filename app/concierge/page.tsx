'use client';

import React from 'react';
import { Concierge } from '../../src/components/Concierge';
import { useAppContext } from '../../src/context/AppContext';

export default function ConciergePage() {
  const { handleAddToItinerary, triggerApiLog, itinerary } = useAppContext();
  
  return (
    <div className="luxury-container" style={{ marginTop: '3rem' }}>
      <Concierge onAddToItinerary={handleAddToItinerary} triggerApiLog={triggerApiLog} itinerary={itinerary} />
    </div>
  );
}
