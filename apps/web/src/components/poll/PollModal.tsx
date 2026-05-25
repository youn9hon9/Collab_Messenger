'use client';

import { X } from 'lucide-react';
import { PollWidget } from './PollWidget';

export function PollModal({
  channelId,
  open,
  onClose,
}: {
  channelId: string;
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
          <h3 className="font-semibold text-sm">투표</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-gray-100"
            aria-label="닫기"
          >
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto">
          <PollWidget channelId={channelId} variant="modal" />
        </div>
      </div>
    </div>
  );
}
