'use client';



import { Users, Search, Pin, Calendar, Menu, X } from 'lucide-react';

import { useDemoStore } from '@/store/demo-store';

import clsx from 'clsx';



export function TabBar() {

  const {

    tabs,

    activeTabId,

    setActiveTab,

    closeTab,

    setPanelType,

    setMobileSidebarOpen,

    getMeetingCount,

  } = useDemoStore();



  const meetingCount = getMeetingCount();

  const activeTab = tabs.find((t) => t.id === activeTabId);

  const showChatActions = activeTab?.type === 'channel' || activeTab?.type === 'dm';

  const showScheduleAction = activeTab?.type === 'channel' && !!activeTab.targetId;



  return (

    <div className="border-b border-[var(--divider)] bg-white shrink-0">

      <div className="flex items-center h-12">

        <button

          type="button"

          className="p-3 md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center"

          onClick={() => setMobileSidebarOpen(true)}

          aria-label="메뉴"

        >

          <Menu size={20} />

        </button>

        <div className="flex-1 flex overflow-x-auto scrollbar-hide">

          {tabs.map((tab) => (

            <div

              key={tab.id}

              className={clsx(

                'group shrink-0 flex items-center gap-1.5 pl-3 pr-2.5 min-w-[88px] max-w-[220px] h-12 border-b-2 cursor-pointer text-sm transition-colors',

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

            <span className="text-sm text-[var(--text-muted)] py-3 px-4 self-center">

              채널 또는 DM을 선택하세요

            </span>

          )}

        </div>

        {showChatActions && (

          <div className="flex items-center gap-0.5 px-2 shrink-0 border-l border-[var(--divider)]">

            <button

              type="button"

              className="p-2.5 rounded-lg hover:bg-gray-100 relative min-w-[44px] min-h-[44px] flex items-center justify-center"

              onClick={() => setPanelType('members')}

              title="멤버"

            >

              <Users size={18} />

              <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] min-w-[16px] h-4 rounded-full flex items-center justify-center px-0.5 font-bold">

                {meetingCount > 0 ? meetingCount : 7}

              </span>

            </button>

            <button

              type="button"

              className="p-2.5 rounded-lg hover:bg-gray-100 min-w-[44px] min-h-[44px] flex items-center justify-center"

              onClick={() => setPanelType('topic')}

              title="검색"

            >

              <Search size={18} />

            </button>

            <button

              type="button"

              className="p-2.5 rounded-lg hover:bg-gray-100 min-w-[44px] min-h-[44px] flex items-center justify-center"

              onClick={() => setPanelType('pinned')}

              title="고정"

            >

              <Pin size={18} />

            </button>

            {showScheduleAction && (

              <button

                type="button"

                className="p-2.5 rounded-lg hover:bg-gray-100 min-w-[44px] min-h-[44px] flex items-center justify-center"

                onClick={() => setPanelType('schedule')}

                title="이 채팅방 연관 일정"

              >

                <Calendar size={18} />

              </button>

            )}

          </div>

        )}

      </div>

    </div>

  );

}


