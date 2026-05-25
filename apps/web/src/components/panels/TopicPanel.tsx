'use client';

import { useMemo, useState } from 'react';
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
  const [keyword, setKeyword] = useState('배포');
  const channelMsgs = useDemoStore((s) =>
    channelId ? s.channelMessages[channelId] ?? EMPTY_MESSAGES : EMPTY_MESSAGES,
  );
  const dmMsgs = useDemoStore((s) =>
    conversationId ? s.dmMessages[conversationId] ?? EMPTY_MESSAGES : EMPTY_MESSAGES,
  );
  const raw = channelId ? channelMsgs : dmMsgs;

  const messages = useMemo(
    () => (keyword.trim() ? raw.filter((m) => m.content.includes(keyword.trim())) : raw),
    [raw, keyword],
  );

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-[var(--divider)]">
        <input
          className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm"
          placeholder="검색어"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>
      <ul className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <li className="px-4 py-12 text-center text-sm text-[var(--text-muted)]">
            검색 결과가 없습니다
          </li>
        ) : (
          messages.map((m) => (
            <li key={m.id} className="px-4 py-3.5 border-b border-[var(--divider)]">
              <div className="text-sm font-medium mb-1">{m.author.name}</div>
              <p className="text-sm leading-relaxed">
                {keyword.trim()
                  ? m.content.split(keyword.trim()).map((part, i, arr) => (
                      <span key={i}>
                        {part.replace(/\*\*/g, '')}
                        {i < arr.length - 1 && (
                          <strong className="text-[var(--accent-blue)] font-semibold">
                            {keyword.trim()}
                          </strong>
                        )}
                      </span>
                    ))
                  : m.content.replace(/\*\*/g, '')}
              </p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
