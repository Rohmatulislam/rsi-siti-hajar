'use client';

import { UserButton, useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

export default function SafeUserButton() {
  const { isSignedIn, isLoaded } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !isLoaded || !isSignedIn) {
    return null;
  }

  return <UserButton afterSignOutUrl="/" />;
}