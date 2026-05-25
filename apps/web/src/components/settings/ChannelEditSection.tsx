'use client';

import { useState, useEffect } from 'react';
import { useDemoStore } from '@/store/demo-store';

export function ChannelEditSection({ channelId }: { channelId: string }) {
  const { channels, channelMeta, updateChannel } = useDemoStore();
  const channel = channels.find((c) => c.id === channelId);
  const meta = channelMeta[channelId] ?? {};

  const [name, setName] = useState(channel?.name ?? '');
  const [description, setDescription] = useState(meta.description ?? '');
  const [topic, setTopic] = useState(meta.topic ?? '');

  useEffect(() => {
    setName(channel?.name ?? '');
    setDescription(meta.description ?? '');
    setTopic(meta.topic ?? '');
  }, [channelId, channel?.name, meta.description, meta.topic]);

  if (!channel) return null;

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">채널 편집</h2>
      <div className="space-y-4 max-w-lg">
        <label className="block text-sm">
          <span className="font-medium mb-1 block">채널 이름</span>
          <input
            className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium mb-1 block">설명</span>
          <textarea
            className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 min-h-[80px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium mb-1 block">주제 (topic)</span>
          <input
            className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="backend"
          />
        </label>
        <button
          type="button"
          className="bg-[var(--primary)] text-white px-5 py-2.5 rounded-xl text-sm font-medium"
          onClick={() => updateChannel(channelId, { name, description, topic })}
        >
          저장
        </button>
      </div>
    </div>
  );
}
