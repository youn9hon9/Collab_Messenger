'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, MoreHorizontal, Plus, X } from 'lucide-react';
import clsx from 'clsx';
import { useDemoStore } from '@/store/demo-store';
import type { CanvasDocDto } from '@/types';
import { CanvasDiffModal } from './CanvasDiffModal';
import { CanvasMarkdown } from './CanvasMarkdown';

const SECTIONS: { key: 'BEFORE_START' | 'IN_PROGRESS' | 'COMPLETED' | 'AI'; label: string }[] = [
  { key: 'BEFORE_START', label: '시작 전' },
  { key: 'IN_PROGRESS', label: '진행 중' },
  { key: 'COMPLETED', label: '완료' },
  { key: 'AI', label: 'AI 생성됨' },
];

function formatCanvasDate(iso: string) {
  const d = new Date(iso.includes('T') ? iso : `${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

function selectDoc(
  doc: CanvasDocDto,
  setSelectedId: (id: string) => void,
  setTagsInput: (v: string) => void,
  setCustomDate: (v: string) => void,
  openTab: ReturnType<typeof useDemoStore.getState>['openTab'],
) {
  setSelectedId(doc.id);
  setTagsInput(doc.tags.join(', '));
  setCustomDate(doc.updatedAt);
  openTab({
    id: `canvas-${doc.id}`,
    type: 'canvas',
    label: doc.title.length > 18 ? `${doc.title.slice(0, 18)}…` : doc.title,
    targetId: doc.id,
  });
}

export function CanvasView() {
  const {
    canvasDocs,
    aiSuggestion,
    canvasEditSuggestions,
    canvasVersions,
    lastCanvasAppliedSuggestion,
    openTab,
    acceptAiSuggestion,
    dismissAiSuggestion,
    applyCanvasEditSuggestion,
    ignoreCanvasEditSuggestion,
    undoLastCanvasSuggestionApply,
    updateCanvasDoc,
    updateCanvasDocMeta,
    moveCanvasDocStatus,
    deleteCanvasDoc,
    addCanvasDoc,
    restoreCanvasVersion,
  } = useDemoStore();

  const [selectedId, setSelectedId] = useState<string | null>(canvasDocs[0]?.id ?? null);
  const [diffSuggestionId, setDiffSuggestionId] = useState<string | null>(null);
  const [tagsInput, setTagsInput] = useState('');
  const [customDate, setCustomDate] = useState('');
  const [titleInput, setTitleInput] = useState('');
  const [contentDraft, setContentDraft] = useState('');
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  const selected = canvasDocs.find((d) => d.id === selectedId);
  const selectedSuggestion = selected
    ? canvasEditSuggestions.find((s) => s.docId === selected.id)
    : null;
  const previewSuggestion = canvasEditSuggestions.find((s) => s.id === diffSuggestionId) ?? null;
  const previewDoc = previewSuggestion
    ? (canvasDocs.find((d) => d.id === previewSuggestion.docId) ?? null)
    : null;

  useEffect(() => {
    if (!selected) return;
    setTagsInput(selected.tags.join(', '));
    setCustomDate(selected.updatedAt);
    setTitleInput(selected.title);
    setContentDraft(selected.content);
    setIsEditingContent(false);
  }, [selected?.id, selected?.tags, selected?.updatedAt, selected?.title, selected?.content]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setMoreMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const getSectionItems = (key: (typeof SECTIONS)[number]['key']) => {
    if (key === 'AI') return canvasDocs.filter((d) => d.isAiGenerated);
    return canvasDocs.filter((d) => d.status === key && !d.isAiGenerated);
  };

  const toggleSection = (key: string) => {
    setCollapsedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCreateDoc = () => {
    const id = addCanvasDoc();
    const doc = useDemoStore.getState().canvasDocs.find((d) => d.id === id);
    if (doc) {
      selectDoc(doc, setSelectedId, setTagsInput, setCustomDate, openTab);
    }
  };

  const renderCard = (doc: CanvasDocDto, droppableKey?: string) => {
    const hasEditSuggestion = canvasEditSuggestions.some((s) => s.docId === doc.id);
    return (
      <button
        key={doc.id}
        type="button"
        draggable={!!droppableKey}
        className={clsx(
          'w-full text-left p-3 rounded-xl mb-1.5 border transition-colors',
          selectedId === doc.id
            ? 'bg-white border-[var(--accent-blue)] shadow-sm'
            : 'bg-white/90 border-transparent hover:border-[var(--border)]',
        )}
        onDragStart={(e) => {
          if (!droppableKey) return;
          e.dataTransfer.setData('text/plain', doc.id);
        }}
        onClick={() => selectDoc(doc, setSelectedId, setTagsInput, setCustomDate, openTab)}
      >
        <div className="text-sm font-medium truncate flex items-center gap-1.5 flex-wrap">
          <span className="truncate">{doc.title}</span>
          {hasEditSuggestion && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 shrink-0">
              AI 수정 제안
            </span>
          )}
        </div>
        <div className="flex items-center justify-between gap-2 mt-2">
          <div className="flex gap-1 flex-wrap min-w-0">
            {doc.tags.slice(0, 2).map((t) => (
              <span
                key={t}
                className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded"
              >
                {t}
              </span>
            ))}
          </div>
          <span className="text-[10px] text-[var(--text-muted)] shrink-0">
            {formatCanvasDate(doc.updatedAt)}
          </span>
        </div>
      </button>
    );
  };

  return (
    <div className="flex h-full min-h-0">
      <div className="w-72 border-r border-[var(--border)] flex flex-col bg-[var(--sidebar)]/50 shrink-0">
        <div className="flex items-center justify-between px-3 py-3 border-b border-[var(--divider)] shrink-0">
          <h3 className="font-semibold text-[15px]">Canvas</h3>
          <button
            type="button"
            className="p-1.5 rounded-md hover:bg-white/80 text-[var(--text-muted)]"
            aria-label="새 문서"
            onClick={handleCreateDoc}
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
          {SECTIONS.map(({ key, label }) => {
            const items = getSectionItems(key);
            const collapsed = collapsedSections[key];
            const droppable = key !== 'AI';

            return (
              <div key={key}>
                <button
                  type="button"
                  className="w-full flex items-center gap-1 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wide mb-2 px-1 hover:text-[var(--text-primary)]"
                  onClick={() => toggleSection(key)}
                >
                  <ChevronDown
                    size={14}
                    className={clsx('transition-transform', collapsed && '-rotate-90')}
                  />
                  {label}
                  <span className="font-normal normal-case">({items.length})</span>
                </button>
                {!collapsed && (
                  <div
                    className={clsx(droppable && items.length === 0 && 'min-h-[48px] rounded-lg border border-dashed border-[var(--border)]')}
                    onDragOver={
                      droppable
                        ? (e) => {
                            e.preventDefault();
                          }
                        : undefined
                    }
                    onDrop={
                      droppable
                        ? (e) => {
                            e.preventDefault();
                            const docId = e.dataTransfer.getData('text/plain');
                            if (!docId) return;
                            moveCanvasDocStatus(docId, key);
                          }
                        : undefined
                    }
                  >
                    {items.map((doc) => renderCard(doc, droppable ? key : undefined))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {aiSuggestion && (
          <div className="p-3 shrink-0">
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-sm">
              <p className="mb-3 text-amber-900 leading-relaxed">
                5월 26일 오후 3–4시 &apos;{aiSuggestion.title}&apos; 주제가 감지되었습니다. 초안을
                생성할까요?
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="bg-[var(--primary)] text-white px-3 py-1.5 rounded-lg text-xs font-medium"
                  onClick={() => {
                    acceptAiSuggestion();
                    const newest = useDemoStore.getState().canvasDocs[0];
                    if (newest) {
                      selectDoc(newest, setSelectedId, setTagsInput, setCustomDate, openTab);
                    }
                  }}
                >
                  생성하기
                </button>
                <button
                  type="button"
                  className="text-xs text-amber-800 px-2 hover:underline"
                  onClick={dismissAiSuggestion}
                >
                  무시
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 p-6 overflow-y-auto bg-white min-w-0">
        {selected ? (
          <>
            <div className="flex items-start justify-between gap-3 mb-4">
              <input
                type="text"
                className="text-xl font-bold flex-1 min-w-0 bg-transparent border-b border-transparent hover:border-[var(--border)] focus:border-[var(--accent-blue)] outline-none pb-0.5"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onBlur={() => {
                  if (titleInput.trim() && titleInput !== selected.title) {
                    updateCanvasDocMeta(selected.id, { title: titleInput });
                  }
                }}
                aria-label="문서 제목"
              />
              <div className="relative shrink-0" ref={moreMenuRef}>
                <button
                  type="button"
                  className="p-2 rounded-lg hover:bg-gray-100 text-[var(--text-muted)]"
                  aria-label="더보기"
                  onClick={() => setMoreMenuOpen((v) => !v)}
                >
                  <MoreHorizontal size={20} />
                </button>
                {moreMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-[var(--border)] rounded-lg shadow-lg z-20 py-1 text-sm">
                    <button
                      type="button"
                      className="w-full text-left px-3 py-2 hover:bg-gray-50"
                      onClick={() => {
                        setMoreMenuOpen(false);
                        setHistoryOpen(true);
                      }}
                    >
                      버전 히스토리
                    </button>
                    {lastCanvasAppliedSuggestion?.docId === selected.id && (
                      <button
                        type="button"
                        className="w-full text-left px-3 py-2 hover:bg-gray-50"
                        onClick={() => {
                          undoLastCanvasSuggestionApply();
                          setMoreMenuOpen(false);
                        }}
                      >
                        AI 적용 Undo
                      </button>
                    )}
                    <button
                      type="button"
                      className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50"
                      onClick={() => {
                        setMoreMenuOpen(false);
                        if (!confirm(`"${selected.title}" 문서를 삭제할까요?`)) return;
                        deleteCanvasDoc(selected.id);
                        setSelectedId(canvasDocs.find((d) => d.id !== selected.id)?.id ?? null);
                      }}
                    >
                      문서 삭제
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-[var(--text-muted)] text-xs">태그</span>
                <input
                  className="border border-[var(--border)] rounded-lg px-2 py-1.5 text-sm min-w-[120px]"
                  value={tagsInput}
                  placeholder="쉼표로 구분"
                  onChange={(e) => setTagsInput(e.target.value)}
                  onBlur={() =>
                    updateCanvasDocMeta(selected.id, {
                      tags: tagsInput
                        .split(',')
                        .map((x) => x.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[var(--text-muted)] text-xs">상태</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" aria-hidden />
                <select
                  className="border border-[var(--border)] rounded-lg px-2 py-1.5 text-sm"
                  value={selected.status}
                  onChange={(e) =>
                    updateCanvasDocMeta(selected.id, {
                      status: e.target.value as CanvasDocDto['status'],
                    })
                  }
                >
                  <option value="BEFORE_START">시작 전</option>
                  <option value="IN_PROGRESS">진행 중</option>
                  <option value="COMPLETED">완료</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[var(--text-muted)] text-xs">날짜</span>
                <input
                  type="date"
                  className="border border-[var(--border)] rounded-lg px-2 py-1.5 text-sm"
                  value={customDate}
                  onChange={(e) => {
                    setCustomDate(e.target.value);
                    updateCanvasDocMeta(selected.id, { updatedAt: e.target.value });
                  }}
                />
                <span className="text-xs text-[var(--text-muted)] hidden sm:inline">
                  {formatCanvasDate(customDate || selected.updatedAt)}
                </span>
              </div>
            </div>

            {selectedSuggestion && (
              <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm">
                <p className="text-amber-900 mb-1 font-medium">
                  새로운 정보가 주제와 연관된 것 같습니다. 변경 사항을 확인할까요?
                </p>
                <p className="text-amber-800/90 mb-3 text-xs leading-relaxed">
                  {selectedSuggestion.reason}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-lg bg-[var(--primary)] text-white text-xs font-medium"
                    onClick={() => setDiffSuggestionId(selectedSuggestion.id)}
                  >
                    변경 사항 확인
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1.5 text-xs text-amber-800 hover:underline"
                    onClick={() => ignoreCanvasEditSuggestion(selectedSuggestion.id)}
                  >
                    무시하기
                  </button>
                </div>
              </div>
            )}

            <div className="border border-[var(--border)] rounded-xl overflow-hidden bg-white">
              <div className="flex items-center justify-between gap-2 px-4 py-2.5 border-b border-[var(--divider)] bg-[var(--sidebar)]/40">
                <span className="text-xs font-medium text-[var(--text-muted)]">본문</span>
                {isEditingContent ? (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="text-xs px-2.5 py-1 rounded-lg border border-[var(--border)] hover:bg-white"
                      onClick={() => {
                        setContentDraft(selected.content);
                        setIsEditingContent(false);
                      }}
                    >
                      취소
                    </button>
                    <button
                      type="button"
                      className="text-xs px-2.5 py-1 rounded-lg bg-[var(--primary)] text-white"
                      onClick={() => {
                        updateCanvasDoc(selected.id, contentDraft);
                        setIsEditingContent(false);
                      }}
                    >
                      저장
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="text-xs px-2.5 py-1 rounded-lg border border-[var(--border)] hover:bg-white text-[var(--primary)]"
                    onClick={() => setIsEditingContent(true)}
                  >
                    편집
                  </button>
                )}
              </div>
              {isEditingContent ? (
                <textarea
                  className="w-full min-h-[360px] p-4 text-sm font-mono leading-relaxed outline-none resize-y bg-white"
                  value={contentDraft}
                  onChange={(e) => setContentDraft(e.target.value)}
                  placeholder="Markdown으로 작성하세요 (# 제목, ## 소제목, - 목록)"
                  spellCheck={false}
                />
              ) : (
                <div className="p-5">
                  <CanvasMarkdown content={selected.content} />
                </div>
              )}
            </div>
          </>
        ) : (
          <p className="text-[var(--text-muted)] text-center mt-24">문서를 선택하세요</p>
        )}
      </div>

      <CanvasDiffModal
        open={!!previewSuggestion && !!previewDoc}
        before={previewDoc?.content ?? ''}
        after={previewSuggestion?.suggestedContent ?? ''}
        reason={previewSuggestion?.reason}
        onClose={() => setDiffSuggestionId(null)}
        onApply={() => {
          if (!previewSuggestion) return;
          applyCanvasEditSuggestion(previewSuggestion.id);
          setDiffSuggestionId(null);
        }}
      />

      {historyOpen && selected && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-xl border border-[var(--border)] shadow-xl flex flex-col max-h-[70vh]">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
              <h3 className="font-semibold text-sm">버전 히스토리</h3>
              <button
                type="button"
                className="p-1 rounded hover:bg-gray-100"
                onClick={() => setHistoryOpen(false)}
                aria-label="닫기"
              >
                <X size={18} />
              </button>
            </div>
            <div className="overflow-y-auto p-3 space-y-2">
              {(canvasVersions[selected.id] ?? [])
                .slice()
                .reverse()
                .map((v) => (
                  <div
                    key={v.id}
                    className="flex items-center justify-between gap-2 border border-[var(--border)] rounded-lg px-3 py-2 text-sm"
                  >
                    <div className="min-w-0">
                      <div className="text-xs text-[var(--text-muted)]">{v.updatedAt}</div>
                      <div className="truncate">{v.reason}</div>
                    </div>
                    <button
                      type="button"
                      className="text-xs text-[var(--primary)] shrink-0 hover:underline"
                      onClick={() => {
                        restoreCanvasVersion(selected.id, v.id);
                        setHistoryOpen(false);
                      }}
                    >
                      복원
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
