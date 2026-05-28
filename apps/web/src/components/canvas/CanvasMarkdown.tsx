'use client';

import type { ReactNode } from 'react';

function renderInline(text: string) {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={i}
          className="px-1 py-0.5 rounded bg-gray-100 text-[13px] font-mono text-[var(--text-primary)]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

export function CanvasMarkdown({ content }: { content: string }) {
  const lines = content.split('\n');
  const blocks: ReactNode[] = [];
  let listItems: string[] = [];
  let listOrdered = false;
  let key = 0;

  const flushList = () => {
    if (listItems.length === 0) return;
    const ListTag = listOrdered ? 'ol' : 'ul';
    blocks.push(
      <ListTag
        key={key++}
        className={listOrdered ? 'list-decimal list-inside mb-3 space-y-1' : 'list-disc list-inside mb-3 space-y-1'}
      >
        {listItems.map((item, i) => (
          <li key={i} className="text-sm leading-relaxed text-[var(--text-primary)]">
            {renderInline(item)}
          </li>
        ))}
      </ListTag>,
    );
    listItems = [];
    listOrdered = false;
  };

  for (const line of lines) {
    const trimmed = line.trimEnd();
    if (trimmed === '') {
      flushList();
      continue;
    }

    const h3 = trimmed.match(/^###\s+(.+)$/);
    if (h3) {
      flushList();
      blocks.push(
        <h3 key={key++} className="text-base font-semibold mt-4 mb-2 text-[var(--text-primary)]">
          {renderInline(h3[1])}
        </h3>,
      );
      continue;
    }

    const h2 = trimmed.match(/^##\s+(.+)$/);
    if (h2) {
      flushList();
      blocks.push(
        <h2 key={key++} className="text-lg font-semibold mt-5 mb-2 text-[var(--text-primary)]">
          {renderInline(h2[1])}
        </h2>,
      );
      continue;
    }

    const h1 = trimmed.match(/^#\s+(.+)$/);
    if (h1) {
      flushList();
      blocks.push(
        <h1 key={key++} className="text-xl font-bold mt-0 mb-3 text-[var(--text-primary)]">
          {renderInline(h1[1])}
        </h1>,
      );
      continue;
    }

    const ul = trimmed.match(/^-\s+(.+)$/);
    if (ul) {
      if (listItems.length > 0 && listOrdered) flushList();
      listOrdered = false;
      listItems.push(ul[1]);
      continue;
    }

    const ol = trimmed.match(/^\d+\.\s+(.+)$/);
    if (ol) {
      if (listItems.length > 0 && !listOrdered) flushList();
      listOrdered = true;
      listItems.push(ol[1]);
      continue;
    }

    flushList();
    blocks.push(
      <p key={key++} className="text-sm leading-relaxed mb-2 text-[var(--text-primary)]">
        {renderInline(trimmed)}
      </p>,
    );
  }

  flushList();

  return <article className="max-w-none">{blocks}</article>;
}
