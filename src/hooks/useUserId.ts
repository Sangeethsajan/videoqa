// hooks/useUserId.ts
import { useState, useEffect } from 'react';

export const useUserId = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Just get the ID, we know it exists because of the provider
    const existingUserId = localStorage.getItem('video_userId');
    setUserId(existingUserId);
  }, []);

  return userId;
};