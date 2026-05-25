'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { useDemoStore } from '@/store/demo-store';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const { initDemo, isLoggedIn, switchWorkspace, setPanelType, setMobilePanelOpen } =
    useDemoStore();

  useEffect(() => {
    const ok =
      typeof window !== 'undefined' &&
      (sessionStorage.getItem('demoUser') || isLoggedIn);
    if (!ok) {
      router.replace('/');
      return;
    }
    initDemo();
    if (workspaceId) switchWorkspace(workspaceId);
    setPanelType(null);
    setMobilePanelOpen(false);
  }, [
    router,
    initDemo,
    isLoggedIn,
    workspaceId,
    switchWorkspace,
    setPanelType,
    setMobilePanelOpen,
  ]);

  return <AppShell>{children}</AppShell>;
}
