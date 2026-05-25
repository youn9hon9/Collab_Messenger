'use client';

import { useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';

export function SendOptionsMenu({
  open,
  onClose,
  onQuietSend,
  onSchedulePreset,
  onCustomSchedule,
  showMeetingHint,
  meetingName,
  onDismissMeetingHint,
  dontShowAgain,
  onDontShowAgainChange,
}: {
  open: boolean;
  onClose: () => void;
  onQuietSend: () => void;
  onSchedulePreset: (label: string) => void;
  onCustomSchedule: () => void;
  showMeetingHint?: boolean;
  meetingName?: string;
  onDismissMeetingHint?: () => void;
  dontShowAgain?: boolean;
  onDontShowAgainChange?: (v: boolean) => void;
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

  return (
    <div className="absolute bottom-full right-0 mb-2 flex flex-col items-end gap-2 z-20" ref={menuRef}>
      {showMeetingHint && meetingName && (
        <div className="relative w-[min(380px,calc(100vw-2rem))] min-w-[320px] bg-white border border-[var(--border)] rounded-xl shadow-lg px-4 py-3 text-sm leading-relaxed">
          <button
            type="button"
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-sm leading-none"
            onClick={onDismissMeetingHint}
            aria-label="닫기"
          >
            ×
          </button>
          <div className="flex gap-2 pr-4">
            <Bell size={18} className="text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-[var(--text-primary)]">
                현재 <span className="font-semibold">{meetingName}</span>님이 회의중입니다.
              </p>
              <p className="text-[var(--text-primary)] mt-0.5">
                예약/조용히 보내기를 사용해보세요
              </p>
              <label className="flex items-center gap-1.5 mt-2 text-[var(--text-muted)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={(e) => onDontShowAgainChange?.(e.target.checked)}
                  className="rounded border-[var(--border)]"
                />
                이 채널에서 다시 보지 않기
              </label>
            </div>
          </div>
          <div
            className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white border-r border-b border-[var(--border)] rotate-45"
            aria-hidden
          />
        </div>
      )}

      {open && (
        <div className="min-w-[200px] bg-white border border-[var(--border)] rounded-xl shadow-lg py-1 overflow-hidden">
          <p className="px-3.5 pt-2 pb-1 text-[11px] font-semibold text-[var(--text-muted)]">
            메시지 예약
          </p>
          <button
            type="button"
            className="block w-full text-left px-3.5 py-2 text-sm hover:bg-gray-50"
            onClick={() => {
              onSchedulePreset('내일 오전 9:00');
              onClose();
            }}
          >
            내일 오전 9:00
          </button>
          <button
            type="button"
            className="block w-full text-left px-3.5 py-2 text-sm hover:bg-gray-50"
            onClick={() => {
              onSchedulePreset('다음 월요일 오전 9시');
              onClose();
            }}
          >
            다음 월요일 오전 9시
          </button>
          <div className="border-t border-[var(--divider)] my-1" />
          <button
            type="button"
            className="block w-full text-left px-3.5 py-2 text-sm hover:bg-gray-50"
            onClick={() => {
              onCustomSchedule();
              onClose();
            }}
          >
            사용자 지정 시간
          </button>
          <div className="border-t border-[var(--divider)] my-1" />
          <button
            type="button"
            className="block w-full text-left px-3.5 py-2 text-sm hover:bg-gray-50 text-[var(--text-primary)]"
            onClick={() => {
              onQuietSend();
              onClose();
            }}
          >
            조용히 보내기
          </button>
        </div>
      )}
    </div>
  );
}
