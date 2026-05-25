'use client';

import { dangerZoneActions } from '@/lib/mock-data';
import { useDemoStore } from '@/store/demo-store';
import clsx from 'clsx';

export function DangerZoneSection() {
  const setToast = useDemoStore((s) => s.setToast);

  const handleAction = (label: string) => {
    setToast(`데모: "${label}"은(는) 실행되지 않습니다.`);
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-1 text-red-600">위험 구역</h2>
      <p className="text-sm text-[var(--text-muted)] mb-6">
        되돌릴 수 없는 작업입니다. 신중하게 진행하세요.
      </p>
      <div className="space-y-3 max-w-lg">
        {dangerZoneActions.map((action) => (
          <div
            key={action.id}
            className={clsx(
              'border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3',
              action.variant === 'danger'
                ? 'border-red-200 bg-red-50/50'
                : 'border-[var(--border)] bg-white',
            )}
          >
            <div>
              <div
                className={clsx(
                  'font-semibold text-sm',
                  action.variant === 'danger' ? 'text-red-700' : 'text-[var(--text-primary)]',
                )}
              >
                {action.label}
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-1">{action.description}</p>
            </div>
            <button
              type="button"
              className={clsx(
                'shrink-0 px-4 py-2 rounded-lg text-sm font-medium border',
                action.variant === 'danger'
                  ? 'border-red-300 text-red-700 hover:bg-red-100'
                  : 'border-[var(--border)] hover:bg-gray-50',
              )}
              onClick={() => handleAction(action.label)}
            >
              {action.variant === 'danger' ? '삭제' : '실행'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
