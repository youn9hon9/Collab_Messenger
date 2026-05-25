'use client';

import { useMemo, useState } from 'react';
import { useDemoStore } from '@/store/demo-store';
import { CURRENT_USER_ID } from '@/lib/mock-data';
import { Avatar } from '../ui/Avatar';

export function ChannelMembersSection({ channelId }: { channelId: string }) {
  const {
    users,
    channelMembers,
    addChannelMember,
    removeChannelMember,
    updateMemberRole,
  } = useDemoStore();
  const [addUserId, setAddUserId] = useState('');

  const memberIds = channelMembers[channelId] ?? [];
  const members = useMemo(
    () => memberIds.map((id) => users.find((u) => u.id === id)).filter(Boolean),
    [memberIds, users],
  );
  const notInChannel = users.filter((u) => !memberIds.includes(u.id));

  const roleLabels: Record<string, string> = {
    OWNER: '소유주',
    ADMIN: '관리자',
    MEMBER: '멤버',
    GUEST: '게스트',
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">채널 멤버</h2>
      <ul className="space-y-0 divide-y divide-[var(--divider)]">
        {members.map((m) =>
          m ? (
            <li key={m.id} className="flex items-center gap-3 py-4 first:pt-0">
              <Avatar name={m.name} presence={m.presence} />
              <div className="flex-1 min-w-0">
                <div className="font-semibold">{m.name}</div>
                <div className="text-xs text-[var(--text-muted)]">{m.team}</div>
              </div>
              <select
                className="border border-[var(--border)] rounded-lg px-2 py-1.5 text-sm"
                value={m.role ?? 'MEMBER'}
                onChange={(e) => updateMemberRole(m.id, e.target.value)}
              >
                {Object.entries(roleLabels).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
              {m.id !== CURRENT_USER_ID ? (
                <button
                  type="button"
                  className="text-red-400 p-2 hover:bg-red-50 rounded"
                  title="채널에서 제거"
                  onClick={() => {
                    if (confirm(`${m.name}님을 이 채널에서 제거할까요?`))
                      removeChannelMember(channelId, m.id);
                  }}
                >
                  🗑
                </button>
              ) : (
                <span className="text-xs text-[var(--text-muted)] px-2">(나)</span>
              )}
            </li>
          ) : null,
        )}
      </ul>
      {notInChannel.length > 0 && (
        <div className="mt-6 flex gap-2">
          <select
            className="flex-1 border border-[var(--border)] rounded-lg px-3 py-2 text-sm"
            value={addUserId}
            onChange={(e) => setAddUserId(e.target.value)}
          >
            <option value="">멤버 추가...</option>
            {notInChannel.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="bg-[var(--accent-blue)] text-white px-4 py-2 rounded-lg text-sm font-medium shrink-0"
            disabled={!addUserId}
            onClick={() => {
              addChannelMember(channelId, addUserId);
              setAddUserId('');
            }}
          >
            추가
          </button>
        </div>
      )}
    </div>
  );
}
