export type PresenceStatus = 'ONLINE' | 'AWAY' | 'IN_MEETING' | 'OFFLINE';
export type PanelType = 'members' | 'pinned' | 'schedule' | 'event' | 'topic';
export type NavSection = 'channels' | 'dms' | 'canvas' | 'schedule';

export interface UserDto {
  id: string;
  email: string;
  name: string;
  team?: string | null;
  presence: PresenceStatus;
  role?: string;
}

export interface MessageDto {
  id: string;
  content: string;
  authorId: string;
  author: UserDto;
  channelId?: string | null;
  conversationId?: string | null;
  createdAt: string;
}

export interface EventDto {
  id: string;
  title: string;
  description?: string | null;
  startAt: string;
  endAt: string;
  color: string;
  participants: UserDto[];
  channelIds: string[];
}

export interface CanvasDocDto {
  id: string;
  title: string;
  content: string;
  status: 'BEFORE_START' | 'IN_PROGRESS' | 'COMPLETED';
  tags: string[];
  isAiGenerated: boolean;
  updatedAt: string;
}

export interface PollDto {
  id: string;
  question: string;
  isClosed: boolean;
  options: { id: string; text: string; voteCount: number }[];
}

export interface RoleDto {
  id: string;
  name: string;
  description?: string;
  permissions: { key: string; label: string }[];
}

export type TabItem = {
  id: string;
  type: 'channel' | 'dm' | 'canvas' | 'schedule';
  label: string;
  targetId?: string;
};
