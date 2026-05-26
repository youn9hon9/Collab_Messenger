'use client';

import { useState } from 'react';
import { useDemoStore } from '@/store/demo-store';
import { CURRENT_USER_ID } from '@/lib/mock-data';
import { InviteModal } from '@/components/modals/InviteModal';
import { Avatar } from '@/components/ui/Avatar';
import { SettingsPageHeader } from '@/components/settings/SettingsPageHeader';
import { LanguageRegionSection } from '@/components/settings/LanguageRegionSection';
import { DangerZoneSection } from '@/components/settings/DangerZoneSection';
import { ChannelEditSection } from '@/components/settings/ChannelEditSection';
import { ChannelMembersSection } from '@/components/settings/ChannelMembersSection';
import { RolesSection } from '@/components/settings/RolesSection';
import { ProfileSection } from '@/components/settings/ProfileSection';

export default function SettingsPage() {
  const { users, workspaceRoles, updateMemberRole, removeMember, channels } = useDemoStore();
  const [tab, setTab] = useState<'workspace' | 'channel'>('workspace');
  const [section, setSection] = useState('profile');
  const [selectedChannel, setSelectedChannel] = useState(channels[0]?.id ?? null);
  const [inviteOpen, setInviteOpen] = useState(false);

  const sidebarItems =
    tab === 'workspace'
      ? [
          { id: 'profile', label: '프로필' },
          { id: 'members', label: '멤버' },
          { id: 'roles', label: '역할 및 권한' },
          { id: 'language', label: '언어 및 지역' },
          { id: 'danger', label: '위험 구역' },
        ]
      : [
          { id: 'edit', label: '편집' },
          { id: 'members', label: '멤버' },
          { id: 'roles', label: '역할 및 권한' },
          { id: 'danger', label: '위험 구역' },
        ];

  const handleRemoveMember = (userId: string, name: string) => {
    if (userId === CURRENT_USER_ID) return;
    if (!confirm(`${name}님을 워크스페이스에서 제거할까요?`)) return;
    removeMember(userId);
  };

  const renderMainContent = () => {
    if (section === 'profile' && tab === 'workspace') {
      return <ProfileSection />;
    }

    if (section === 'members' && tab === 'workspace') {
      return (
        <>
          <h2 className="text-lg font-bold mb-4">멤버</h2>
          <ul className="space-y-0 divide-y divide-[var(--divider)]">
            {users.map((m) => (
              <li key={m.id} className="flex items-center gap-3 py-4 first:pt-0">
                <Avatar name={m.name} presence={m.presence} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold">{m.name}</div>
                  <div className="text-xs text-[var(--text-muted)]">{m.team}</div>
                </div>
                <select
                  className="border border-[var(--border)] rounded-lg px-2 py-1.5 text-sm"
                  value={
                    workspaceRoles.some((r) => r.id === m.role)
                      ? m.role
                      : workspaceRoles.find((r) => r.isSystem)?.id
                  }
                  onChange={(e) => updateMemberRole(m.id, e.target.value)}
                >
                  {workspaceRoles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
                {m.id !== CURRENT_USER_ID ? (
                  <button
                    type="button"
                    className="text-red-400 p-2 hover:bg-red-50 rounded"
                    title="멤버 제거"
                    onClick={() => handleRemoveMember(m.id, m.name)}
                  >
                    🗑
                  </button>
                ) : (
                  <span
                    className="text-xs text-[var(--text-muted)] px-2 py-2 shrink-0"
                    title="본인은 제거할 수 없습니다"
                  >
                    (나)
                  </span>
                )}
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="w-full mt-6 bg-[var(--accent-blue)] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
            onClick={() => setInviteOpen(true)}
          >
            멤버 초대하기
          </button>
        </>
      );
    }

    if (section === 'roles') {
      return <RolesSection />;
    }

    if (tab === 'channel' && section === 'edit' && selectedChannel) {
      return <ChannelEditSection channelId={selectedChannel} />;
    }

    if (tab === 'channel' && section === 'members' && selectedChannel) {
      return <ChannelMembersSection channelId={selectedChannel} />;
    }

    if (section === 'language' && tab === 'workspace') {
      return <LanguageRegionSection />;
    }

    if (section === 'danger') {
      return <DangerZoneSection />;
    }

    return (
      <p className="text-[var(--text-muted)] text-center py-16 text-sm">항목을 선택하세요</p>
    );
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-gray-100">
      <SettingsPageHeader />
      <div className="flex border-b border-[var(--divider)] bg-white shadow-sm shrink-0">
        <button
          type="button"
          className={`flex-1 py-3.5 text-sm font-semibold flex items-center justify-center gap-2 ${
            tab === 'workspace'
              ? 'border-b-2 border-[var(--accent-blue)] text-[var(--accent-blue)] bg-blue-50/50'
              : 'text-[var(--text-muted)]'
          }`}
          onClick={() => {
            setTab('workspace');
            setSection('profile');
          }}
        >
          워크스페이스 설정
        </button>
        <button
          type="button"
          className={`flex-1 py-3.5 text-sm font-semibold ${
            tab === 'channel'
              ? 'border-b-2 border-[var(--accent-blue)] text-[var(--accent-blue)] bg-blue-50/50'
              : 'text-[var(--text-muted)]'
          }`}
          onClick={() => {
            setTab('channel');
            setSection('edit');
          }}
        >
          # 채널 설정
        </button>
      </div>
      <div className="flex flex-1 min-h-0 w-full">
        <aside className="w-56 bg-white border-r border-[var(--divider)] shrink-0 p-2 overflow-y-auto">
          {tab === 'channel' &&
            channels.map((ch) => (
              <button
                key={ch.id}
                type="button"
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm mb-0.5 ${
                  selectedChannel === ch.id
                    ? 'bg-blue-50 text-[var(--accent-blue)] font-medium'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedChannel(ch.id)}
              >
                # {ch.name}
              </button>
            ))}
          <div className={tab === 'channel' ? 'border-t border-[var(--divider)] my-2 pt-2' : ''}>
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm mb-0.5 ${
                  section === item.id
                    ? 'bg-blue-50 text-[var(--accent-blue)] font-medium'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setSection(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </aside>
        <main className="flex-1 p-6 overflow-y-auto min-w-0">
          <div className="bg-white rounded-xl border border-[var(--border)] p-6 shadow-sm">
            {renderMainContent()}
          </div>
        </main>
      </div>
      <InviteModal open={inviteOpen} onClose={() => setInviteOpen(false)} />
    </div>
  );
}
