'use client';

import { useState } from 'react';
import { useDemoStore, EMPTY_POLLS } from '@/store/demo-store';
import clsx from 'clsx';

export function PollWidget({
  channelId,
  variant = 'inline',
}: {
  channelId: string;
  variant?: 'inline' | 'modal';
}) {
  const polls = useDemoStore((s) => s.polls[channelId] ?? EMPTY_POLLS);
  const votePoll = useDemoStore((s) => s.votePoll);
  const [showCreate, setShowCreate] = useState(false);
  const [question, setQuestion] = useState('');

  const isModal = variant === 'modal';

  if (!isModal && polls.length === 0 && !showCreate) return null;

  return (
    <div
      className={clsx(
        'px-4 py-3 shrink-0',
        isModal ? '' : 'border-t border-[var(--border)] bg-[var(--sidebar)]/50',
      )}
    >
      <div className="flex justify-between items-center mb-2">
        {!isModal && <span className="text-xs font-semibold text-[var(--text-muted)]">투표</span>}
        <button
          type="button"
          className="text-xs text-[var(--primary)] font-medium ml-auto"
          onClick={() => setShowCreate(!showCreate)}
        >
          + 새 투표
        </button>
      </div>
      {showCreate && (
        <div className="mb-3 p-3 bg-white rounded-lg border text-sm">
          <input
            className="w-full border rounded-lg px-2 py-1.5 mb-2"
            placeholder="질문 (데모)"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button
            type="button"
            className="text-xs bg-[var(--primary)] text-white px-3 py-1 rounded"
            onClick={() => setShowCreate(false)}
          >
            닫기
          </button>
        </div>
      )}
      {polls.length === 0 && !showCreate && isModal && (
        <p className="text-sm text-[var(--text-muted)] py-4 text-center">진행 중인 투표가 없습니다</p>
      )}
      {polls.map((poll) => (
        <div key={poll.id} className="mb-2 p-3 bg-white rounded-lg border border-[var(--border)]">
          <p className="text-sm font-medium mb-2">{poll.question}</p>
          {poll.options.map((opt) => {
            const total = poll.options.reduce((s, o) => s + o.voteCount, 0);
            const pct = total ? Math.round((opt.voteCount / total) * 100) : 0;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={poll.isClosed}
                className="block w-full text-left text-xs py-2 px-2 rounded-lg hover:bg-blue-50 mb-1 border border-transparent hover:border-blue-100"
                onClick={() => votePoll(channelId, opt.id)}
              >
                <div className="flex justify-between mb-1">
                  <span>{opt.text}</span>
                  <span className="text-[var(--text-muted)]">{opt.voteCount}표 ({pct}%)</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--accent-blue)] rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
