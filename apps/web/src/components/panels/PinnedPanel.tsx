'use client';

import { useMemo } from 'react';
import { useDemoStore } from '@/store/demo-store';
import { Avatar } from '../ui/Avatar';
import type { MessageDto } from '@/types';

const EMPTY_MESSAGES: MessageDto[] = [];

export function PinnedPanel({
  channelId,
  conversationId,
}: {
  channelId?: string;
  conversationId?: string;
}) {
  const pinnedIds = useDemoStore((s) =>
    channelId ? s.pinnedByChannel[channelId] ?? [] : [],
  );
  const channelMsgs = useDemoStore((s) =>
    channelId ? s.channelMessages[channelId] ?? EMPTY_MESSAGES : EMPTY_MESSAGES,
  );
  const unpinMessage = useDemoStore((s) => s.unpinMessage);

  const pinned = useMemo(() => {
    if (channelId) {
      return channelMsgs.filter((m) => pinnedIds.includes(m.id));
    }
    return [];
  }, [channelId, channelMsgs, pinnedIds]);

  if (conversationId && !channelId) {
    return (
      <p className="text-center text-[var(--text-muted)] text-sm py-16 px-4">
        DM에서는 고정 메시지를 지원하지 않습니다 (데모)
      </p>
    );
  }

  return (
    <ul>
      {pinned.map((m) => (
        <li key={m.id} className="px-4 py-3.5 border-b border-[var(--divider)]">
          <div className="flex gap-2 mb-2 items-start justify-between">
            <div className="flex gap-2 min-w-0">
              <Avatar name={m.author.name} presence={m.author.presence} size="sm" />
              <div className="min-w-0">
                <span className="font-medium text-sm">{m.author.name}</span>
                <span className="text-xs text-[var(--text-muted)] ml-2">
                  {new Date(m.createdAt).toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
            {channelId && (
              <button
                type="button"
                className="text-xs text-[var(--text-muted)] hover:text-red-600 shrink-0 px-2 py-1 rounded hover:bg-red-50"
                onClick={() => unpinMessage(channelId, m.id)}
              >
                고정 해제
              </button>
            )}
          </div>
          <p className="text-sm text-[var(--text-primary)] leading-relaxed pl-10">
            {m.content.replace(/\*\*/g, '')}
          </p>
        </li>
      ))}
      {pinned.length === 0 && (
        <p className="text-center text-[var(--text-muted)] text-sm py-12">고정된 메시지가 없습니다</p>
      )}
    </ul>
  );
}
