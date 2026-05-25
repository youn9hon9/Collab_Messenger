'use client';

import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { useDemoStore } from '@/store/demo-store';
import { CreateEventModal } from '../schedule/CreateEventModal';

export function SchedulePanel({ channelId }: { channelId: string }) {
  const { events, setSelectedEvent, channels } = useDemoStore();
  const [createOpen, setCreateOpen] = useState(false);
  const channelEvents = useMemo(
    () => events.filter((e) => e.channelIds.includes(channelId)),
    [events, channelId],
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {channelEvents.length === 0 ? (
          <p className="text-center text-[var(--text-muted)] text-sm py-16 px-4">
            이 채팅방과 연관된 일정이 없습니다
          </p>
        ) : (
          <ul>
            {channelEvents.map((e) => (
              <li key={e.id}>
                <button
                  type="button"
                  className="w-full text-left px-4 py-3.5 border-b border-[var(--divider)] hover:bg-gray-50 relative pl-5"
                  onClick={() => setSelectedEvent(e.id)}
                >
                  <span
                    className="absolute left-2 top-4 bottom-4 w-1 rounded"
                    style={{ backgroundColor: e.color }}
                  />
                  <div className="font-medium text-sm">{e.title}</div>
                  <div className="text-xs text-[var(--text-muted)] mt-1">
                    {new Date(e.startAt).toLocaleString('ko-KR')}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="p-3 border-t border-[var(--divider)] shrink-0">
        <button
          type="button"
          className="w-full flex items-center justify-center gap-1.5 text-sm font-medium text-[var(--primary)] py-2 rounded-lg hover:bg-gray-50"
          onClick={() => setCreateOpen(true)}
        >
          <Plus size={16} /> 새 일정
        </button>
      </div>
      <CreateEventModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        defaultChannelId={channelId}
        channels={channels}
      />
    </div>
  );
}
