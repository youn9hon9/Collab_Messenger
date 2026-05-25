'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export function SettingsPageHeader() {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/w');
    }
  };

  return (
    <div className="shrink-0 flex items-center gap-3 px-4 py-3 border-b border-[var(--divider)] bg-white">
      <button
        type="button"
        onClick={handleBack}
        className="flex items-center gap-1.5 text-sm font-medium text-[var(--primary)] hover:opacity-80 min-h-[44px]"
      >
        <ArrowLeft size={18} />
        워크스페이스로 돌아가기
      </button>
    </div>
  );
}
