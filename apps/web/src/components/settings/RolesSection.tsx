'use client';

import { useState } from 'react';
import { useDemoStore } from '@/store/demo-store';
import { WORKSPACE_PERMISSIONS } from '@/lib/role-permissions';
import { CreateRoleModal } from '@/components/modals/CreateRoleModal';

export function RolesSection() {
  const {
    workspaceRoles,
    toggleRolePermission,
    updateRoleName,
    deleteRole,
  } = useDemoStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [createOpen, setCreateOpen] = useState(false);

  const handleDeleteRole = (roleId: string, roleName: string) => {
    if (!confirm(`"${roleName}" 역할을 삭제할까요?\n이 역할을 가진 멤버는 멤버 역할로 변경됩니다.`))
      return;
    deleteRole(roleId);
    if (editingId === roleId) setEditingId(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-5 flex-wrap gap-2">
        <h2 className="text-lg font-bold">권한 관리</h2>
        <button
          type="button"
          className="bg-[var(--accent-blue)] text-white px-4 py-2 rounded-lg text-sm font-medium"
          onClick={() => setCreateOpen(true)}
        >
          + 새 역할 추가하기
        </button>
      </div>
      <div className="space-y-4">
        {workspaceRoles.map((r, i) => (
          <div
            key={r.id}
            className="border border-[var(--border)] rounded-xl p-5 relative hover:shadow-sm transition-shadow"
          >
            <div className="absolute top-4 right-4 flex items-center gap-1">
              {!r.isSystem && (
                <>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600 text-sm px-1"
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
                  <button
                    type="button"
                    className="text-red-400 hover:text-red-600 text-sm px-1"
                    onClick={() => handleDeleteRole(r.id, r.name)}
                    aria-label="역할 삭제"
                  >
                    🗑
                  </button>
                </>
              )}
              {r.isSystem && (
                <span className="text-xs text-[var(--text-muted)] bg-gray-100 px-2 py-0.5 rounded">
                  기본 역할
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mb-2 pr-24">
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
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      updateRoleName(r.id, editName);
                      setEditingId(null);
                    }
                  }}
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
              {WORKSPACE_PERMISSIONS.map((p) => {
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
      <CreateRoleModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}
