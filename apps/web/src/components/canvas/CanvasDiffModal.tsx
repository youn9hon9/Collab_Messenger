'use client';

import clsx from 'clsx';
import { buildSideBySideDiff } from '@/lib/canvas-diff';

type CanvasDiffModalProps = {
  open: boolean;
  before: string;
  after: string;
  reason?: string;
  onClose: () => void;
  onApply: () => void;
};

function DiffPanel({
  title,
  side,
  rows,
}: {
  title: string;
  side: 'left' | 'right';
  rows: ReturnType<typeof buildSideBySideDiff>;
}) {
  let lineNum = 0;

  return (
    <div className="flex flex-col min-h-0 border border-[var(--border)] rounded-lg overflow-hidden">
      <div className="px-3 py-2 text-xs font-semibold bg-gray-50 border-b border-[var(--border)] text-[var(--text-muted)]">
        {title}
      </div>
      <div className="overflow-y-auto max-h-[50vh] text-xs font-mono leading-5">
        {rows.map((row, idx) => {
          const isLeft = side === 'left';
          const line = isLeft ? row.leftLine : row.rightLine;
          const type = isLeft ? row.leftType : row.rightType;
          const showLineNum = line !== null && line !== '';
          if (showLineNum) lineNum += 1;

          return (
            <div
              key={`${side}-${idx}`}
              className={clsx(
                'flex min-h-[1.25rem]',
                type === 'removed' && isLeft && 'bg-red-50 text-red-800',
                type === 'added' && !isLeft && 'bg-emerald-50 text-emerald-800',
                type === 'same' && 'text-[var(--text-primary)]',
                type === 'empty' && 'bg-gray-50/50',
              )}
            >
              <span className="shrink-0 w-10 text-right pr-2 py-0.5 text-gray-400 tabular-nums select-none">
                {showLineNum ? lineNum : ''}
              </span>
              <span className="flex-1 py-0.5 pr-2 whitespace-pre-wrap break-words">
                {line ?? '\u00a0'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function CanvasDiffModal({
  open,
  before,
  after,
  reason,
  onClose,
  onApply,
}: CanvasDiffModalProps) {
  if (!open) return null;

  const rows = buildSideBySideDiff(before, after);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div
        className="w-full max-w-5xl max-h-[90vh] overflow-hidden bg-white rounded-xl border border-[var(--border)] shadow-xl flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="canvas-diff-title"
      >
        <div className="px-5 py-4 border-b border-[var(--border)] shrink-0">
          <h3 id="canvas-diff-title" className="font-semibold text-base">
            변경 사항 확인
          </h3>
          {reason && (
            <p className="text-sm text-[var(--text-muted)] mt-1 leading-relaxed">{reason}</p>
          )}
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 min-h-0 overflow-y-auto">
          <DiffPanel title="수정 전" side="left" rows={rows} />
          <DiffPanel title="수정 후" side="right" rows={rows} />
        </div>

        <div className="px-5 py-3 border-t border-[var(--border)] flex justify-end gap-2 shrink-0">
          <button
            type="button"
            className="text-sm px-4 py-2 rounded-lg border border-[var(--border)] hover:bg-gray-50"
            onClick={onClose}
          >
            취소
          </button>
          <button
            type="button"
            className="text-sm px-4 py-2 rounded-lg bg-[var(--primary)] text-white font-medium hover:opacity-90"
            onClick={onApply}
          >
            적용
          </button>
        </div>
      </div>
    </div>
  );
}
