'use client';

import { useEffect, useState } from 'react';
import { useDemoStore } from '@/store/demo-store';

const COLORS = ['#7B68EE', '#4A90E2', '#20B2AA', '#FF6B6B', '#FFA500'];

function toDateInput(iso: string) {
  return iso.slice(0, 10);
}

function toTimeInput(iso: string) {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function EventDetailPanel() {
  const { events, selectedEventId, updateEvent, users, channels } = useDemoStore();
  const event = events.find((e) => e.id === selectedEventId);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [color, setColor] = useState(COLORS[0]);
  const [channelId, setChannelId] = useState('');
  const [participantIds, setParticipantIds] = useState<string[]>([]);

  useEffect(() => {
    if (!event) return;
    setTitle(event.title);
    setDescription(event.description ?? '');
    setDate(toDateInput(event.startAt));
    setStartTime(toTimeInput(event.startAt));
    setEndTime(toTimeInput(event.endAt));
    setColor(event.color);
    setChannelId(event.channelIds[0] ?? '');
    setParticipantIds(event.participants.map((p) => p.id));
  }, [event]);

  if (!event) {
    return <p className="p-4 text-sm text-[var(--text-muted)]">이벤트를 선택하세요</p>;
  }

  const toggleParticipant = (userId: string) => {
    setParticipantIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId],
    );
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
  };

  return (
    <div className="p-4 space-y-4 overflow-y-auto">
      <h3 className="font-semibold text-base">일정 상세</h3>
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
      <button
        type="button"
        className="w-full bg-[var(--primary)] text-white py-2.5 rounded-xl text-sm font-medium"
        onClick={handleSave}
      >
        저장
      </button>
    </div>
  );
}
