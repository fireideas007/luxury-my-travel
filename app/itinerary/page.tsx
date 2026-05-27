'use client';

import React from 'react';
import { Itinerary } from '../../src/components/Itinerary';
import { useAppContext } from '../../src/context/AppContext';

export default function ItineraryPage() {
  const {
    itinerary,
    handleRemoveFromItinerary,
    triggerApiLog,
    clearItinerary,
    autoCheckout,
    setAutoCheckout,
    currentUser,
    setIsAuthOpen,
    handleAddBooking,
    currentCurrency,
    convertPrice,
    formatPrice
  } = useAppContext();

  return (
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
  );
}
