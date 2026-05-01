'use client';

import { useClerk } from '@clerk/nextjs';
import { useEffect } from 'react';

export function AutoLogout() {
  const { signOut } = useClerk();

  useEffect(() => {
    // Only run this in development mode for testing
    if (process.env.NODE_ENV === 'development') {
      // Uncomment the line below to auto-logout on page load
      // signOut();
    }
  }, [signOut]);

  return null;
}
