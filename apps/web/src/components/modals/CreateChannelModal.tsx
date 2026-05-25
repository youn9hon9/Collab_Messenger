'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useDemoStore } from '@/store/demo-store';
import { CURRENT_USER_ID } from '@/lib/mock-data';
import { Avatar } from '../ui/Avatar';

export function CreateChannelModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated?: (channelId: string, name: string) => void;
}) {
  const { addChannel, users } = useDemoStore();
  const [name, setName] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([CURRENT_USER_ID]);

  useEffect(() => {
    if (open) {
      setName('');
      setSelectedIds([CURRENT_USER_ID]);
    }
  }, [open]);

  if (!open) return null;

  const toggleMember = (userId: string) => {
    if (userId === CURRENT_USER_ID) return;
    setSelectedIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = addChannel(name, selectedIds);
    if (id) {
      onCreated?.(id, name.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <form
        onSubmit={handleSubmit}
        className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl border border-[var(--border)] max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center p-5 border-b border-[var(--divider)]">
          <h3 className="font-semibold">채널 만들기</h3>
          <button type="button" onClick={onClose} className="p-1.5 rounded-md hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <label className="block text-sm">
            <span className="font-medium mb-1 block">채널 이름</span>
            <input
              className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5"
              placeholder="예: 프로젝트-alpha"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              required
            />
          </label>
          <div>
            <span className="text-sm font-medium mb-2 block">멤버</span>
            <div className="border border-[var(--border)] rounded-lg p-2 max-h-48 overflow-y-auto space-y-1">
              {users.map((u) => (
                <label
                  key={u.id}
                  className="flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(u.id)}
                    disabled={u.id === CURRENT_USER_ID}
                    onChange={() => toggleMember(u.id)}
                  />
                  <Avatar name={u.name} presence={u.presence} size="sm" />
                  <span className="text-sm">
                    {u.name}
                    {u.id === CURRENT_USER_ID && (
                      <span className="text-[var(--text-muted)] text-xs ml-1">(나)</span>
                    )}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-2 p-5 border-t border-[var(--divider)]">
          <button
            type="button"
            className="flex-1 border border-[var(--border)] rounded-xl py-2.5 text-sm"
            onClick={onClose}
          >
            취소
          </button>
          <button
            type="submit"
            className="flex-1 bg-[var(--accent-blue)] text-white rounded-xl py-2.5 text-sm font-medium"
          >
            만들기
          </button>
        </div>
      </form>
    </div>
  );
}
