'use client';

import { useEffect, useState } from 'react';
import { defaultScheduleDatetimeLocal } from '@/lib/schedule-time';

export function ScheduleTimeModal({
  open,
  initialContent,
  onClose,
  onConfirm,
}: {
  open: boolean;
  initialContent: string;
  onClose: () => void;
  onConfirm: (content: string, sendAtLocal: string) => void;
}) {
  const [content, setContent] = useState(initialContent);
  const [sendAtLocal, setSendAtLocal] = useState(defaultScheduleDatetimeLocal);

  useEffect(() => {
    if (open) {
      setContent(initialContent);
      setSendAtLocal(defaultScheduleDatetimeLocal());
    }
  }, [open, initialContent]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl border border-[var(--border)] shadow-xl">
        <div className="px-5 py-4 border-b border-[var(--border)]">
          <h3 className="font-semibold text-base">예약 메시지</h3>
          <p className="text-sm text-[var(--text-muted)] mt-1">전송할 날짜와 시간을 지정하세요.</p>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-[var(--text-muted)] block mb-1">메시지</label>
            <textarea
              className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm min-h-[80px] outline-none resize-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="예약할 메시지를 입력하세요"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-muted)] block mb-1">
              전송 시간
            </label>
            <input
              type="datetime-local"
              className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm"
              value={sendAtLocal}
              onChange={(e) => setSendAtLocal(e.target.value)}
            />
          </div>
        </div>
        <div className="px-5 py-3 border-t border-[var(--border)] flex justify-end gap-2">
          <button
            type="button"
            className="text-sm px-4 py-2 rounded-lg border border-[var(--border)] hover:bg-gray-50"
            onClick={onClose}
          >
            취소
          </button>
          <button
            type="button"
            className="text-sm px-4 py-2 rounded-lg bg-amber-500 text-white font-medium hover:opacity-95"
            onClick={() => onConfirm(content, sendAtLocal)}
          >
            예약하기
          </button>
        </div>
      </div>
    </div>
  );
}
