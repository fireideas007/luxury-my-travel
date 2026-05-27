'use client';

import React from 'react';
import { AboutUs } from '../../src/components/AboutUs';
import { useRouter } from 'next/navigation';

export default function AboutPage() {
  const router = useRouter();
  
  return (
    <div className="luxury-container" style={{ marginTop: '3rem' }}>
      <AboutUs onBackToCatalog={() => router.push('/')} />
    </div>
  );
}
