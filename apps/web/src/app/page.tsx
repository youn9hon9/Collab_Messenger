'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useDemoStore } from '@/store/demo-store';

export default function LoginPage() {
  const router = useRouter();
  const login = useDemoStore((s) => s.login);

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('demoUser')) {
      login();
      router.replace('/w');
    }
  }, [login, router]);

  const startDemo = () => {
    login();
    router.push('/w');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--sidebar)] p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm space-y-5 border border-[var(--border)]">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl avatar-purple text-white flex items-center justify-center text-2xl font-bold mx-auto mb-3">
            C
          </div>
          <h1 className="text-2xl font-bold text-[var(--primary)]">Collab Messenger</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">협업 메신저 인터랙티브 데모</p>
        </div>
        <button
          type="button"
          onClick={startDemo}
          className="w-full bg-[var(--primary)] text-white py-3 rounded-xl font-semibold min-h-[48px] hover:opacity-95 transition-opacity shadow-md"
        >
          데모 시작하기
        </button>
        <p className="text-xs text-center text-[var(--text-muted)]">
          DB·서버 없이 브라우저에서 모든 기능을 체험할 수 있습니다
        </p>
      </div>
    </div>
  );
}
