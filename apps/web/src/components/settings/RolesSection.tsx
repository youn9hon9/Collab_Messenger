'use client';

import { useState } from 'react';
import { useDemoStore } from '@/store/demo-store';

export function RolesSection() {
  const {
    workspaceRoles,
    toggleRolePermission,
    updateRoleName,
    addCustomRole,
  } = useDemoStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [newRoleName, setNewRoleName] = useState('');

  const allPermKeys = [
    { key: 'message:send', label: '메시지 전송' },
    { key: 'message:delete', label: '메시지 삭제' },
    { key: 'member:invite', label: '멤버 초대' },
    { key: 'analytics:view', label: '분석 보기' },
    { key: 'settings:manage', label: '설정 관리' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-5 flex-wrap gap-2">
        <h2 className="text-lg font-bold">권한 관리</h2>
        <div className="flex gap-2">
          <input
            className="border border-[var(--border)] rounded-lg px-3 py-1.5 text-sm w-36"
            placeholder="역할 이름"
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
          />
          <button
            type="button"
            className="bg-[var(--accent-blue)] text-white px-4 py-2 rounded-lg text-sm font-medium"
            onClick={() => {
              addCustomRole(newRoleName);
              setNewRoleName('');
            }}
          >
            + 맞춤 역할
          </button>
        </div>
      </div>
      <div className="space-y-4">
        {workspaceRoles.map((r, i) => (
          <div
            key={r.id}
            className="border border-[var(--border)] rounded-xl p-5 relative hover:shadow-sm transition-shadow"
          >
            <button
              type="button"
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-sm"
              onClick={() => {
                if (editingId === r.id) {
                  updateRoleName(r.id, editName);
                  setEditingId(null);
                } else {
                  setEditingId(r.id);
                  setEditName(r.name);
                }
              }}
            >
              {editingId === r.id ? '저장' : '✎'}
            </button>
            <div className="flex items-center gap-2 mb-2 pr-10">
              <span
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold ${
                  i === 0 ? 'bg-purple-500' : i === 1 ? 'bg-blue-500' : 'bg-gray-400'
                }`}
              >
                ⬡
              </span>
              {editingId === r.id ? (
                <input
                  className="font-bold border border-[var(--border)] rounded px-2 py-0.5 text-sm"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              ) : (
                <span className="font-bold">{r.name}</span>
              )}
              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                {r.permissions.length}개 권한
              </span>
            </div>
            <p className="text-sm text-[var(--text-muted)] mb-3">{r.description}</p>
            <div className="space-y-2">
              {allPermKeys.map((p) => {
                const checked = r.permissions.some((x) => x.key === p.key);
                return (
                  <label
                    key={p.key}
                    className="flex items-center gap-2 text-sm cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleRolePermission(r.id, p.key)}
                      className="rounded border-[var(--border)]"
                    />
                    {p.label}
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
