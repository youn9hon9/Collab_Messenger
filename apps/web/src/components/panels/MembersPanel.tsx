'use client';

import { useDemoStore } from '@/store/demo-store';
import { Avatar } from '../ui/Avatar';
import { DEFAULT_MEMBER_ROLE_ID } from '@/lib/mock-data';

export function MembersPanel() {
  const members = useDemoStore((s) => s.getMembers());
  const workspaceRoles = useDemoStore((s) => s.workspaceRoles);

  const roleName = (roleId?: string) => {
    const id = roleId && workspaceRoles.some((r) => r.id === roleId) ? roleId : DEFAULT_MEMBER_ROLE_ID;
    return workspaceRoles.find((r) => r.id === id)?.name ?? '멤버';
  };

  return (
    <ul>
      {members.map((m) => (
        <li
          key={m.id}
          className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--divider)] last:border-0 hover:bg-gray-50/80"
        >
          <Avatar name={m.name} presence={m.presence} />
          <div className="min-w-0 flex-1">
            <div className="font-medium text-sm">{m.name}</div>
            <div className="text-xs text-[var(--text-muted)] flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
              {m.team && <span>{m.team}</span>}
              <span className="text-[var(--accent-blue)] font-medium">{roleName(m.role)}</span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
