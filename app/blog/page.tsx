'use client';

import React from 'react';
import { BlogSystem } from '../../src/components/BlogSystem';
import { useAppContext } from '../../src/context/AppContext';

export default function BlogListPage() {
  const { triggerApiLog } = useAppContext();
  
  return (
    <BlogSystem triggerApiLog={triggerApiLog} />
  );
}
