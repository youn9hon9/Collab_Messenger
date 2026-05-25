'use client';

import { useEffect, useRef } from 'react';
import { BarChart3, Calendar } from 'lucide-react';

export function ComposeAttachMenu({
  open,
  onClose,
  onVote,
  onSchedule,
}: {
  open: boolean;
  onClose: () => void;
  onVote: () => void;
  onSchedule: () => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={menuRef}
      className="absolute bottom-full left-0 mb-1.5 min-w-[120px] py-1 bg-white border border-[var(--border)] rounded-lg shadow-lg z-20"
    >
      <button
        type="button"
        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-gray-50"
        onClick={() => {
          onVote();
          onClose();
        }}
      >
        <BarChart3 size={16} className="text-[var(--text-muted)]" />
        투표
      </button>
      <button
        type="button"
        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-gray-50"
        onClick={() => {
          onSchedule();
          onClose();
        }}
      >
        <Calendar size={16} className="text-[var(--text-muted)]" />
        스케줄 보내기
      </button>
    </div>
  );
}
