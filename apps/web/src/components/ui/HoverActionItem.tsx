'use client';

import { X } from 'lucide-react';
import { ReactNode } from 'react';
import clsx from 'clsx';

export function HoverActionItem({
  children,
  onClick,
  onRemove,
  active,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  onRemove?: () => void;
  active?: boolean;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        'group flex items-center justify-between rounded-md px-2 py-1.5 text-sm cursor-pointer min-h-[44px]',
        active ? 'bg-blue-50 text-[var(--accent-blue)]' : 'hover:bg-gray-100',
        className,
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    >
      <span className="flex-1 truncate">{children}</span>
      {onRemove && (
        <button
          type="button"
          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-200 shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label="닫기"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
