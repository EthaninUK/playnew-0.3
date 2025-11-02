'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to manage view counts with localStorage persistence
 * Initializes with random number (20-1500) for new items
 * Persists counts across sessions
 */
export function useViewCount(contentId: string, contentType: string) {
  const [viewCount, setViewCount] = useState(0);

  useEffect(() => {
    const storageKey = `${contentType}-view-${contentId}`;
    const stored = localStorage.getItem(storageKey);

    if (stored) {
      setViewCount(parseInt(stored, 10));
    } else {
      // Generate random number between 20-1500 for new items
      const randomViews = Math.floor(Math.random() * (1500 - 20 + 1)) + 20;
      setViewCount(randomViews);
      localStorage.setItem(storageKey, randomViews.toString());
    }
  }, [contentId, contentType]);

  const incrementViewCount = (amount: number = 2) => {
    const newCount = viewCount + amount;
    setViewCount(newCount);

    const storageKey = `${contentType}-view-${contentId}`;
    localStorage.setItem(storageKey, newCount.toString());
  };

  return { viewCount, incrementViewCount };
}
