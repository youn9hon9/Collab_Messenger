'use client';

import { useEffect, useRef } from 'react';

export type ContextMenuItem = {
  id: string;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'danger';
};

export function MessageContextMenu({
  x,
  y,
  items,
  onClose,
}: {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onPointer = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const onScroll = () => onClose();
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onScroll, true);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [onClose]);

  const menuWidth = 160;
  const left = Math.min(x, typeof window !== 'undefined' ? window.innerWidth - menuWidth - 8 : x);
  const top = Math.min(y, typeof window !== 'undefined' ? window.innerHeight - items.length * 40 - 16 : y);

  return (
    <div
      ref={ref}
      className="fixed z-[100] min-w-[160px] bg-white border border-[var(--border)] rounded-lg shadow-lg py-1 text-sm"
      style={{ left, top }}
      role="menu"
    >
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          role="menuitem"
          className={`block w-full text-left px-3 py-2 hover:bg-gray-50 ${
            item.variant === 'danger' ? 'text-red-600 hover:bg-red-50' : ''
          }`}
          onClick={() => {
            item.onClick();
            onClose();
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
