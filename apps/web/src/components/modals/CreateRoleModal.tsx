'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useDemoStore } from '@/store/demo-store';
import { WORKSPACE_PERMISSIONS } from '@/lib/role-permissions';

export function CreateRoleModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { addCustomRole } = useDemoStore();
  const [name, setName] = useState('');
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(['message:send']),
  );

  useEffect(() => {
    if (!open) return;
    setName('');
    setSelected(new Set(['message:send']));
  }, [open]);

  if (!open) return null;

  const togglePerm = (key: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    addCustomRole(trimmed, [...selected]);
    onClose();
  };

  const canSave = name.trim().length > 0 && selected.size > 0;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-[var(--border)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start p-5 border-b border-[var(--border)]">
          <div>
            <h2 className="font-bold text-lg">새 역할 추가</h2>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              역할 이름과 권한을 설정하세요
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
            aria-label="닫기"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-sm font-semibold" htmlFor="role-name">
              역할 이름
            </label>
            <input
              id="role-name"
              className="mt-2 w-full border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)]/30"
              placeholder="예: 프로젝트 리드"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <div>
            <label className="text-sm font-semibold">권한</label>
            <div className="mt-2 space-y-2 border border-[var(--border)] rounded-xl p-3">
              {WORKSPACE_PERMISSIONS.map((p) => (
                <label
                  key={p.key}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selected.has(p.key)}
                    onChange={() => togglePerm(p.key)}
                    className="rounded border-[var(--border)]"
                  />
                  {p.label}
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-2 p-5 border-t border-[var(--border)]">
          <button
            type="button"
            className="flex-1 border border-[var(--border)] rounded-xl py-2.5 text-sm font-medium"
            onClick={onClose}
          >
            취소
          </button>
          <button
            type="button"
            className="flex-1 bg-[var(--accent-blue)] text-white rounded-xl py-2.5 text-sm font-semibold disabled:opacity-50"
            onClick={handleSave}
            disabled={!canSave}
          >
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
}
