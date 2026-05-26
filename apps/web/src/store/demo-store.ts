import { create } from 'zustand';
import type {
  PanelType,
  NavSection,
  TabItem,
  UserDto,
  MessageDto,
  EventDto,
  CanvasDocDto,
  PollDto,
  RoleDto,
} from '@/types';
import {
  users as initialUsers,
  workspaces,
  channelsByWorkspace,
  dms,
  initialChannelMessages,
  initialDmMessages,
  pinnedByChannel,
  events as initialEvents,
  canvasDocs as initialCanvasDocs,
  aiSuggestion,
  initialPolls,
  initialChannelMembers,
  initialChannelMeta,
  roles as initialRoles,
  DEFAULT_MEMBER_ROLE_ID,
  CURRENT_USER_ID,
  getUser,
} from '@/lib/mock-data';
import { permissionsFromKeys } from '@/lib/role-permissions';

let msgCounter = 100;

export const EMPTY_POLLS: PollDto[] = [];

interface DemoState {
  isLoggedIn: boolean;
  currentUser: UserDto;
  users: UserDto[];
  workspaceId: string;
  channels: { id: string; name: string }[];
  channelMembers: Record<string, string[]>;
  channelMeta: Record<string, { description?: string; topic?: string }>;
  workspaceRoles: RoleDto[];
  channelMessages: Record<string, MessageDto[]>;
  dmMessages: Record<string, MessageDto[]>;
  pinnedByChannel: Record<string, string[]>;
  polls: Record<string, PollDto[]>;
  events: EventDto[];
  canvasDocs: CanvasDocDto[];
  aiSuggestion: { id: string; title: string; prompt: string } | null;
  selectedEventId: string | null;
  subscriptionStatus: string;
  toast: string | null;

  sidebarCollapsed: boolean;
  navSection: NavSection;
  tabs: TabItem[];
  activeTabId: string | null;
  panelType: PanelType | null;
  mobileSidebarOpen: boolean;
  mobilePanelOpen: boolean;
  initialized: boolean;

  login: () => void;
  logout: () => void;
  initDemo: () => void;
  switchWorkspace: (id: string) => void;
  updateCurrentUser: (data: Partial<UserDto>) => void;
  setPresence: (presence: UserDto['presence']) => void;
  updateMemberRole: (userId: string, role: string) => void;
  removeMember: (userId: string) => void;
  addChannel: (name: string, memberIds?: string[]) => string;
  updateChannel: (
    channelId: string,
    data: { name?: string; description?: string; topic?: string },
  ) => void;
  addChannelMember: (channelId: string, userId: string) => void;
  removeChannelMember: (channelId: string, userId: string) => void;
  addEvent: (event: Omit<EventDto, 'id'> & { id?: string }) => void;
  updateEvent: (
    id: string,
    data: {
      title?: string;
      description?: string | null;
      startAt?: string;
      endAt?: string;
      color?: string;
      channelIds?: string[];
      participantIds?: string[];
    },
  ) => void;
  deleteEvent: (id: string) => void;
  toggleRolePermission: (roleId: string, permKey: string) => void;
  updateRoleName: (roleId: string, name: string) => void;
  addCustomRole: (name: string, permissionKeys: string[]) => void;
  deleteRole: (roleId: string) => void;

  setSidebarCollapsed: (v: boolean) => void;
  setNavSection: (s: NavSection) => void;
  openTab: (tab: TabItem) => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  setPanelType: (p: PanelType | null) => void;
  setMobileSidebarOpen: (v: boolean) => void;
  setMobilePanelOpen: (v: boolean) => void;
  setSelectedEvent: (id: string | null) => void;
  setToast: (msg: string | null) => void;

