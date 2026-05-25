'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { Paperclip, Smile, Plus, Send } from 'lucide-react';
import { useDemoStore } from '@/store/demo-store';
import { Avatar } from '../ui/Avatar';
import { CURRENT_USER_ID, dms } from '@/lib/mock-data';
import { ComposeAttachMenu } from './ComposeAttachMenu';
import { SendOptionsMenu } from './SendOptionsMenu';
import { PollModal } from '../poll/PollModal';
import clsx from 'clsx';

function renderContent(content: string) {
  const parts = content.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="text-[var(--accent-blue)] font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

function contextKey(channelId?: string, conversationId?: string) {
  return channelId ? `ch:${channelId}` : conversationId ? `dm:${conversationId}` : '';
}

export function ChatView({
  channelId,
  conversationId,
  title,
  placeholder,
}: {
  channelId?: string;
  conversationId?: string;
  title: string;
  placeholder: string;
}) {
  const {
    getMessages,
    sendMessage,
    scheduleMessage,
    sendQuietMessage,
    users,
    channelMembers,
  } = useDemoStore();
  const messages = getMessages(channelId, conversationId);
  const [input, setInput] = useState('');
  const [scheduleMode, setScheduleMode] = useState(false);
  const [attachMenuOpen, setAttachMenuOpen] = useState(false);
  const [sendMenuOpen, setSendMenuOpen] = useState(false);
  const [pollModalOpen, setPollModalOpen] = useState(false);
  const [meetingHintDismissed, setMeetingHintDismissed] = useState<Record<string, boolean>>({});
  const [dontShowMeetingHint, setDontShowMeetingHint] = useState<Record<string, boolean>>({});
  const bottomRef = useRef<HTMLDivElement>(null);
  const ctxKey = contextKey(channelId, conversationId);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  useEffect(() => {
    setSendMenuOpen(false);
    setScheduleMode(false);
  }, [channelId, conversationId]);

  const contextParticipantIds = useMemo(() => {
    const ids = new Set<string>();
    if (channelId) {
      for (const uid of channelMembers[channelId] ?? []) {
        ids.add(uid);
      }
    } else if (conversationId) {
      const dm = dms.find((d) => d.id === conversationId);
      if (dm) ids.add(dm.otherUser.id);
    }
    for (const msg of messages) {
      if (msg.authorId !== CURRENT_USER_ID) ids.add(msg.authorId);
    }
    return ids;
  }, [channelId, conversationId, channelMembers, messages]);

  const meetingInContext = useMemo(() => {
    return users.filter(
      (u) =>
        u.id !== CURRENT_USER_ID &&
        u.presence === 'IN_MEETING' &&
        contextParticipantIds.has(u.id),
    );
  }, [users, contextParticipantIds]);

  const showMeetingBubble =
    meetingInContext.length > 0 &&
    !dontShowMeetingHint[ctxKey] &&
    !meetingHintDismissed[ctxKey];

  const primaryMeetingName = meetingInContext[0]?.name;

  const handleSend = () => {
    if (!input.trim()) return;
    if (scheduleMode) {
      scheduleMessage(input, channelId, conversationId, '사용자 지정');
      setInput('');
      setScheduleMode(false);
      return;
    }
    sendMessage(input, channelId, conversationId);
    setInput('');
  };

  const handleQuietSend = () => {
    if (!input.trim()) return;
    sendQuietMessage(input, channelId, conversationId);
    setInput('');
  };

  const handleSchedulePreset = (label: string) => {
    if (!input.trim()) {
      scheduleMessage('(예약 메시지)', channelId, conversationId, label);
      return;
    }
    scheduleMessage(input, channelId, conversationId, label);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-white">
      <header className="px-5 py-3.5 border-b border-[var(--border)] font-semibold text-[15px] shrink-0">
        {channelId ? `# ${title}` : title}
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
        {messages.map((msg) => {
          const isMe = msg.authorId === CURRENT_USER_ID;
          return (
            <div
              key={msg.id}
              className={clsx(
                'flex gap-3 items-start w-full',
                isMe ? 'flex-row justify-end' : 'flex-row',
              )}
            >
              {!isMe && <Avatar name={msg.author.name} presence={msg.author.presence} />}
              <div className={clsx('max-w-[72%]', isMe && 'items-end flex flex-col')}>
                <div
                  className={clsx(
                    'text-xs text-[var(--text-muted)] mb-1 flex gap-2',
                    isMe && 'flex-row-reverse justify-end',
                  )}
                >
                  <span className="font-medium text-[var(--text-primary)]">
                    {isMe ? '나' : msg.author.name}
                  </span>
                  <span>
                    {new Date(msg.createdAt).toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div
                  className={clsx(
                    'rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed',
                    isMe
                      ? 'bg-[var(--bubble-me)] text-white rounded-bl-md'
                      : 'bg-[var(--bubble-other)] text-[var(--text-primary)] rounded-bl-md',
                  )}
                >
                  {renderContent(msg.content)}
                </div>
              </div>
              {isMe && (
                <Avatar name={msg.author.name} presence={msg.author.presence} className="shrink-0" />
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 border-t border-[var(--border)] shrink-0 bg-[var(--sidebar)]/30">
        <div className="flex items-end gap-2 border border-[var(--border)] rounded-xl px-3 py-2 bg-white shadow-sm">
          <div className="relative shrink-0">
            <button
              type="button"
              className="text-gray-400 p-2 hover:text-gray-600"
              aria-label="추가"
              onClick={() => setAttachMenuOpen((o) => !o)}
            >
              <Plus size={18} />
            </button>
            <ComposeAttachMenu
              open={attachMenuOpen}
              onClose={() => setAttachMenuOpen(false)}
              onVote={() => channelId && setPollModalOpen(true)}
              onSchedule={() => {
                setScheduleMode(true);
                setSendMenuOpen(true);
              }}
            />
          </div>
          <button type="button" className="text-gray-400 p-2 hover:text-gray-600" aria-label="첨부">
            <Paperclip size={18} />
          </button>
          <button type="button" className="text-gray-400 p-2 hover:text-gray-600" aria-label="이모지">
            <Smile size={18} />
          </button>
          <input
            className="flex-1 outline-none text-sm min-h-[44px] bg-transparent"
            placeholder={scheduleMode ? '예약할 메시지 입력...' : placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <div className="relative shrink-0 flex items-center gap-1.5">
            <SendOptionsMenu
              open={sendMenuOpen}
              onClose={() => setSendMenuOpen(false)}
              onQuietSend={handleQuietSend}
              onSchedulePreset={handleSchedulePreset}
              onCustomSchedule={() => setScheduleMode(true)}
              showMeetingHint={showMeetingBubble}
              meetingName={primaryMeetingName}
              onDismissMeetingHint={() =>
                setMeetingHintDismissed((prev) => ({ ...prev, [ctxKey]: true }))
              }
              dontShowAgain={!!dontShowMeetingHint[ctxKey]}
              onDontShowAgainChange={(v) =>
                setDontShowMeetingHint((prev) => ({ ...prev, [ctxKey]: v }))
              }
            />
            <button
              type="button"
              className={clsx(
                'w-8 min-h-[44px] h-[44px] flex items-center justify-center rounded-lg text-white hover:opacity-95 shrink-0',
                scheduleMode ? 'bg-amber-500' : 'bg-[var(--primary)]',
              )}
              aria-label="예약/조용히 보내기"
              onClick={() => setSendMenuOpen((o) => !o)}
            >
              <Plus size={18} strokeWidth={2.5} />
            </button>
            <button
              type="button"
              className={clsx(
                'px-4 rounded-lg flex items-center gap-1.5 text-sm font-medium min-h-[44px] h-[44px] shrink-0',
                scheduleMode
                  ? 'bg-amber-500 text-white'
                  : 'bg-[var(--primary)] text-white hover:opacity-95',
              )}
              onClick={handleSend}
            >
              <Send size={16} />
              {scheduleMode ? '예약' : '보내기'}
            </button>
          </div>
        </div>
      </div>

      {channelId && (
        <PollModal
          channelId={channelId}
          open={pollModalOpen}
          onClose={() => setPollModalOpen(false)}
        />
      )}
    </div>
  );
}
