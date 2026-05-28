'use client';

import { X, Users, Pin, Calendar, Search } from 'lucide-react';
import { useDemoStore } from '@/store/demo-store';
import type { PanelType } from '@/types';
import clsx from 'clsx';

const config: Record<PanelType, { title: string; icon: typeof Users }> = {
  members: { title: '멤버', icon: Users },
  pinned: { title: '고정된 메시지', icon: Pin },
  schedule: { title: '이 채팅방과 연관된 일정', icon: Calendar },
  event: { title: '일정 상세', icon: Calendar },
  topic: { title: '검색', icon: Search },
};

export function ContextPanel({ children }: { children: React.ReactNode }) {
  const {
    panelType,
    setPanelType,
    setMobilePanelOpen,
    mobilePanelOpen,
    setSelectedEvent,
    topicSearchKeyword,
    setTopicSearchKeyword,
  } = useDemoStore();

  if (!panelType) return null;
  const { title, icon: Icon } = config[panelType];

  return (
    <>
      <aside
        className={clsx(
          'border-l border-[var(--divider)] bg-white flex flex-col h-full w-[320px] shrink-0',
          'fixed right-0 top-0 z-40 md:relative md:z-auto h-screen md:h-full',
          mobilePanelOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0',
          'transition-transform duration-200 shadow-xl md:shadow-none',
        )}
      >
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--divider)] bg-[var(--sidebar)] shrink-0">
          <Icon size={18} className="text-[var(--text-muted)] shrink-0" />
          {panelType === 'topic' ? (
            <input
              type="search"
              className="flex-1 min-w-0 border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-white outline-none focus:ring-1 focus:ring-[var(--accent-blue)]"
              placeholder="메시지 검색"
              value={topicSearchKeyword}
              onChange={(e) => setTopicSearchKeyword(e.target.value)}
              aria-label="메시지 검색"
            />
          ) : (
            <h3 className="font-semibold text-sm flex-1">{title}</h3>
          )}
          <button
            type="button"
            onClick={() => {
              if (panelType === 'event') setSelectedEvent(null);
              else {
                setPanelType(null);
                setMobilePanelOpen(false);
              }
            }}
            className="p-1.5 rounded-md hover:bg-gray-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </aside>
      {mobilePanelOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => {
            if (panelType === 'event') setSelectedEvent(null);
            else {
              setPanelType(null);
              setMobilePanelOpen(false);
            }
          }}
        />
      )}
    </>
  );
}
