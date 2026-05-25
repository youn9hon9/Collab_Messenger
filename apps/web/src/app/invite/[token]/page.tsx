'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDemoStore } from '@/store/demo-store';

export default function InviteAcceptPage() {
  const router = useRouter();
  const login = useDemoStore((s) => s.login);

  useEffect(() => {
    if (typeof window !== 'undefined' && !sessionStorage.getItem('demoUser')) {
      login();
    }
    const t = setTimeout(() => router.replace('/w'), 1000);
    return () => clearTimeout(t);
  }, [router, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--sidebar)]">
      <p className="text-[var(--text-muted)]">초대를 수락하는 중…</p>
    </div>
  );
}
