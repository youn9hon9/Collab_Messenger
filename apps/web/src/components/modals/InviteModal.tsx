'use client';

import { useState } from 'react';
import { X, Mail } from 'lucide-react';
import { useDemoStore } from '@/store/demo-store';

export function InviteModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { channels, sendInvite } = useDemoStore();
  const [email, setEmail] = useState('colleague@acme.com');
  const [selected, setSelected] = useState<Record<string, 'MEMBER' | 'VIEWER'>>({
    'ch-1': 'MEMBER',
    'ch-3': 'MEMBER',
  });
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = 'MEMBER';
      return next;
    });
  };

  const submit = async () => {
    setLoading(true);
    await sendInvite();
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-[var(--border)]">
        <div className="flex justify-between items-start p-5 border-b border-[var(--border)]">
          <div>
            <h2 className="font-bold text-lg">워크스페이스에 초대</h2>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              새 멤버를 위한 채널 선택 및 권한 설정
            </p>
          </div>
          <button type="button" onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-sm font-semibold">이메일 주소</label>
            <div className="flex items-center border border-[var(--border)] rounded-xl mt-1.5 px-3 bg-gray-50/50">
              <Mail size={16} className="text-gray-400 shrink-0" />
              <input
                type="email"
                className="flex-1 py-2.5 px-2 outline-none text-sm bg-transparent"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold">채널 선택 및 역할 설정</label>
            <div className="mt-2 space-y-2 max-h-48 overflow-y-auto border border-[var(--border)] rounded-xl p-2">
              {channels.map((ch) => (
                <div key={ch.id} className="flex items-center gap-2 py-1 px-1">
                  <input
                    type="checkbox"
                    checked={!!selected[ch.id]}
                    onChange={() => toggle(ch.id)}
                    className="rounded"
                  />
                  <span className="flex-1 text-sm"># {ch.name}</span>
                  {selected[ch.id] && (
                    <select
                      className="text-sm border border-[var(--border)] rounded-lg px-2 py-1"
                      value={selected[ch.id]}
                      onChange={(e) =>
                        setSelected((prev) => ({
                          ...prev,
                          [ch.id]: e.target.value as 'MEMBER' | 'VIEWER',
                        }))
                      }
                    >
                      <option value="MEMBER">멤버</option>
                      <option value="VIEWER">뷰어</option>
                    </select>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-2 p-5 border-t border-[var(--border)]">
          <button
            type="button"
            className="flex-1 border border-[var(--border)] rounded-xl py-2.5 text-sm font-medium"
            onClick={onClose}
          >
            취소
          </button>
          <button
            type="button"
            className="flex-1 bg-[#a8b4f0] text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-[#95a3eb] disabled:opacity-60"
            onClick={submit}
            disabled={loading}
          >
            {loading ? '전송 중…' : '초대 보내기'}
          </button>
        </div>
      </div>
    </div>
  );
}
