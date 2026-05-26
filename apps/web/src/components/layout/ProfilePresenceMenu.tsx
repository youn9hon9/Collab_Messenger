'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { useDemoStore } from '@/store/demo-store';
import { Avatar } from '../ui/Avatar';
import type { PresenceStatus } from '@/types';

const PRESENCE_OPTIONS: { value: PresenceStatus; label: string; dot: string }[] = [
  { value: 'ONLINE', label: '활동 중', dot: 'bg-green-500' },
  { value: 'IN_MEETING', label: '회의 중', dot: 'bg-amber-400' },
  { value: 'AWAY', label: '부재 중', dot: 'bg-red-500' },
];

function presenceLabel(presence: PresenceStatus) {
  return PRESENCE_OPTIONS.find((o) => o.value === presence)?.label ?? '오프라인';
}

export function ProfilePresenceMenu({ collapsed }: { collapsed: boolean }) {
  const { currentUser, setPresence } = useDemoStore();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  return (
    <div ref={rootRef} className="relative border-t border-[var(--divider)] mt-auto">
      <button
        type="button"
        className="w-full p-3 flex items-center gap-3 hover:bg-white/50 min-h-[56px] text-left"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <Avatar name={currentUser.name} presence={currentUser.presence} />
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold truncate">{currentUser.name}</div>
            <div className="text-xs text-[var(--text-muted)]">
              {presenceLabel(currentUser.presence)}
            </div>
          </div>
        )}
      </button>
      {open && (
        <div
          className={clsx(
            'absolute z-50 bg-white border border-[var(--border)] rounded-xl shadow-lg py-1 min-w-[160px]',
            collapsed ? 'left-full bottom-0 ml-2' : 'left-3 right-3 bottom-full mb-1',
          )}
          role="listbox"
        >
          {PRESENCE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              role="option"
              aria-selected={currentUser.presence === opt.value}
              className={clsx(
                'w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-gray-50',
                currentUser.presence === opt.value && 'bg-blue-50/60 font-medium',
              )}
              onClick={() => {
                setPresence(opt.value);
                setOpen(false);
              }}
            >
              <span className={clsx('w-2.5 h-2.5 rounded-full shrink-0', opt.dot)} />
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
