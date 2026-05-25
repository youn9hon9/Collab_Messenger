'use client';

import { demoLocaleSettings } from '@/lib/mock-data';
import { useDemoStore } from '@/store/demo-store';

export function LanguageRegionSection() {
  const setToast = useDemoStore((s) => s.setToast);
  const locale = demoLocaleSettings;

  const notifySaved = () => {
    setToast('데모: 설정이 저장되었습니다.');
    setTimeout(() => setToast(null), 2000);
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-1">언어 및 지역</h2>
      <p className="text-sm text-[var(--text-muted)] mb-6">
        워크스페이스 기본 표시 언어와 시간대입니다. (데모 데이터)
      </p>
      <div className="space-y-4 max-w-lg">
        <label className="block">
          <span className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-1.5 block">
            표시 언어
          </span>
          <select
            className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm bg-white"
            defaultValue={locale.language}
            onChange={notifySaved}
          >
            <option value="ko">{locale.languageLabel}</option>
            <option value="en">English (US)</option>
            <option value="ja">日本語</option>
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-1.5 block">
            지역
          </span>
          <select
            className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm bg-white"
            defaultValue={locale.region}
            onChange={notifySaved}
          >
            <option value="KR">{locale.regionLabel}</option>
            <option value="US">United States</option>
            <option value="JP">Japan</option>
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-1.5 block">
            시간대
          </span>
          <select
            className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm bg-white"
            defaultValue={locale.timezone}
            onChange={notifySaved}
          >
            <option value="Asia/Seoul">{locale.timezoneLabel}</option>
            <option value="America/New_York">(UTC-05:00) New York</option>
            <option value="Europe/London">(UTC+00:00) London</option>
          </select>
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-1.5 block">
              날짜 형식
            </span>
            <input
              readOnly
              className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm bg-gray-50"
              value={locale.dateFormat}
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-1.5 block">
              시간 형식
            </span>
            <select
              className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm bg-white"
              defaultValue={locale.timeFormat}
              onChange={notifySaved}
            >
              <option value="24h">24시간</option>
              <option value="12h">12시간 (AM/PM)</option>
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}
