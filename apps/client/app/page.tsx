'use client';

import { useRouter } from 'next/navigation';
import { Paths } from '@/constants';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace(Paths.login);
  }, [router]);

  return null;
}
