'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useDemoStore } from '@/store/demo-store';
import { CURRENT_USER_ID, getUser } from '@/lib/mock-data';

const COLORS = ['#7B68EE', '#4A90E2', '#20B2AA', '#FF6B6B', '#FFA500'];

function toDateInput(iso: string) {
  return iso.slice(0, 10);
}

function toTimeInput(iso: string) {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function CreateEventModal({
  open,
  onClose,
  defaultChannelId,
  channels,
  editEventId,
}: {
  open: boolean;
  onClose: () => void;
  defaultChannelId?: string;
  channels: { id: string; name: string }[];
  editEventId?: string | null;
}) {
  const { addEvent, updateEvent, events, users } = useDemoStore();
  const editing = events.find((e) => e.id === editEventId);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('2026-05-26');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('11:00');
  const [color, setColor] = useState(COLORS[0]);
  const [channelId, setChannelId] = useState(defaultChannelId ?? channels[0]?.id ?? '');
  const [participantIds, setParticipantIds] = useState<string[]>([CURRENT_USER_ID]);

  useEffect(() => {
    if (!open) return;
    if (editing) {
      setTitle(editing.title);
      setDescription(editing.description ?? '');
      setDate(toDateInput(editing.startAt));
      setStartTime(toTimeInput(editing.startAt));
      setEndTime(toTimeInput(editing.endAt));
      setColor(editing.color);
      setChannelId(editing.channelIds[0] ?? '');
      setParticipantIds(editing.participants.map((p) => p.id));
    } else {
      setTitle('');
      setDescription('');
      setDate('2026-05-26');
      setStartTime('10:00');
      setEndTime('11:00');
      setColor(COLORS[0]);
      setChannelId(defaultChannelId ?? channels[0]?.id ?? '');
      setParticipantIds([CURRENT_USER_ID]);
    }
  }, [open, editEventId, editing, defaultChannelId, channels]);

  if (!open) return null;

  const toggleParticipant = (userId: string) => {
    setParticipantIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const startAt = `${date}T${startTime}:00`;
    const endAt = `${date}T${endTime}:00`;
    const participantUsers = participantIds
      .map((id) => users.find((u) => u.id === id) ?? getUser(id))
      .filter(Boolean);

    if (editing) {
      updateEvent(editing.id, {
        title: title.trim(),
        description: description.trim() || null,
        startAt,
        endAt,
        color,
        channelIds: channelId ? [channelId] : [],
        participantIds,
      });
    } else {
      addEvent({
        title: title.trim(),
        description: description.trim() || null,
        startAt,
        endAt,
        color,
        participants: participantUsers,
        channelIds: channelId ? [channelId] : [],
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <form
        onSubmit={handleSubmit}
        className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl border border-[var(--border)] max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center p-5 border-b border-[var(--divider)] sticky top-0 bg-white">
          <h3 className="font-semibold">{editing ? '일정 수정' : '새 일정'}</h3>
          <button type="button" onClick={onClose} className="p-1.5 rounded-md hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <label className="block text-sm">
            <span className="font-medium mb-1 block">제목</span>
            <input
              className="w-full border border-[var(--border)] rounded-lg px-3 py-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium mb-1 block">설명</span>
            <textarea
              className="w-full border border-[var(--border)] rounded-lg px-3 py-2 min-h-[60px]"
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
          <div className="grid grid-cols-2 gap-3">
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
            <span className="text-sm font-medium mb-2 block">참여자</span>
            <div className="border border-[var(--border)] rounded-lg p-2 max-h-36 overflow-y-auto space-y-1">
              {users.map((u) => (
                <label
                  key={u.id}
                  className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-50 cursor-pointer text-sm"
                >
                  <input
                    type="checkbox"
                    checked={participantIds.includes(u.id)}
                    onChange={() => toggleParticipant(u.id)}
                  />
                  <span>
                    {u.name}
                    <span className="text-[var(--text-muted)] text-xs ml-1">{u.team}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>
          {channels.length > 0 && (
            <label className="block text-sm">
              <span className="font-medium mb-1 block">연결 채널</span>
              <select
                className="w-full border border-[var(--border)] rounded-lg px-3 py-2"
                value={channelId}
                onChange={(e) => setChannelId(e.target.value)}
                disabled={!!defaultChannelId && !editing}
              >
                <option value="">없음</option>
                {channels.map((ch) => (
                  <option key={ch.id} value={ch.id}>
                    #{ch.name}
                  </option>
                ))}
              </select>
            </label>
          )}
          <div>
            <span className="text-sm font-medium mb-2 block">색상</span>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className="w-8 h-8 rounded-full border-2 border-white shadow"
                  style={{
                    backgroundColor: c,
                    outline: color === c ? '2px solid var(--accent-blue)' : 'none',
                  }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-2 p-5 border-t border-[var(--divider)] sticky bottom-0 bg-white">
          <button
            type="button"
            className="flex-1 border border-[var(--border)] rounded-xl py-2.5 text-sm"
            onClick={onClose}
          >
            취소
          </button>
          <button
            type="submit"
            className="flex-1 bg-[var(--primary)] text-white rounded-xl py-2.5 text-sm font-medium"
          >
            {editing ? '저장' : '만들기'}
          </button>
        </div>
      </form>
    </div>
  );
}
