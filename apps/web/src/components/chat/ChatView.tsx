'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { Paperclip, Smile, Plus, Send } from 'lucide-react';
import { useDemoStore } from '@/store/demo-store';
import { Avatar } from '../ui/Avatar';
import { CURRENT_USER_ID, dms } from '@/lib/mock-data';
import { ComposeAttachMenu } from './ComposeAttachMenu';
import { SendOptionsMenu } from './SendOptionsMenu';
import { PollModal } from '../poll/PollModal';
import { ChatHeaderActions } from './ChatHeaderActions';
import { MessageContextMenu } from './MessageContextMenu';
import { ScheduleTimeModal } from './ScheduleTimeModal';
import type { MessageDto, ScheduledMessageDto } from '@/types';
import {
  defaultScheduleDatetimeLocal,
  formatScheduledAt,
  fromDatetimeLocalValue,
  parseSchedulePreset,
  toDatetimeLocalValue,
} from '@/lib/schedule-time';
import clsx from 'clsx';

function renderContent(content: string) {
  return content.replace(/\*\*/g, '');
}

function contextKey(channelId?: string, conversationId?: string) {
  return channelId ? `ch:${channelId}` : conversationId ? `dm:${conversationId}` : '';
}

type MessageContextTarget =
  | { type: 'message'; messageId: string; x: number; y: number }
  | { type: 'scheduled'; scheduledId: string; x: number; y: number };

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
    getScheduledMessages,
    sendMessage,
    scheduleMessage,
    sendQuietMessage,
    editMessage,
    deleteMessage,
    updateScheduledMessage,
    cancelScheduledMessage,
    pinMessage,
    unpinMessage,
    pinnedByChannel,
    users,
    channelMembers,
    currentUser,
  } = useDemoStore();

  const messages = getMessages(channelId, conversationId);
  const scheduledMessages = getScheduledMessages(channelId, conversationId);
  const [input, setInput] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingScheduledId, setEditingScheduledId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState('');
  const [editSendAtLocal, setEditSendAtLocal] = useState(defaultScheduleDatetimeLocal());
  const [scheduleMode, setScheduleMode] = useState(false);
  const [scheduleSendAtLocal, setScheduleSendAtLocal] = useState(defaultScheduleDatetimeLocal());
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<MessageContextTarget | null>(null);
  const [attachMenuOpen, setAttachMenuOpen] = useState(false);
  const [sendMenuOpen, setSendMenuOpen] = useState(false);
  const [pollModalOpen, setPollModalOpen] = useState(false);
  const [meetingHintDismissed, setMeetingHintDismissed] = useState<Record<string, boolean>>({});
  const [dontShowMeetingHint, setDontShowMeetingHint] = useState<Record<string, boolean>>({});
  const bottomRef = useRef<HTMLDivElement>(null);
  const ctxKey = contextKey(channelId, conversationId);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, scheduledMessages.length]);

  useEffect(() => {
    setSendMenuOpen(false);
    setScheduleMode(false);
    setScheduleModalOpen(false);
    setEditingMessageId(null);
    setEditingScheduledId(null);
    setEditDraft('');
    setContextMenu(null);
    setScheduleSendAtLocal(defaultScheduleDatetimeLocal());
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

  const submitSchedule = (content: string, sendAtLocal: string, label: string) => {
    const trimmed = content.trim() || '(예약 메시지)';
    const sendAt = fromDatetimeLocalValue(sendAtLocal).toISOString();
    scheduleMessage(trimmed, sendAt, channelId, conversationId, label);
  };

  const handleSend = () => {
    if (scheduleMode) {
      if (!input.trim()) return;
      submitSchedule(input, scheduleSendAtLocal, '사용자 지정');
      setInput('');
      setScheduleMode(false);
      return;
    }
    if (!input.trim()) return;
    sendMessage(input, channelId, conversationId);
    setInput('');
  };

  const handleQuietSend = () => {
    if (!input.trim()) return;
    sendQuietMessage(input, channelId, conversationId);
    setInput('');
  };

  const handleSchedulePreset = (label: string) => {
    submitSchedule(input, toDatetimeLocalValue(parseSchedulePreset(label)), label);
    setInput('');
  };

  const contextMenuItems = useMemo(() => {
    if (!contextMenu) return [];
    if (contextMenu.type === 'message') {
      const items = [
        {
          id: 'edit',
          label: '수정',
          onClick: () => {
            const msg = messages.find((m) => m.id === contextMenu.messageId);
            if (!msg) return;
            setEditingMessageId(msg.id);
            setEditingScheduledId(null);
            setEditDraft(msg.content);
          },
        },
        {
          id: 'delete',
          label: '삭제',
          variant: 'danger' as const,
          onClick: () => {
            if (!confirm('이 메시지를 삭제할까요?')) return;
            deleteMessage(contextMenu.messageId, channelId, conversationId);
            if (editingMessageId === contextMenu.messageId) {
              setEditingMessageId(null);
              setEditDraft('');
            }
          },
        },
      ];
      if (channelId) {
        const isPinned = (pinnedByChannel[channelId] ?? []).includes(contextMenu.messageId);
        items.splice(1, 0, {
          id: 'pin',
          label: isPinned ? '고정 해제' : '고정',
          onClick: () =>
            isPinned
              ? unpinMessage(channelId, contextMenu.messageId)
              : pinMessage(channelId, contextMenu.messageId),
        });
      }
      return items;
    }
    return [
      {
        id: 'edit',
        label: '수정',
        onClick: () => {
          const sched = scheduledMessages.find((s) => s.id === contextMenu.scheduledId);
          if (!sched) return;
          setEditingScheduledId(sched.id);
          setEditingMessageId(null);
          setEditDraft(sched.content);
          setEditSendAtLocal(toDatetimeLocalValue(new Date(sched.sendAt)));
        },
      },
      {
        id: 'cancel',
        label: '예약 취소',
        variant: 'danger' as const,
        onClick: () => {
          if (!confirm('예약 메시지를 취소할까요?')) return;
          cancelScheduledMessage(contextMenu.scheduledId);
          if (editingScheduledId === contextMenu.scheduledId) {
            setEditingScheduledId(null);
            setEditDraft('');
          }
        },
      },
    ];
  }, [
    contextMenu,
    messages,
    scheduledMessages,
    channelId,
    conversationId,
    deleteMessage,
    pinMessage,
    unpinMessage,
    pinnedByChannel,
    cancelScheduledMessage,
    editingMessageId,
    editingScheduledId,
  ]);

  return (
    <div className="flex flex-col h-full min-h-0 bg-white">
      <header className="px-5 py-2.5 border-b border-[var(--border)] shrink-0 flex items-center justify-between gap-3 min-h-[52px]">
        <h1 className="font-semibold text-[15px] truncate min-w-0">
          {channelId ? `# ${title}` : title}
        </h1>
        <ChatHeaderActions channelId={channelId} conversationId={conversationId} />
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
        {messages.map((msg) => (
          <SentMessageRow
            key={msg.id}
            msg={msg}
            editingMessageId={editingMessageId}
            editDraft={editDraft}
            onSaveEdit={() => {
              if (!editingMessageId) return;
              editMessage(editingMessageId, editDraft, channelId, conversationId);
              setEditingMessageId(null);
              setEditDraft('');
            }}
            onCancelEdit={() => {
              setEditingMessageId(null);
              setEditDraft('');
            }}
            onEditDraftChange={setEditDraft}
            onContextMenu={
              msg.authorId === CURRENT_USER_ID
                ? (e) => {
                    if (editingMessageId === msg.id) return;
                    e.preventDefault();
                    setContextMenu({
                      type: 'message',
                      messageId: msg.id,
                      x: e.clientX,
                      y: e.clientY,
                    });
                  }
                : undefined
            }
          />
        ))}
        {scheduledMessages.map((sched) => (
          <ScheduledMessageRow
            key={sched.id}
            scheduled={sched}
            author={currentUser}
            editingScheduledId={editingScheduledId}
            editDraft={editDraft}
            editSendAtLocal={editSendAtLocal}
            onEditSendAtChange={setEditSendAtLocal}
            onSaveEdit={() => {
              if (!editingScheduledId) return;
              updateScheduledMessage(
                editingScheduledId,
                editDraft,
                fromDatetimeLocalValue(editSendAtLocal).toISOString(),
              );
              setEditingScheduledId(null);
              setEditDraft('');
            }}
            onCancelEdit={() => {
              setEditingScheduledId(null);
              setEditDraft('');
            }}
            onEditDraftChange={setEditDraft}
            onContextMenu={(e) => {
              if (editingScheduledId === sched.id) return;
              e.preventDefault();
              setContextMenu({
                type: 'scheduled',
                scheduledId: sched.id,
                x: e.clientX,
                y: e.clientY,
              });
            }}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 border-t border-[var(--border)] shrink-0 bg-[var(--sidebar)]/30 space-y-2">
        {scheduleMode && (
          <div className="flex flex-wrap items-center gap-2 text-sm px-1">
            <span className="text-amber-800 font-medium text-xs">전송 예정</span>
            <input
              type="datetime-local"
              className="border border-amber-200 rounded-lg px-2 py-1.5 text-sm bg-amber-50/50"
              value={scheduleSendAtLocal}
              onChange={(e) => setScheduleSendAtLocal(e.target.value)}
            />
          </div>
        )}
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
              onCustomSchedule={() => setScheduleModalOpen(true)}
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

      {contextMenu && (
        <MessageContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextMenuItems}
          onClose={() => setContextMenu(null)}
        />
      )}

      <ScheduleTimeModal
        open={scheduleModalOpen}
        initialContent={input}
        onClose={() => setScheduleModalOpen(false)}
        onConfirm={(content, sendAtLocal) => {
          submitSchedule(content, sendAtLocal, '사용자 지정');
          setInput('');
          setScheduleModalOpen(false);
          setScheduleMode(false);
        }}
      />

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

function SentMessageRow({
  msg,
  editingMessageId,
  editDraft,
  onSaveEdit,
  onCancelEdit,
  onEditDraftChange,
  onContextMenu,
}: {
  msg: MessageDto;
  editingMessageId: string | null;
  editDraft: string;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onEditDraftChange: (v: string) => void;
  onContextMenu?: (e: React.MouseEvent) => void;
}) {
  const isMe = msg.authorId === CURRENT_USER_ID;
  const isEditing = editingMessageId === msg.id;

  return (
    <div
      className={clsx(
        'flex gap-3 items-start w-full',
        isMe ? 'flex-row justify-end' : 'flex-row',
      )}
    >
      {!isMe && <Avatar name={msg.author.name} presence={msg.author.presence} />}
      <div className={clsx('max-w-[72%]', isMe && 'items-end flex flex-col')}>
        <div
          className={clsx(
            'text-xs text-[var(--text-muted)] mb-1 flex gap-2 items-center',
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
            {msg.editedAt && ' · 수정됨'}
          </span>
        </div>
        {isEditing ? (
          <div className="w-full min-w-[200px] space-y-2">
            <textarea
              className="w-full border border-[var(--border)] rounded-xl px-3 py-2 text-sm outline-none resize-none min-h-[72px]"
              value={editDraft}
              onChange={(e) => onEditDraftChange(e.target.value)}
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                className="text-xs px-3 py-1.5 rounded-lg border border-[var(--border)]"
                onClick={onCancelEdit}
              >
                취소
              </button>
              <button
                type="button"
                className="text-xs px-3 py-1.5 rounded-lg bg-[var(--primary)] text-white"
                onClick={onSaveEdit}
              >
                저장
              </button>
            </div>
          </div>
        ) : (
          <div
            className={clsx(
              'rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed cursor-default',
              isMe
                ? 'bg-[var(--bubble-me)] text-white rounded-bl-md'
                : 'bg-[var(--bubble-other)] text-[var(--text-primary)] rounded-bl-md',
            )}
            onContextMenu={onContextMenu}
          >
            {renderContent(msg.content)}
          </div>
        )}
      </div>
      {isMe && (
        <Avatar name={msg.author.name} presence={msg.author.presence} className="shrink-0" />
      )}
    </div>
  );
}

function ScheduledMessageRow({
  scheduled,
  author,
  editingScheduledId,
  editDraft,
  editSendAtLocal,
  onEditSendAtChange,
  onSaveEdit,
  onCancelEdit,
  onEditDraftChange,
  onContextMenu,
}: {
  scheduled: ScheduledMessageDto;
  author: { name: string; presence: MessageDto['author']['presence'] };
  editingScheduledId: string | null;
  editDraft: string;
  editSendAtLocal: string;
  onEditSendAtChange: (v: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onEditDraftChange: (v: string) => void;
  onContextMenu: (e: React.MouseEvent) => void;
}) {
  const isEditing = editingScheduledId === scheduled.id;

  return (
    <div className="flex gap-3 items-start w-full flex-row justify-end">
      <div className="max-w-[72%] items-end flex flex-col">
        <div className="text-xs text-[var(--text-muted)] mb-1 flex gap-2 flex-row-reverse justify-end text-right">
          <span className="font-medium text-[var(--text-primary)]">나</span>
          <span className="text-amber-700">
            예약 · {formatScheduledAt(scheduled.sendAt)}
          </span>
        </div>
        {isEditing ? (
          <div className="w-full min-w-[240px] space-y-2">
            <textarea
              className="w-full border border-amber-300 rounded-xl px-3 py-2 text-sm outline-none resize-none min-h-[72px] bg-amber-50/50"
              value={editDraft}
              onChange={(e) => onEditDraftChange(e.target.value)}
            />
            <input
              type="datetime-local"
              className="w-full border border-amber-300 rounded-lg px-2 py-1.5 text-sm bg-amber-50/50"
              value={editSendAtLocal}
              onChange={(e) => onEditSendAtChange(e.target.value)}
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                className="text-xs px-3 py-1.5 rounded-lg border border-[var(--border)]"
                onClick={onCancelEdit}
              >
                취소
              </button>
              <button
                type="button"
                className="text-xs px-3 py-1.5 rounded-lg bg-amber-500 text-white"
                onClick={onSaveEdit}
              >
                저장
              </button>
            </div>
          </div>
        ) : (
          <div
            className="rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed bg-amber-100 text-amber-950 border border-amber-200/80 rounded-bl-md cursor-default"
            onContextMenu={onContextMenu}
          >
            {renderContent(scheduled.content)}
          </div>
        )}
      </div>
      <Avatar name={author.name} presence={author.presence} className="shrink-0" />
    </div>
  );
}
