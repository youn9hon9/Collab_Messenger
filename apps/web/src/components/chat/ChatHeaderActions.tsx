'use client';

import { Users, Search, Pin, Calendar } from 'lucide-react';
import { useDemoStore } from '@/store/demo-store';

export function ChatHeaderActions({
  channelId,
  conversationId,
}: {
  channelId?: string;
  conversationId?: string;
}) {
  const { setPanelType, getMeetingCount } = useDemoStore();
  const meetingCount = getMeetingCount();
  const showSchedule = !!channelId;

  if (!channelId && !conversationId) return null;

  return (
    <div className="flex items-center gap-0.5 shrink-0">
      <button
        type="button"
        className="p-2 rounded-lg hover:bg-gray-100 relative min-w-[40px] min-h-[40px] flex items-center justify-center"
        onClick={() => setPanelType('members')}
        title="멤버"
      >
        <Users size={18} />
        {meetingCount > 0 && (
          <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-[10px] min-w-[16px] h-4 rounded-full flex items-center justify-center px-0.5 font-bold">
            {meetingCount}
          </span>
        )}
      </button>
      <button
        type="button"
        className="p-2 rounded-lg hover:bg-gray-100 min-w-[40px] min-h-[40px] flex items-center justify-center"
        onClick={() => setPanelType('topic')}
        title="검색"
      >
        <Search size={18} />
      </button>
      <button
        type="button"
        className="p-2 rounded-lg hover:bg-gray-100 min-w-[40px] min-h-[40px] flex items-center justify-center"
        onClick={() => setPanelType('pinned')}
        title="고정"
      >
        <Pin size={18} />
      </button>
      {showSchedule && (
        <button
          type="button"
          className="p-2 rounded-lg hover:bg-gray-100 min-w-[40px] min-h-[40px] flex items-center justify-center"
          onClick={() => setPanelType('schedule')}
          title="이 채팅방 연관 일정"
        >
          <Calendar size={18} />
        </button>
      )}
    </div>
  );
}
