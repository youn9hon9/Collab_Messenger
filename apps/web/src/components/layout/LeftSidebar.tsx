'use client';

import { useState } from 'react';
import {
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  Hash,
  MessageCircle,
  FileText,
  Calendar,
  Settings,
  UserPlus,
  Plus,
} from 'lucide-react';
import clsx from 'clsx';
import { useDemoStore, workspaces } from '@/store/demo-store';
import { HoverActionItem } from '../ui/HoverActionItem';
import { InviteModal } from '../modals/InviteModal';
import { CreateChannelModal } from '../modals/CreateChannelModal';
import { Avatar } from '../ui/Avatar';
import { dms } from '@/lib/mock-data';

export function LeftSidebar() {
  const {
    sidebarCollapsed,
    setSidebarCollapsed,
    navSection,
    setNavSection,
    openTab,
    channels,
    workspaceId,
    switchWorkspace,
    currentUser,
    mobileSidebarOpen,
    setMobileSidebarOpen,
  } = useDemoStore();

  const [wsOpen, setWsOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [createChannelOpen, setCreateChannelOpen] = useState(false);
  const currentWs = workspaces.find((w) => w.id === workspaceId)!;

  const navItems = [
    { id: 'channels' as const, label: 'Channels', icon: Hash },
    { id: 'dms' as const, label: 'Direct Messages', icon: MessageCircle },
    { id: 'canvas' as const, label: 'Canvas', icon: FileText },
    { id: 'schedule' as const, label: 'Schedule', icon: Calendar },
  ];

  const presenceLabel =
    currentUser.presence === 'ONLINE'
      ? '활동 중'
      : currentUser.presence === 'IN_MEETING'
        ? '회의 중'
        : currentUser.presence === 'AWAY'
          ? '자리 비움'
          : '오프라인';

  return (
    <>
      <aside
        className={clsx(
          'flex flex-col border-r border-[var(--border)] bg-[var(--sidebar)] h-full transition-all duration-200',
          sidebarCollapsed ? 'w-[56px]' : 'w-64',
          'fixed md:relative z-40 md:z-auto h-screen md:h-full',
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        )}
      >
        <div className="p-3 border-b border-[var(--divider)]">
          <div className="flex items-center gap-1">
            {!sidebarCollapsed && (
              <div className="relative flex-1 min-w-0">
                <button
                  type="button"
                  className="flex items-center gap-1 w-full font-semibold text-left text-[15px] truncate"
                  onClick={() => setWsOpen(!wsOpen)}
                >
                  <span className="truncate">{currentWs.name}</span>
                  <ChevronDown size={16} className="shrink-0" />
                </button>
                {wsOpen && (
                  <div className="absolute top-full left-0 mt-1 w-full bg-white border border-[var(--border)] rounded-lg shadow-lg z-50 py-1">
                    {workspaces.map((w) => (
                      <button
                        key={w.id}
                        type="button"
                        className={clsx(
                          'block w-full text-left px-3 py-2.5 hover:bg-gray-50 text-sm',
                          w.id === workspaceId && 'bg-blue-50 text-[var(--accent-blue)] font-medium',
                        )}
                        onClick={() => {
                          switchWorkspace(w.id);
                          setWsOpen(false);
                        }}
                      >
                        {w.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            <button
              type="button"
              className="p-1.5 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100/90 shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              aria-label="사이드바 접기"
            >
              {sidebarCollapsed ? (
                <ChevronsRight size={20} strokeWidth={2.5} />
              ) : (
                <ChevronsLeft size={20} strokeWidth={2.5} />
              )}
            </button>
          </div>
          {!sidebarCollapsed && (
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                className="flex-1 btn-invite text-white text-xs py-2.5 rounded-lg flex items-center justify-center gap-1.5 font-medium shadow-sm"
                onClick={() => setInviteOpen(true)}
              >
                <UserPlus size={14} /> 초대
              </button>
              <a
                href={`/w/${workspaceId}/settings`}
                className="flex-1 btn-settings text-white text-xs py-2.5 rounded-lg flex items-center justify-center gap-1.5 font-medium shadow-sm"
              >
                <Settings size={14} /> 설정
              </a>
            </div>
          )}
        </div>

        <nav className="px-2 space-y-0.5">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={clsx(
                'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm min-h-[44px] transition-colors',
                navSection === item.id
                  ? 'bg-white font-semibold shadow-sm text-[var(--text-primary)]'
                  : 'text-[var(--text-muted)] hover:bg-white/60',
              )}
              onClick={() => {
                setNavSection(item.id);
                if (item.id === 'canvas') {
                  openTab({ id: 'canvas-main', type: 'canvas', label: 'Canvas' });
                }
                if (item.id === 'schedule') {
                  openTab({ id: 'schedule-main', type: 'schedule', label: 'Schedule' });
                }
                setMobileSidebarOpen(false);
              }}
              title={item.label}
            >
              <item.icon size={18} className="shrink-0" />
              {!sidebarCollapsed && item.label}
            </button>
          ))}
        </nav>

        {!sidebarCollapsed && (navSection === 'channels' || navSection === 'dms') && (
          <div className="border-t border-[var(--divider)] mx-2 shrink-0" />
        )}

        {!sidebarCollapsed && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden px-2 mt-1 pb-2">
            <div className="flex-1 overflow-y-auto min-h-0">
              {navSection === 'channels' &&
                channels.map((ch) => (
                  <HoverActionItem
                    key={ch.id}
                    onClick={() =>
                      openTab({
                        id: `channel-${ch.id}`,
                        type: 'channel',
                        label: ch.name,
                        targetId: ch.id,
                      })
                    }
                  >
                    <span className="text-[var(--text-muted)] mr-1">#</span>
                    {ch.name}
                  </HoverActionItem>
                ))}
              {navSection === 'dms' &&
                dms.map((dm) => (
                  <HoverActionItem
                    key={dm.id}
                    onClick={() =>
                      openTab({
                        id: `dm-${dm.id}`,
                        type: 'dm',
                        label: dm.otherUser.name,
                        targetId: dm.id,
                      })
                    }
                  >
                    <div className="flex items-center gap-2">
                      <Avatar name={dm.otherUser.name} presence={dm.otherUser.presence} size="sm" />
                      <div className="min-w-0">
                        <div className="truncate">{dm.otherUser.name}</div>
                        <div className="text-xs text-[var(--text-muted)]">{dm.otherUser.team}</div>
                      </div>
                    </div>
                  </HoverActionItem>
                ))}
            </div>
            {navSection === 'channels' && (
              <button
                type="button"
                className="w-full flex items-center justify-center gap-1.5 px-2 py-2.5 mt-2 text-sm text-[var(--primary)] font-medium hover:bg-white/60 rounded-lg border border-[var(--divider)] shrink-0"
                onClick={() => setCreateChannelOpen(true)}
              >
                <Plus size={16} /> 채널 만들기
              </button>
            )}
          </div>
        )}

        <a
          href="/me"
          className="p-3 border-t border-[var(--divider)] flex items-center gap-3 hover:bg-white/50 min-h-[56px] mt-auto"
        >
          <Avatar name={currentUser.name} presence={currentUser.presence} />
          {!sidebarCollapsed && (
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">{currentUser.name}</div>
              <div className="text-xs text-[var(--text-muted)]">{presenceLabel}</div>
            </div>
          )}
        </a>
      </aside>

      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <InviteModal open={inviteOpen} onClose={() => setInviteOpen(false)} />
      <CreateChannelModal
        open={createChannelOpen}
        onClose={() => setCreateChannelOpen(false)}
        onCreated={(channelId, name) => {
          openTab({
            id: `channel-${channelId}`,
            type: 'channel',
            label: name,
            targetId: channelId,
          });
          setNavSection('channels');
        }}
      />
    </>
  );
}
