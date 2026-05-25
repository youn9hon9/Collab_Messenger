'use client';

import clsx from 'clsx';
import type { PresenceStatus } from '@/types';

export function Avatar({
  name,
  presence,
  size = 'md',
  className,
}: {
  name: string;
  presence?: PresenceStatus;
  size?: 'sm' | 'md';
  className?: string;
}) {
  const sz = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm';
  const dot =
    presence === 'ONLINE'
      ? 'bg-green-500'
      : presence === 'IN_MEETING'
        ? 'bg-red-500'
        : presence === 'AWAY'
          ? 'bg-amber-400'
          : 'bg-gray-300';

  return (
    <div className={clsx('relative shrink-0', className)}>
      <div
        className={clsx(
          sz,
          'rounded-lg avatar-purple text-white flex items-center justify-center font-medium',
        )}
      >
        {name[0]}
      </div>
      {presence && (
        <span
          className={clsx(
            'absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white translate-x-1/4 translate-y-1/4',
            dot,
          )}
        />
      )}
    </div>
  );
}
