'use client';

import { useEffect, useState } from 'react';
import type { EventDto } from '@/types';
import { useDemoStore } from '@/store/demo-store';

const COLORS = ['#7B68EE', '#4A90E2', '#20B2AA', '#FF6B6B', '#FFA500'];

function toDateInput(iso: string) {
  return iso.slice(0, 10);
}

function toTimeInput(iso: string) {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function formatDateTimeRange(startAt: string, endAt: string) {
  const start = new Date(startAt);
  const dateStr = start.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });
  return `${dateStr} · ${toTimeInput(startAt)} – ${toTimeInput(endAt)}`;
}

function syncFormFromEvent(
  event: EventDto,
  setters: {
    setTitle: (v: string) => void;
    setDescription: (v: string) => void;
    setDate: (v: string) => void;
    setStartTime: (v: string) => void;
    setEndTime: (v: string) => void;
    setColor: (v: string) => void;
    setChannelId: (v: string) => void;
    setParticipantIds: (v: string[]) => void;
  },
) {
  setters.setTitle(event.title);
  setters.setDescription(event.description ?? '');
  setters.setDate(toDateInput(event.startAt));
  setters.setStartTime(toTimeInput(event.startAt));
  setters.setEndTime(toTimeInput(event.endAt));
  setters.setColor(event.color);
  setters.setChannelId(event.channelIds[0] ?? '');
  setters.setParticipantIds(event.participants.map((p) => p.id));
}

export function EventDetailPanel() {
  const {
    events,
    selectedEventId,
    updateEvent,
    deleteEvent,
    setSelectedEvent,
    users,
    channels,
  } = useDemoStore();
  const event = events.find((e) => e.id === selectedEventId);

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [color, setColor] = useState(COLORS[0]);
  const [channelId, setChannelId] = useState('');
  const [participantIds, setParticipantIds] = useState<string[]>([]);

  useEffect(() => {
    setIsEditing(false);
  }, [selectedEventId]);

  useEffect(() => {
    if (!event) return;
    syncFormFromEvent(event, {
      setTitle,
      setDescription,
      setDate,
      setStartTime,
      setEndTime,
      setColor,
      setChannelId,
      setParticipantIds,
    });
  }, [event]);

  if (!event) {
    return <p className="p-4 text-sm text-[var(--text-muted)]">이벤트를 선택하세요</p>;
  }

  const linkedChannel = channels.find((ch) => ch.id === event.channelIds[0]);

  const toggleParticipant = (userId: string) => {
    setParticipantIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId],
    );
  };

  const handleCancelEdit = () => {
    syncFormFromEvent(event, {
      setTitle,
      setDescription,
      setDate,
      setStartTime,
      setEndTime,
      setColor,
      setChannelId,
      setParticipantIds,
    });
    setIsEditing(false);
  };

  const handleSave = () => {
    if (!title.trim()) return;
    updateEvent(event.id, {
      title: title.trim(),
      description: description.trim() || null,
      startAt: `${date}T${startTime}:00`,
      endAt: `${date}T${endTime}:00`,
      color,
      channelIds: channelId ? [channelId] : [],
      participantIds,
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (!confirm('정말로 삭제하시겠습니까?')) return;
    deleteEvent(event.id);
    setSelectedEvent(null);
  };

  if (!isEditing) {
    return (
      <div className="p-4 space-y-5 overflow-y-auto">
        <div className="flex items-start gap-3">
          <span
            className="w-1 self-stretch rounded-full shrink-0 min-h-[2.5rem]"
            style={{ backgroundColor: event.color }}
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg leading-snug">{event.title}</h3>
            <p className="text-sm text-[var(--text-muted)] mt-2">
              {formatDateTimeRange(event.startAt, event.endAt)}
            </p>
          </div>
        </div>

        {event.description ? (
          <div>
            <p className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-1.5">설명</p>
            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
              {event.description}
            </p>
          </div>
        ) : null}

        <div>
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-1.5">참여자</p>
          {event.participants.length > 0 ? (
            <p className="text-sm text-gray-700">
              {event.participants.map((p) => p.name).join(', ')}
            </p>
          ) : (
            <p className="text-sm text-[var(--text-muted)]">없음</p>
          )}
        </div>

        <div>
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-1.5">
            연결 채널
          </p>
          <p className="text-sm text-gray-700">
            {linkedChannel ? `# ${linkedChannel.name}` : '없음'}
          </p>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            className="flex-1 border border-[var(--border)] rounded-xl py-2.5 text-sm font-medium hover:bg-gray-50"
            onClick={() => setIsEditing(true)}
          >
            수정하기
          </button>
          <button
            type="button"
            className="flex-1 border border-red-200 text-red-600 rounded-xl py-2.5 text-sm font-medium hover:bg-red-50"
            onClick={handleDelete}
          >
            일정 삭제하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 overflow-y-auto">
      <h3 className="font-semibold text-base">일정 수정</h3>
      <label className="block text-sm">
        <span className="font-medium mb-1 block">제목</span>
        <input
          className="w-full border border-[var(--border)] rounded-lg px-3 py-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>
      <label className="block text-sm">
        <span className="font-medium mb-1 block">설명</span>
        <textarea
          className="w-full border border-[var(--border)] rounded-lg px-3 py-2 min-h-[56px]"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      <label className="block text-sm">
        <span className="font-medium mb-1 block">날짜</span>
        <input
          type="date"
          className="w-full border border-[var(--border)] rounded-lg px-3 py-2"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </label>
      <div className="grid grid-cols-2 gap-2">
        <label className="block text-sm">
          <span className="font-medium mb-1 block">시작</span>
          <input
            type="time"
            className="w-full border border-[var(--border)] rounded-lg px-3 py-2"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium mb-1 block">종료</span>
          <input
            type="time"
            className="w-full border border-[var(--border)] rounded-lg px-3 py-2"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </label>
      </div>
      <div>
        <p className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-2">참여자</p>
        <div className="border border-[var(--border)] rounded-lg p-2 max-h-32 overflow-y-auto space-y-1">
          {users.map((u) => (
            <label
              key={u.id}
              className="flex items-center gap-2 px-1 py-1 rounded hover:bg-gray-50 cursor-pointer text-sm"
            >
              <input
                type="checkbox"
                checked={participantIds.includes(u.id)}
                onChange={() => toggleParticipant(u.id)}
              />
              {u.name}
            </label>
          ))}
        </div>
      </div>
      <label className="block text-sm">
        <span className="font-medium mb-1 block">연결 채널</span>
        <select
          className="w-full border border-[var(--border)] rounded-lg px-3 py-2"
          value={channelId}
          onChange={(e) => setChannelId(e.target.value)}
        >
          <option value="">없음</option>
          {channels.map((ch) => (
            <option key={ch.id} value={ch.id}>
              #{ch.name}
            </option>
          ))}
        </select>
      </label>
      <div>
        <span className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-2">색상</span>
        <div className="flex gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              className="w-7 h-7 rounded-full border-2 border-white shadow"
              style={{
                backgroundColor: c,
                outline: color === c ? '2px solid var(--accent-blue)' : 'none',
              }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <button
          type="button"
          className="flex-1 border border-[var(--border)] rounded-xl py-2.5 text-sm font-medium hover:bg-gray-50"
          onClick={handleCancelEdit}
        >
          취소
        </button>
        <button
          type="button"
          className="flex-1 bg-[var(--primary)] text-white py-2.5 rounded-xl text-sm font-medium"
          onClick={handleSave}
        >
          저장하기
        </button>
      </div>
    </div>
  );
}
