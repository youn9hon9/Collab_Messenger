'use client';

import { useState } from 'react';
import { SettingsPageHeader } from '@/components/settings/SettingsPageHeader';
import { HELP_CONTENT, HELP_SECTIONS, type HelpSectionId } from '@/lib/help-content';
import clsx from 'clsx';

export default function HelpPage() {
  const [section, setSection] = useState<HelpSectionId>('overview');
  const content = HELP_CONTENT[section];

  return (
    <div className="flex flex-col h-full min-h-0 bg-gray-100">
      <SettingsPageHeader />
      <div className="flex flex-1 min-h-0 w-full">
        <aside className="w-56 bg-white border-r border-[var(--divider)] shrink-0 p-2 overflow-y-auto">
          <p className="px-3 py-2 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wide">
            도움말
          </p>
          {HELP_SECTIONS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={clsx(
                'block w-full text-left px-3 py-2.5 rounded-lg text-sm mb-0.5 transition-colors',
                section === item.id
                  ? 'bg-blue-50 text-[var(--accent-blue)] font-medium'
                  : 'hover:bg-gray-50 text-[var(--text-primary)]',
              )}
              onClick={() => setSection(item.id)}
            >
              {item.label}
            </button>
          ))}
        </aside>
        <main className="flex-1 p-6 overflow-y-auto min-w-0">
          <div className="bg-white rounded-xl border border-[var(--border)] p-6 shadow-sm max-w-2xl">
            <h2 className="text-lg font-bold mb-4">{content.title}</h2>
            <div className="space-y-4 text-sm leading-relaxed text-[var(--text-primary)]">
              {content.body.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
