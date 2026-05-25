'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDemoStore } from '@/store/demo-store';
import { AppShell } from '@/components/layout/AppShell';
import { ChatView } from '@/components/chat/ChatView';
import { ScheduleView } from '@/components/schedule/ScheduleView';
import { CanvasView } from '@/components/canvas/CanvasView';
import { MembersPanel } from '@/components/panels/MembersPanel';
import { PinnedPanel } from '@/components/panels/PinnedPanel';
import { TopicPanel } from '@/components/panels/TopicPanel';
import { SchedulePanel } from '@/components/panels/SchedulePanel';
import { EventDetailPanel } from '@/components/panels/EventDetailPanel';

export default function WorkspacePage() {
  const router = useRouter();
  const { tabs, activeTabId, panelType, initDemo, isLoggedIn } = useDemoStore();

  useEffect(() => {
    const ok =
      typeof window !== 'undefined' &&
      (sessionStorage.getItem('demoUser') || isLoggedIn);
    if (!ok) {
      router.replace('/');
      return;
    }
    initDemo();
  }, [router, initDemo, isLoggedIn]);

  const activeTab = tabs.find((t) => t.id === activeTabId);
  const activeChannelId = activeTab?.type === 'channel' ? activeTab.targetId : undefined;
  const activeDmId = activeTab?.type === 'dm' ? activeTab.targetId : undefined;

  const contextPanel = () => {
    if (!panelType) return null;
    switch (panelType) {
      case 'members':
        return <MembersPanel />;
      case 'pinned':
        return activeChannelId ? (
          <PinnedPanel channelId={activeChannelId} />
        ) : activeDmId ? (
          <PinnedPanel conversationId={activeDmId} />
        ) : (
          <p className="p-4 text-sm text-[var(--text-muted)]">채널 또는 DM을 선택하세요</p>
        );
      case 'topic':
        return activeChannelId ? (
          <TopicPanel channelId={activeChannelId} />
        ) : activeDmId ? (
          <TopicPanel conversationId={activeDmId} />
        ) : (
          <p className="p-4 text-sm text-[var(--text-muted)]">채널 또는 DM을 선택하세요</p>
        );
      case 'schedule':
        return activeChannelId ? (
          <SchedulePanel channelId={activeChannelId} />
        ) : (
          <p className="p-4 text-sm text-[var(--text-muted)]">채널을 선택하세요</p>
        );
      case 'event':
        return <EventDetailPanel />;
      default:
        return null;
    }
  };

  const mainContent = () => {
    if (!activeTab) {
      return (
        <div className="flex-1 flex items-center justify-center text-[var(--text-muted)]">
          채널 또는 DM을 선택하세요
        </div>
      );
    }
    if (activeTab.type === 'schedule') return <ScheduleView />;
    if (activeTab.type === 'canvas') return <CanvasView />;
    if (activeTab.type === 'channel' && activeTab.targetId) {
      return (
        <ChatView
          channelId={activeTab.targetId}
          title={activeTab.label}
          placeholder={`# ${activeTab.label}에 메시지 보내기`}
        />
      );
    }
    if (activeTab.type === 'dm' && activeTab.targetId) {
      return (
        <ChatView
          conversationId={activeTab.targetId}
          title={activeTab.label}
          placeholder={`${activeTab.label}에게 메시지 보내기`}
        />
      );
    }
    return null;
  };

  return <AppShell contextPanel={contextPanel()}>{mainContent()}</AppShell>;
}