  getMembers: () => UserDto[];
  getMeetingCount: () => number;
  getMessages: (channelId?: string, conversationId?: string) => MessageDto[];
  sendMessage: (content: string, channelId?: string, conversationId?: string) => void;
  getPinned: (channelId: string) => MessageDto[];
  searchTopic: (channelId: string, keyword: string) => MessageDto[];
  getChannelEvents: (channelId: string) => EventDto[];
  getPolls: (channelId: string) => PollDto[];
  votePoll: (channelId: string, optionId: string) => void;
  sendInvite: () => Promise<void>;
  acceptAiSuggestion: () => void;
  dismissAiSuggestion: () => void;
  activateSubscription: () => void;
  scheduleMessage: (
    content: string,
    channelId?: string,
    conversationId?: string,
    scheduleLabel?: string,
  ) => void;
  sendQuietMessage: (content: string, channelId?: string, conversationId?: string) => void;
  updateCanvasDoc: (id: string, content: string) => void;
}

export const useDemoStore = create<DemoState>((set, get) => ({
  isLoggedIn: false,
  currentUser: getUser(CURRENT_USER_ID),
  users: [...initialUsers],
  workspaceId: workspaces[0].id,
  channels: [...(channelsByWorkspace[workspaces[0].id] ?? [])],
  channelMembers: { ...initialChannelMembers },
  channelMeta: { ...initialChannelMeta },
  workspaceRoles: JSON.parse(JSON.stringify(initialRoles)) as RoleDto[],
  channelMessages: { ...initialChannelMessages },
  dmMessages: { ...initialDmMessages },
  pinnedByChannel: { ...pinnedByChannel },
  polls: JSON.parse(JSON.stringify(initialPolls)),
  events: [...initialEvents],
  canvasDocs: [...initialCanvasDocs],
  aiSuggestion: { ...aiSuggestion },
  selectedEventId: null,
  subscriptionStatus: 'inactive',
  toast: null,

  sidebarCollapsed: false,
  navSection: 'channels',
  tabs: [],
  activeTabId: null,
  panelType: null,
  mobileSidebarOpen: false,
  mobilePanelOpen: false,
  initialized: false,

  login: () => {
    if (typeof window !== 'undefined') sessionStorage.setItem('demoUser', '1');
    set({ isLoggedIn: true });
    get().initDemo();
  },

  logout: () => {
    if (typeof window !== 'undefined') sessionStorage.removeItem('demoUser');
    set({ isLoggedIn: false, tabs: [], activeTabId: null, initialized: false });
  },

  initDemo: () => {
    if (get().initialized) return;
    const ch3 = channelsByWorkspace['ws-uxd'].find((c) => c.id === 'ch-3');
    set({
      initialized: true,
      tabs: ch3
        ? [{ id: 'channel-ch-3', type: 'channel', label: ch3.name, targetId: ch3.id }]
        : [],
      activeTabId: ch3 ? 'channel-ch-3' : null,
    });
  },

  switchWorkspace: (id) => {
    const wsChannels = channelsByWorkspace[id] ?? [];
    set({
      workspaceId: id,
      channels: [...wsChannels],
      channelMembers: {
        ...initialChannelMembers,
        ...Object.fromEntries(
          wsChannels
            .filter((c) => !initialChannelMembers[c.id])
            .map((c) => [c.id, [CURRENT_USER_ID]]),
        ),
      },
    });
  },

  updateCurrentUser: (data) => {
    const currentUser = { ...get().currentUser, ...data };
    const users = get().users.map((u) =>
      u.id === CURRENT_USER_ID ? { ...u, ...data } : u,
    );
    set({ currentUser, users });
  },

  setPresence: (presence) => {
    get().updateCurrentUser({ presence });
  },

  updateMemberRole: (userId, role) => {
    const users = get().users.map((u) => (u.id === userId ? { ...u, role } : u));
    const patch: Partial<DemoState> = { users };
    if (userId === CURRENT_USER_ID) {
      patch.currentUser = users.find((u) => u.id === CURRENT_USER_ID) ?? get().currentUser;
    }
    set(patch);
  },

  removeMember: (userId) => {
    if (userId === CURRENT_USER_ID) {
      set({ toast: '본인은 워크스페이스에서 제거할 수 없습니다.' });
      setTimeout(() => set({ toast: null }), 2500);
      return;
    }
    const removed = get().users.find((u) => u.id === userId);
    if (!removed) return;
    set({
      users: get().users.filter((u) => u.id !== userId),
      toast: `${removed.name}님을 워크스페이스에서 제거했습니다.`,
    });
    setTimeout(() => set({ toast: null }), 2500);
  },

  addChannel: (name, memberIds) => {
    const trimmed = name.trim();
    if (!trimmed) return '';
    const id = `ch-${Date.now()}`;
    const members =
      memberIds && memberIds.length > 0
        ? [...new Set([CURRENT_USER_ID, ...memberIds])]
        : [CURRENT_USER_ID];
    set({
      channels: [...get().channels, { id, name: trimmed }],
      channelMembers: {
        ...get().channelMembers,
        [id]: members,
      },
      channelMeta: {
        ...get().channelMeta,
        [id]: { description: '', topic: '' },
      },
      channelMessages: { ...get().channelMessages, [id]: [] },
      toast: `#${trimmed} 채널이 생성되었습니다.`,
    });
    setTimeout(() => set({ toast: null }), 2500);
    return id;
  },

  updateChannel: (channelId, data) => {
    const channels = get().channels.map((c) =>
      c.id === channelId && data.name ? { ...c, name: data.name } : c,
    );
    const meta = { ...(get().channelMeta[channelId] ?? {}) };
    if (data.description !== undefined) meta.description = data.description;
    if (data.topic !== undefined) meta.topic = data.topic;
    set({
      channels,
      channelMeta: { ...get().channelMeta, [channelId]: meta },
      tabs: get().tabs.map((t) =>
        t.targetId === channelId && data.name ? { ...t, label: data.name } : t,
      ),
      toast: '채널 설정이 저장되었습니다.',
    });
    setTimeout(() => set({ toast: null }), 2000);
  },

  addChannelMember: (channelId, userId) => {
    const ids = get().channelMembers[channelId] ?? [];
    if (ids.includes(userId)) return;
    set({
      channelMembers: {
        ...get().channelMembers,
        [channelId]: [...ids, userId],
      },
      toast: '채널에 멤버가 추가되었습니다.',
    });
    setTimeout(() => set({ toast: null }), 2000);
  },

  removeChannelMember: (channelId, userId) => {
    if (userId === CURRENT_USER_ID) {
      set({ toast: '본인은 채널에서 제거할 수 없습니다.' });
      setTimeout(() => set({ toast: null }), 2500);
      return;
    }
    set({
      channelMembers: {
        ...get().channelMembers,
        [channelId]: (get().channelMembers[channelId] ?? []).filter((id) => id !== userId),
      },
      toast: '채널에서 멤버를 제거했습니다.',
    });
    setTimeout(() => set({ toast: null }), 2000);
  },

  addEvent: (event) => {
    const id = event.id ?? `ev-${Date.now()}`;
    const newEvent: EventDto = { ...event, id };
    set({
      events: [...get().events, newEvent],
      toast: '일정이 추가되었습니다.',
    });
    setTimeout(() => set({ toast: null }), 2000);
  },

  updateEvent: (id, data) => {
    const users = get().users;
    set({
      events: get().events.map((e) => {
        if (e.id !== id) return e;
        const participants = data.participantIds
          ? data.participantIds
              .map((uid) => users.find((u) => u.id === uid))
              .filter((u): u is UserDto => !!u)
          : e.participants;
        return {
          ...e,
          ...(data.title !== undefined && { title: data.title }),
          ...(data.description !== undefined && { description: data.description }),
          ...(data.startAt !== undefined && { startAt: data.startAt }),
          ...(data.endAt !== undefined && { endAt: data.endAt }),
          ...(data.color !== undefined && { color: data.color }),
          ...(data.channelIds !== undefined && { channelIds: data.channelIds }),
          participants,
        };
      }),
      toast: '일정이 저장되었습니다.',
    });
    setTimeout(() => set({ toast: null }), 2000);
  },

  deleteEvent: (id) => {
    const wasSelected = get().selectedEventId === id;
    set({
      events: get().events.filter((e) => e.id !== id),
      ...(wasSelected && {
        selectedEventId: null,
        panelType: null,
        mobilePanelOpen: false,
      }),
      toast: '일정이 삭제되었습니다.',
    });
    setTimeout(() => set({ toast: null }), 2000);
  },

  toggleRolePermission: (roleId, permKey) => {
    set({
      workspaceRoles: get().workspaceRoles.map((r) => {
        if (r.id !== roleId) return r;
        const has = r.permissions.some((p) => p.key === permKey);
        return {
          ...r,
          permissions: has
            ? r.permissions.filter((p) => p.key !== permKey)
            : [
                ...r.permissions,
                {
                  key: permKey,
                  label:
                    {
                      'message:send': '메시지 전송',
                      'message:delete': '메시지 삭제',
                      'member:invite': '멤버 초대',
                      'analytics:view': '분석 보기',
                      'settings:manage': '설정 관리',
                    }[permKey] ?? permKey,
                },
              ],
        };
      }),
    });
  },

  updateRoleName: (roleId, name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const role = get().workspaceRoles.find((r) => r.id === roleId);
    if (role?.isSystem) return;
    set({
      workspaceRoles: get().workspaceRoles.map((r) =>
        r.id === roleId ? { ...r, name: trimmed } : r,
      ),
      toast: '역할 이름이 저장되었습니다.',
    });
    setTimeout(() => set({ toast: null }), 2000);
  },

  addCustomRole: (name, permissionKeys) => {
    const trimmed = name.trim();
    if (!trimmed) {
      set({ toast: '역할 이름을 입력하세요.' });
      setTimeout(() => set({ toast: null }), 2000);
      return;
    }
    if (permissionKeys.length === 0) {
      set({ toast: '권한을 하나 이상 선택하세요.' });
      setTimeout(() => set({ toast: null }), 2000);
      return;
    }
    set({
      workspaceRoles: [
        ...get().workspaceRoles,
        {
          id: `role-${Date.now()}`,
          name: trimmed,
          description: '맞춤 역할',
          permissions: permissionsFromKeys(permissionKeys),
        },
      ],
      toast: `역할 "${trimmed}"이(가) 추가되었습니다.`,
    });
    setTimeout(() => set({ toast: null }), 2000);
  },

  deleteRole: (roleId) => {
    const role = get().workspaceRoles.find((r) => r.id === roleId);
    if (!role || role.isSystem) return;
    const users = get().users.map((u) =>
      u.role === roleId ? { ...u, role: DEFAULT_MEMBER_ROLE_ID } : u,
    );
    set({
      workspaceRoles: get().workspaceRoles.filter((r) => r.id !== roleId),
      users,
      currentUser: users.find((u) => u.id === CURRENT_USER_ID) ?? get().currentUser,
      toast: `역할 "${role.name}"이(가) 삭제되었습니다. 해당 멤버는 멤버 역할로 변경됩니다.`,
    });
    setTimeout(() => set({ toast: null }), 3000);
  },

  setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
  setNavSection: (s) => set({ navSection: s }),
  openTab: (tab) => {
    const tabs = get().tabs;
    const exists = tabs.find((t) => t.id === tab.id);
    if (!exists) set({ tabs: [...tabs, tab], activeTabId: tab.id });
    else set({ activeTabId: tab.id });
  },
  closeTab: (id) => {
    const tabs = get().tabs.filter((t) => t.id !== id);
    const activeTabId =
      get().activeTabId === id ? (tabs[tabs.length - 1]?.id ?? null) : get().activeTabId;
    set({ tabs, activeTabId });
  },
  setActiveTab: (id) => set({ activeTabId: id }),
  setPanelType: (p) => set({ panelType: p, mobilePanelOpen: !!p }),
  setMobileSidebarOpen: (v) => set({ mobileSidebarOpen: v }),
  setMobilePanelOpen: (v) => set({ mobilePanelOpen: v }),
  setSelectedEvent: (id) =>
    set({ selectedEventId: id, panelType: id ? 'event' : null, mobilePanelOpen: !!id }),
  setToast: (msg) => set({ toast: msg }),

  getMembers: () => get().users,
  getMeetingCount: () => get().users.filter((u) => u.presence === 'IN_MEETING').length,

  getMessages: (channelId, conversationId) => {
    if (channelId) return get().channelMessages[channelId] ?? [];
    if (conversationId) return get().dmMessages[conversationId] ?? [];
    return [];
  },

  sendMessage: (content, channelId, conversationId) => {
    const me = get().currentUser;
    const msg: MessageDto = {
      id: `msg-${++msgCounter}`,
      content,
      authorId: me.id,
      author: me,
      channelId: channelId ?? null,
      conversationId: conversationId ?? null,
      createdAt: new Date().toISOString(),
    };
    if (channelId) {
      set({
        channelMessages: {
          ...get().channelMessages,
          [channelId]: [...(get().channelMessages[channelId] ?? []), msg],
        },
      });
    } else if (conversationId) {
      set({
        dmMessages: {
          ...get().dmMessages,
          [conversationId]: [...(get().dmMessages[conversationId] ?? []), msg],
        },
      });
    }
  },

  getPinned: (channelId) => {
    const ids = get().pinnedByChannel[channelId] ?? [];
    const msgs = get().channelMessages[channelId] ?? [];
    return msgs.filter((m) => ids.includes(m.id));
  },

  searchTopic: (channelId, keyword) => {
    const msgs = get().channelMessages[channelId] ?? [];
    return msgs.filter((m) => m.content.includes(keyword));
  },

  getChannelEvents: (channelId) =>
    get().events.filter((e) => e.channelIds.includes(channelId)),

  getPolls: (channelId) => get().polls[channelId] ?? EMPTY_POLLS,

  votePoll: (channelId, optionId) => {
    const polls = get().polls[channelId];
    if (!polls) return;
    set({
      polls: {
        ...get().polls,
        [channelId]: polls.map((p) => ({
          ...p,
          options: p.options.map((o) =>
            o.id === optionId ? { ...o, voteCount: o.voteCount + 1 } : o,
          ),
        })),
      },
    });
  },

  sendInvite: async () => {
    await new Promise((r) => setTimeout(r, 600));
    set({ toast: '초대 메일을 보냈습니다.' });
    setTimeout(() => set({ toast: null }), 3000);
  },

  acceptAiSuggestion: () => {
    const sug = get().aiSuggestion;
    if (!sug) return;
    const doc: CanvasDocDto = {
      id: `doc-${Date.now()}`,
      title: sug.title,
      content: `# ${sug.title}\n\n## AI Generated Draft\n\n${sug.prompt}\n\n---\n자동 생성된 회의록 초안입니다.`,
      status: 'BEFORE_START',
      tags: ['AI', 'Meeting Minutes'],
      isAiGenerated: true,
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    set({
      canvasDocs: [doc, ...get().canvasDocs],
      aiSuggestion: null,
      toast: 'Canvas 문서가 생성되었습니다.',
    });
    setTimeout(() => set({ toast: null }), 2500);
  },

  dismissAiSuggestion: () => set({ aiSuggestion: null }),

  activateSubscription: () => {
    set({ subscriptionStatus: 'active', toast: '데모: 구독이 활성화되었습니다.' });
    setTimeout(() => set({ toast: null }), 2500);
  },

  scheduleMessage: (content, channelId, conversationId, scheduleLabel) => {
    const tag = scheduleLabel ? `[예약: ${scheduleLabel}]` : '[예약]';
    set({ toast: '예약 발송이 등록되었습니다. (3초 후 전송)' });
    setTimeout(() => {
      get().sendMessage(`${tag} ${content}`, channelId, conversationId);
      set({ toast: '예약 메시지가 전송되었습니다.' });
      setTimeout(() => set({ toast: null }), 2000);
    }, 3000);
  },

  sendQuietMessage: (content, channelId, conversationId) => {
    get().sendMessage(`[조용히] ${content}`, channelId, conversationId);
    set({ toast: '조용히 메시지를 보냈습니다.' });
    setTimeout(() => set({ toast: null }), 2000);
  },

  updateCanvasDoc: (id, content) => {
    set({
      canvasDocs: get().canvasDocs.map((d) =>
        d.id === id ? { ...d, content, updatedAt: new Date().toISOString().slice(0, 10) } : d,
      ),
    });
  },
}));

export { workspaces, dms } from '@/lib/mock-data';
