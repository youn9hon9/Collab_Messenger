'use client';

import { useDemoStore } from '@/store/demo-store';
import { Avatar } from '../ui/Avatar';

export function ProfileSection() {
  const { currentUser, updateCurrentUser } = useDemoStore();

  return (
    <>
      <h2 className="text-lg font-bold mb-4">프로필</h2>
      <div className="flex items-center gap-4 mb-6">
        <Avatar name={currentUser.name} presence={currentUser.presence} />
        <p className="text-sm text-[var(--text-muted)]">
          상태는 사이드바 하단 프로필에서 변경할 수 있습니다.
        </p>
      </div>
      <div className="space-y-4 max-w-md">
        <div>
          <label className="text-sm font-semibold">이름</label>
          <input
            className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 mt-1 text-sm"
            value={currentUser.name}
            onChange={(e) => updateCurrentUser({ name: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-semibold">팀</label>
          <input
            className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 mt-1 text-sm"
            value={currentUser.team ?? ''}
            onChange={(e) => updateCurrentUser({ team: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-semibold">이메일</label>
          <input
            className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 mt-1 text-sm bg-gray-50"
            value={currentUser.email}
            readOnly
          />
        </div>
      </div>
    </>
  );
}
