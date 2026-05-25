'use client';

import { useState } from 'react';
import { useDemoStore } from '@/store/demo-store';
import clsx from 'clsx';

const STATUS_LABELS: Record<string, string> = {
  BEFORE_START: '시작 전',
  IN_PROGRESS: '진행 중',
  COMPLETED: '완료',
};

export function CanvasView() {
  const {
    canvasDocs,
    aiSuggestion,
    openTab,
    acceptAiSuggestion,
    dismissAiSuggestion,
  } = useDemoStore();
  const [selectedId, setSelectedId] = useState<string | null>(canvasDocs[0]?.id ?? null);
  const selected = canvasDocs.find((d) => d.id === selectedId);

  const grouped = {
    BEFORE_START: canvasDocs.filter((d) => d.status === 'BEFORE_START' && !d.isAiGenerated),
    IN_PROGRESS: canvasDocs.filter((d) => d.status === 'IN_PROGRESS'),
    COMPLETED: canvasDocs.filter((d) => d.status === 'COMPLETED'),
    AI: canvasDocs.filter((d) => d.isAiGenerated),
  };

  return (
    <div className="flex h-full min-h-0">
      <div className="w-72 border-r border-[var(--border)] overflow-y-auto p-3 space-y-4 bg-[var(--sidebar)]/50">
        {Object.entries(grouped).map(([key, items]) =>
          items.length > 0 ? (
            <div key={key}>
              <h4 className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wide mb-2 px-1">
                {key === 'AI' ? 'AI 생성됨' : STATUS_LABELS[key]}
              </h4>
              {items.map((doc) => (
                <button
                  key={doc.id}
                  type="button"
                  className={clsx(
                    'w-full text-left p-3 rounded-xl mb-1.5 border transition-colors',
                    selectedId === doc.id
                      ? 'bg-white border-[var(--accent-blue)] shadow-sm'
                      : 'bg-white/80 border-transparent hover:border-[var(--border)]',
                  )}
                  onClick={() => {
                    setSelectedId(doc.id);
                    openTab({
                      id: `canvas-${doc.id}`,
                      type: 'canvas',
                      label: doc.title.length > 18 ? doc.title.slice(0, 18) + '…' : doc.title,
                      targetId: doc.id,
                    });
                  }}
                >
                  <div className="text-sm font-medium truncate">{doc.title}</div>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {doc.tags.map((t) => (
                      <span key={t} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          ) : null,
        )}
        {aiSuggestion && (
          <div className="p-3 bg-purple-50 rounded-xl border border-purple-200/80 text-sm">
            <p className="mb-3 text-purple-900 leading-relaxed">
              5월 26일 오후 3–4시 &apos;{aiSuggestion.title}&apos; 주제가 감지되었습니다. 초안을
              생성할까요?
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                className="bg-[var(--primary)] text-white px-3 py-1.5 rounded-lg text-xs font-medium"
                onClick={() => {
                  acceptAiSuggestion();
                  setSelectedId(null);
                }}
              >
                생성
              </button>
              <button
                type="button"
                className="text-xs text-gray-600 px-2"
                onClick={dismissAiSuggestion}
              >
                삭제
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="flex-1 p-6 overflow-y-auto bg-white">
        {selected ? (
          <>
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <h2 className="text-xl font-bold">{selected.title}</h2>
              {selected.tags.map((t) => (
                <span key={t} className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                  {t}
                </span>
              ))}
              <span className="text-xs text-[var(--text-muted)]">
                {STATUS_LABELS[selected.status]} · {selected.updatedAt}
              </span>
            </div>
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-[var(--text-primary)]">
              {selected.content}
            </pre>
          </>
        ) : (
          <p className="text-[var(--text-muted)] text-center mt-24">문서를 선택하세요</p>
        )}
      </div>
    </div>
  );
}
