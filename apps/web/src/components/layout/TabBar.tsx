'use client';

import { Menu, X } from 'lucide-react';
import { useDemoStore } from '@/store/demo-store';
import clsx from 'clsx';

export function TabBar() {
  const { tabs, activeTabId, setActiveTab, closeTab, setMobileSidebarOpen } = useDemoStore();

  return (
    <div className="border-b border-[var(--divider)] bg-white shrink-0">
      <div className="flex items-center h-12">
        <button
          type="button"
          className="p-3 md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center shrink-0"
          onClick={() => setMobileSidebarOpen(true)}
          aria-label="메뉴"
        >
          <Menu size={20} />
        </button>
        <div className="flex-1 flex overflow-x-auto scrollbar-hide min-w-0">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={clsx(
                'group shrink-0 flex items-center gap-1.5 pl-3 pr-2.5 min-w-[112px] max-w-[240px] h-12 border-b-2 cursor-pointer text-sm transition-colors',
                activeTabId === tab.id
                  ? 'border-[var(--accent-blue)] text-[var(--accent-blue)] font-medium'
                  : 'border-transparent text-[var(--text-muted)] hover:bg-gray-50',
              )}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="truncate">{tab.label}</span>
              <button
                type="button"
                className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-gray-200 shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
                aria-label="탭 닫기"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          {tabs.length === 0 && (
            <span className="text-sm text-[var(--text-muted)] py-3 px-3 self-center">
              채널 또는 DM을 선택하세요
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
