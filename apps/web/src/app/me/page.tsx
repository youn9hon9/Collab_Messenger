'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDemoStore } from '@/store/demo-store';

export default function MePage() {
  const router = useRouter();
  const {
    currentUser,
    updateCurrentUser,
    setPresence,
    subscriptionStatus,
    activateSubscription,
    logout,
  } = useDemoStore();

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  return (
    <div className="min-h-screen bg-[var(--sidebar)] p-4 md:p-8">
      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg border border-[var(--border)] p-6 space-y-6">
        <Link href="/w" className="text-sm text-[var(--primary)] font-medium hover:underline">
          ← 워크스페이스
        </Link>
        <h1 className="text-xl font-bold">마이페이지</h1>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold">이름</label>
            <input
              className="w-full border border-[var(--border)] rounded-xl px-3 py-2.5 mt-1 text-sm"
              value={currentUser.name}
              onChange={(e) => updateCurrentUser({ name: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-semibold">팀</label>
            <input
              className="w-full border border-[var(--border)] rounded-xl px-3 py-2.5 mt-1 text-sm"
              value={currentUser.team ?? ''}
              onChange={(e) => updateCurrentUser({ team: e.target.value })}
            />
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold mb-2">프레즌스</p>
          <div className="flex flex-wrap gap-2">
            {(
              [
                ['ONLINE', '활동 중'],
                ['AWAY', '자리 비움'],
                ['IN_MEETING', '회의 중'],
              ] as const
            ).map(([p, label]) => (
              <button
                key={p}
                type="button"
                className={`px-4 py-2 rounded-xl text-sm border transition-colors ${
                  currentUser.presence === p
                    ? 'bg-blue-50 border-[var(--accent-blue)] text-[var(--accent-blue)] font-medium'
                    : 'border-[var(--border)] hover:bg-gray-50'
                }`}
                onClick={() => setPresence(p)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="border-t border-[var(--border)] pt-4">
          <p className="text-sm font-semibold mb-2">결제 / 구독</p>
          <p className="text-sm text-[var(--text-muted)] mb-3">
            상태: <span className="font-medium text-[var(--text-primary)]">{subscriptionStatus}</span>
          </p>
          <button
            type="button"
            className="w-full border-2 border-[var(--primary)] text-[var(--primary)] py-2.5 rounded-xl font-medium text-sm hover:bg-purple-50"
            onClick={activateSubscription}
          >
            구독 관리 (데모)
          </button>
        </div>
        <button
          type="button"
          className="w-full text-red-600 border border-red-200 py-2.5 rounded-xl font-medium text-sm hover:bg-red-50"
          onClick={handleLogout}
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}
