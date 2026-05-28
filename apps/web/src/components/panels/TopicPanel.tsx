'use client';

import { useMemo } from 'react';
import { useDemoStore } from '@/store/demo-store';
import type { MessageDto } from '@/types';

const EMPTY_MESSAGES: MessageDto[] = [];

export function TopicPanel({
  channelId,
  conversationId,
}: {
  channelId?: string;
  conversationId?: string;
}) {
  const keyword = useDemoStore((s) => s.topicSearchKeyword);
  const channelMsgs = useDemoStore((s) =>
    channelId ? s.channelMessages[channelId] ?? EMPTY_MESSAGES : EMPTY_MESSAGES,
  );
  const dmMsgs = useDemoStore((s) =>
    conversationId ? s.dmMessages[conversationId] ?? EMPTY_MESSAGES : EMPTY_MESSAGES,
  );
  const raw = channelId ? channelMsgs : dmMsgs;
  const trimmed = keyword.trim();

  const messages = useMemo(
    () => (trimmed ? raw.filter((m) => m.content.includes(trimmed)) : []),
    [raw, trimmed],
  );

  return (
    <ul className="flex-1 overflow-y-auto min-h-0">
      {!trimmed ? (
        <li className="px-4 py-12 text-center text-sm text-[var(--text-muted)]">
          검색어를 입력하면 메시지를 찾을 수 있습니다
        </li>
      ) : messages.length === 0 ? (
        <li className="px-4 py-12 text-center text-sm text-[var(--text-muted)]">
          검색 결과가 없습니다
        </li>
      ) : (
        messages.map((m) => (
          <li key={m.id} className="px-4 py-3.5 border-b border-[var(--divider)]">
            <div className="text-sm font-medium mb-1">{m.author.name}</div>
            <p className="text-sm leading-relaxed">{m.content.replace(/\*\*/g, '')}</p>
          </li>
        ))
      )}
    </ul>
  );
}
