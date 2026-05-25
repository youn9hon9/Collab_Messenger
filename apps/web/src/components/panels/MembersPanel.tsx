'use client';

import { useDemoStore } from '@/store/demo-store';
import { Avatar } from '../ui/Avatar';

export function MembersPanel() {
  const members = useDemoStore((s) => s.getMembers());

  return (
    <ul>
      {members.map((m) => (
        <li
          key={m.id}
          className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--divider)] last:border-0 hover:bg-gray-50/80"
        >
          <Avatar name={m.name} presence={m.presence} />
          <div className="min-w-0">
            <div className="font-medium text-sm">{m.name}</div>
            <div className="text-xs text-[var(--text-muted)]">{m.team}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}
