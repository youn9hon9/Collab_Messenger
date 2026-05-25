'use client';

import { ReactNode } from 'react';
import { LeftSidebar } from './LeftSidebar';
import { TabBar } from './TabBar';
import { ContextPanel } from './ContextPanel';
import { useDemoStore } from '@/store/demo-store';
import { Toast } from '../ui/Toast';
import clsx from 'clsx';

export function AppShell({
  children,
  contextPanel,
}: {
  children: ReactNode;
  contextPanel?: ReactNode;
}) {
  const { panelType, toast, setToast } = useDemoStore();

  return (
    <div className="h-screen flex overflow-hidden bg-white">
      <LeftSidebar />
      <div className="flex-1 flex flex-col min-w-0 md:ml-0">
        <TabBar />
        <div className="flex-1 flex min-h-0 relative">
          <main
            className={clsx(
              'flex-1 flex flex-col min-w-0 overflow-hidden',
              panelType && 'md:max-w-[calc(100%-320px)]',
            )}
          >
            {children}
          </main>
          {panelType && contextPanel && <ContextPanel>{contextPanel}</ContextPanel>}
        </div>
      </div>
      <Toast message={toast} onClose={() => setToast(null)} />
    </div>
  );
}
