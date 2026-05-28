import { create } from 'zustand';
import type {
  PanelType,
  NavSection,
  TabItem,
  UserDto,
  MessageDto,
  ScheduledMessageDto,
  EventDto,
  CanvasDocDto,
  CanvasVersionDto,
  CanvasEditSuggestionDto,
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

const scheduleTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

type StoreSet = (
  partial:
    | Partial<DemoState>
    | ((state: DemoState) => Partial<DemoState>),
) => void;

function dispatchScheduledMessage(get: () => DemoState, set: StoreSet, id: string) {
  const current = get().scheduledMessages.find((s) => s.id === id);
  if (!current) return;
  const tag = current.scheduleLabel ? `[예약: ${current.scheduleLabel}]` : '[예약]';
  get().sendMessage(
    `${tag} ${current.content}`,
    current.channelId ?? undefined,
    current.conversationId ?? undefined,
  );
  set({
    scheduledMessages: get().scheduledMessages.filter((s) => s.id !== id),
    toast: '예약 메시지가 전송되었습니다.',
  });
  setTimeout(() => set({ toast: null }), 2000);
}

function armScheduledMessage(get: () => DemoState, set: StoreSet, item: ScheduledMessageDto) {
  const prev = scheduleTimeouts.get(item.id);
  if (prev) clearTimeout(prev);

  const delay = Math.max(0, new Date(item.sendAt).getTime() - Date.now());
  if (delay === 0) {
    dispatchScheduledMessage(get, set, item.id);
    return;
  }

  const timer = setTimeout(() => {
    scheduleTimeouts.delete(item.id);
    dispatchScheduledMessage(get, set, item.id);
  }, delay);
  scheduleTimeouts.set(item.id, timer);
}

function rearmAllScheduledMessages(get: () => DemoState, set: StoreSet) {
  for (const item of get().scheduledMessages) {
    armScheduledMessage(get, set, item);
  }
}

function clearAllScheduleTimeouts() {
  for (const t of scheduleTimeouts.values()) {
    clearTimeout(t);
  }
  scheduleTimeouts.clear();
}

function matchesContext(
  item: { channelId?: string | null; conversationId?: string | null },
  channelId?: string,
  conversationId?: string,
) {
  if (channelId) return item.channelId === channelId;
  if (conversationId) return item.conversationId === conversationId;
  return false;
}

function updateMessagesInStore(
  get: () => DemoState,
  set: (partial: Partial<DemoState>) => void,
  channelId: string | undefined,
  conversationId: string | undefined,
  updater: (msgs: MessageDto[]) => MessageDto[],
) {
  if (channelId) {
    set({
      channelMessages: {
        ...get().channelMessages,
        [channelId]: updater(get().channelMessages[channelId] ?? []),
      },
    });
  } else if (conversationId) {
    set({
      dmMessages: {
        ...get().dmMessages,
        [conversationId]: updater(get().dmMessages[conversationId] ?? []),
      },
    });
  }
}

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
  scheduledMessages: ScheduledMessageDto[];
  pinnedByChannel: Record<string, string[]>;
  polls: Record<string, PollDto[]>;
  events: EventDto[];
  canvasDocs: CanvasDocDto[];
  aiSuggestion: { id: string; title: string; prompt: string } | null;
  canvasEditSuggestions: CanvasEditSuggestionDto[];
  canvasVersions: Record<string, CanvasVersionDto[]>;
  lastCanvasAppliedSuggestion: { suggestionId: string; docId: string; previousContent: string } | null;
  selectedEventId: string | null;
  subscriptionStatus: string;
  toast: string | null;
  topicSearchKeyword: string;

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
  setTopicSearchKeyword: (keyword: string) => void;

  getMembers: () => UserDto[];
  getMeetingCount: () => number;
  getMessages: (channelId?: string, conversationId?: string) => MessageDto[];
  getScheduledMessages: (channelId?: string, conversationId?: string) => ScheduledMessageDto[];
  sendMessage: (content: string, channelId?: string, conversationId?: string) => void;
  editMessage: (
    messageId: string,
    content: string,
    channelId?: string,
    conversationId?: string,
  ) => void;
  deleteMessage: (messageId: string, channelId?: string, conversationId?: string) => void;
  updateScheduledMessage: (
    id: string,
    content: string,
    sendAt?: string,
    scheduleLabel?: string,
  ) => void;
  cancelScheduledMessage: (id: string) => void;
  pinMessage: (channelId: string, messageId: string) => void;
  unpinMessage: (channelId: string, messageId: string) => void;
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
    sendAt: string,
    channelId?: string,
    conversationId?: string,
    scheduleLabel?: string,
  ) => void;
  sendQuietMessage: (content: string, channelId?: string, conversationId?: string) => void;
  updateCanvasDoc: (id: string, content: string) => void;
  updateCanvasDocMeta: (
    id: string,
    data: {
      title?: string;
      status?: CanvasDocDto['status'];
      tags?: string[];
      updatedAt?: string;
    },
  ) => void;
  moveCanvasDocStatus: (id: string, status: CanvasDocDto['status']) => void;
  deleteCanvasDoc: (id: string) => void;
  addCanvasDoc: (title?: string) => string;
  restoreCanvasVersion: (docId: string, versionId: string) => void;
  applyCanvasEditSuggestion: (suggestionId: string) => void;
  ignoreCanvasEditSuggestion: (suggestionId: string) => void;
  undoLastCanvasSuggestionApply: () => void;
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
  scheduledMessages: [],
  pinnedByChannel: { ...pinnedByChannel },
  polls: JSON.parse(JSON.stringify(initialPolls)),
  events: [...initialEvents],
  canvasDocs: [...initialCanvasDocs],
  aiSuggestion: { ...aiSuggestion },
  canvasEditSuggestions: [
    {
      id: 'edit-sug-1',
      docId: 'doc-1',
      title: 'Redis 세션 저장소 마이그레이션',
      reason: '최근 대화에서 롤백 계획과 모니터링 항목이 반복 언급되었습니다.',
      suggestedContent: `# Redis 세션 저장소 마이그레이션

## 배경
인증 v2 배포에 맞춰 세션 저장소를 인메모리에서 Redis 클러스터로 이전합니다. 현재 스테이징에서 connection pool 설정과 failover 시나리오를 검증 중입니다.

## 일정
- 5/28: 스테이징 부하 테스트
- 6/1 18:00: 읽기 전용 모드 (30분)
- 6/2 02:00: cutover

## 체크리스트
- ElastiCache 파라미터 그룹 적용
- 앱 서버 SESSION_STORE=redis 환경 변수 반영
- cutover 후 24시간 모니터링 담당: 서버팀

## 참고
인프라 다이어그램 v3.1 PR과 #백엔드 채널 스레드에 최신 타임라인이 정리되어 있습니다.

## 추가 (AI 제안)
- 롤백 runbook 링크를 체크리스트에 명시
- Redis latency/error 대시보드 알림 임계치 정의`,
    },
  ],
  canvasVersions: Object.fromEntries(
    initialCanvasDocs.map((d) => [
      d.id,
      [
        {
          id: `ver-initial-${d.id}`,
          docId: d.id,
          content: d.content,
          updatedAt: d.updatedAt,
          reason: '초기 버전',
        },
      ],
    ]),
  ),
  lastCanvasAppliedSuggestion: null,
  selectedEventId: null,
  subscriptionStatus: 'inactive',
  toast: null,
  topicSearchKeyword: '',

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
    clearAllScheduleTimeouts();
    if (typeof window !== 'undefined') sessionStorage.removeItem('demoUser');
    set({
      isLoggedIn: false,
      tabs: [],
      activeTabId: null,
      initialized: false,
      scheduledMessages: [],
    });
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
    rearmAllScheduledMessages(get, set);
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
  setPanelType: (p) =>
    set({
      panelType: p,
      mobilePanelOpen: !!p,
      topicSearchKeyword: p === 'topic' || p === null ? '' : get().topicSearchKeyword,
    }),
  setTopicSearchKeyword: (keyword) => set({ topicSearchKeyword: keyword }),
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

  getScheduledMessages: (channelId, conversationId) =>
    get().scheduledMessages.filter((s) => matchesContext(s, channelId, conversationId)),

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
      canvasVersions: {
        ...get().canvasVersions,
        [doc.id]: [
          {
            id: `ver-initial-${doc.id}`,
            docId: doc.id,
            content: doc.content,
            updatedAt: doc.updatedAt,
            reason: 'AI 생성 초안',
          },
        ],
      },
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

  scheduleMessage: (content, sendAt, channelId, conversationId, scheduleLabel) => {
    const at = new Date(sendAt);
    if (Number.isNaN(at.getTime()) || at.getTime() <= Date.now()) {
      set({ toast: '전송 시간은 현재 이후로 설정해 주세요.' });
      setTimeout(() => set({ toast: null }), 2500);
      return;
    }

    const id = `sched-${Date.now()}`;
    const label = scheduleLabel ?? '사용자 지정';
    const scheduled: ScheduledMessageDto = {
      id,
      content,
      channelId: channelId ?? null,
      conversationId: conversationId ?? null,
      scheduleLabel: label,
      sendAt: at.toISOString(),
    };

    set({
      scheduledMessages: [...get().scheduledMessages, scheduled],
      toast: '예약 메시지가 등록되었습니다.',
    });
    armScheduledMessage(get, set, scheduled);
    setTimeout(() => set({ toast: null }), 2500);
  },

  pinMessage: (channelId, messageId) => {
    const msgs = get().channelMessages[channelId] ?? [];
    if (!msgs.some((m) => m.id === messageId)) {
      set({ toast: '메시지를 찾을 수 없습니다.' });
      setTimeout(() => set({ toast: null }), 2000);
      return;
    }
    const pinned = get().pinnedByChannel[channelId] ?? [];
    if (pinned.includes(messageId)) {
      set({
        panelType: 'pinned',
        mobilePanelOpen: true,
        toast: '고정된 메시지 패널을 엽니다.',
      });
      setTimeout(() => set({ toast: null }), 2000);
      return;
    }
    set({
      pinnedByChannel: { ...get().pinnedByChannel, [channelId]: [...pinned, messageId] },
      panelType: 'pinned',
      mobilePanelOpen: true,
      toast: '메시지를 고정했습니다.',
    });
    setTimeout(() => set({ toast: null }), 2000);
  },

  unpinMessage: (channelId, messageId) => {
    const pinned = get().pinnedByChannel[channelId] ?? [];
    if (!pinned.includes(messageId)) return;
    set({
      pinnedByChannel: {
        ...get().pinnedByChannel,
        [channelId]: pinned.filter((id) => id !== messageId),
      },
      toast: '메시지 고정을 해제했습니다.',
    });
    setTimeout(() => set({ toast: null }), 2000);
  },

  editMessage: (messageId, content, channelId, conversationId) => {
    const trimmed = content.trim();
    if (!trimmed) return;
    updateMessagesInStore(get, set, channelId, conversationId, (msgs) =>
      msgs.map((m) =>
        m.id === messageId && m.authorId === CURRENT_USER_ID
          ? { ...m, content: trimmed, editedAt: new Date().toISOString() }
          : m,
      ),
    );
    set({ toast: '메시지를 수정했습니다.' });
    setTimeout(() => set({ toast: null }), 2000);
  },

  deleteMessage: (messageId, channelId, conversationId) => {
    updateMessagesInStore(get, set, channelId, conversationId, (msgs) =>
      msgs.filter((m) => !(m.id === messageId && m.authorId === CURRENT_USER_ID)),
    );
    if (channelId) {
      const pinned = get().pinnedByChannel[channelId] ?? [];
      if (pinned.includes(messageId)) {
        set({
          pinnedByChannel: {
            ...get().pinnedByChannel,
            [channelId]: pinned.filter((id) => id !== messageId),
          },
        });
      }
    }
    set({ toast: '메시지를 삭제했습니다.' });
    setTimeout(() => set({ toast: null }), 2000);
  },

  updateScheduledMessage: (id, content, sendAt, scheduleLabel) => {
    const trimmed = content.trim();
    if (!trimmed) return;
    const existing = get().scheduledMessages.find((s) => s.id === id);
    if (!existing) return;

    const nextSendAt = sendAt ? new Date(sendAt) : new Date(existing.sendAt);
    if (Number.isNaN(nextSendAt.getTime()) || nextSendAt.getTime() <= Date.now()) {
      set({ toast: '전송 시간은 현재 이후로 설정해 주세요.' });
      setTimeout(() => set({ toast: null }), 2500);
      return;
    }

    const updated: ScheduledMessageDto = {
      ...existing,
      content: trimmed,
      scheduleLabel: scheduleLabel ?? existing.scheduleLabel,
      sendAt: nextSendAt.toISOString(),
    };

    set({
      scheduledMessages: get().scheduledMessages.map((s) => (s.id === id ? updated : s)),
      toast: '예약 메시지를 수정했습니다.',
    });
    armScheduledMessage(get, set, updated);
    setTimeout(() => set({ toast: null }), 2000);
  },

  cancelScheduledMessage: (id) => {
    const timer = scheduleTimeouts.get(id);
    if (timer) clearTimeout(timer);
    scheduleTimeouts.delete(id);
    set({
      scheduledMessages: get().scheduledMessages.filter((s) => s.id !== id),
      toast: '예약 메시지를 취소했습니다.',
    });
    setTimeout(() => set({ toast: null }), 2000);
  },

  sendQuietMessage: (content, channelId, conversationId) => {
    get().sendMessage(`[조용히] ${content}`, channelId, conversationId);
    set({ toast: '조용히 메시지를 보냈습니다.' });
    setTimeout(() => set({ toast: null }), 2000);
  },

  updateCanvasDoc: (id, content) => {
    const now = new Date().toISOString().slice(0, 10);
    const current = get().canvasDocs.find((d) => d.id === id);
    if (!current || current.content === content) return;
    set({
      canvasDocs: get().canvasDocs.map((d) =>
        d.id === id ? { ...d, content, updatedAt: now } : d,
      ),
      canvasVersions: {
        ...get().canvasVersions,
        [id]: [
          ...(get().canvasVersions[id] ?? []),
          {
            id: `ver-${Date.now()}-${id}`,
            docId: id,
            content,
            updatedAt: now,
            reason: '문서 내용 수정',
          },
        ],
      },
    });
  },

  updateCanvasDocMeta: (id, data) => {
    const now = new Date().toISOString().slice(0, 10);
    const changed =
      data.title !== undefined ||
      data.status !== undefined ||
      data.tags !== undefined ||
      data.updatedAt !== undefined;
    if (!changed) return;
    const doc = get().canvasDocs.find((d) => d.id === id);
    const nextTitle =
      data.title !== undefined ? data.title.trim() || doc?.title : doc?.title;
    set({
      canvasDocs: get().canvasDocs.map((d) =>
        d.id === id
          ? {
              ...d,
              ...(data.title !== undefined && nextTitle ? { title: nextTitle } : {}),
              ...(data.status !== undefined ? { status: data.status } : {}),
              ...(data.tags !== undefined ? { tags: data.tags } : {}),
              updatedAt: data.updatedAt ?? now,
            }
          : d,
      ),
      ...(data.title !== undefined &&
        nextTitle && {
          tabs: get().tabs.map((t) =>
            t.targetId === id
              ? {
                  ...t,
                  label: nextTitle.length > 18 ? `${nextTitle.slice(0, 18)}…` : nextTitle,
                }
              : t,
          ),
        }),
    });
  },

  moveCanvasDocStatus: (id, status) => {
    get().updateCanvasDocMeta(id, { status });
  },

  deleteCanvasDoc: (id) => {
    const doc = get().canvasDocs.find((d) => d.id === id);
    if (!doc) return;
    set({
      canvasDocs: get().canvasDocs.filter((d) => d.id !== id),
      canvasEditSuggestions: get().canvasEditSuggestions.filter((s) => s.docId !== id),
      tabs: get().tabs.filter((t) => t.targetId !== id),
      activeTabId:
        get().activeTabId && get().tabs.find((t) => t.id === get().activeTabId)?.targetId === id
          ? null
          : get().activeTabId,
      toast: `"${doc.title}" 문서를 삭제했습니다.`,
    });
    setTimeout(() => set({ toast: null }), 2500);
  },

  addCanvasDoc: (title) => {
    const now = new Date().toISOString().slice(0, 10);
    const id = `doc-${Date.now()}`;
    const docTitle = title?.trim() || '새 문서';
    const doc: CanvasDocDto = {
      id,
      title: docTitle,
      content: `# ${docTitle}\n\n`,
      status: 'BEFORE_START',
      tags: [],
      isAiGenerated: false,
      updatedAt: now,
    };
    set({
      canvasDocs: [doc, ...get().canvasDocs],
      canvasVersions: {
        ...get().canvasVersions,
        [id]: [
          {
            id: `ver-initial-${id}`,
            docId: id,
            content: doc.content,
            updatedAt: now,
            reason: '문서 생성',
          },
        ],
      },
      toast: '새 문서가 생성되었습니다.',
    });
    setTimeout(() => set({ toast: null }), 2000);
    return id;
  },

  restoreCanvasVersion: (docId, versionId) => {
    const version = (get().canvasVersions[docId] ?? []).find((v) => v.id === versionId);
    if (!version) return;
    const now = new Date().toISOString().slice(0, 10);
    set({
      canvasDocs: get().canvasDocs.map((d) =>
        d.id === docId ? { ...d, content: version.content, updatedAt: now } : d,
      ),
      canvasVersions: {
        ...get().canvasVersions,
        [docId]: [
          ...(get().canvasVersions[docId] ?? []),
          {
            id: `ver-${Date.now()}-${docId}`,
            docId,
            content: version.content,
            updatedAt: now,
            reason: `버전 복원 (${version.updatedAt})`,
          },
        ],
      },
      toast: '이전 버전으로 복원했습니다.',
    });
    setTimeout(() => set({ toast: null }), 2500);
  },

  applyCanvasEditSuggestion: (suggestionId) => {
    const suggestion = get().canvasEditSuggestions.find((s) => s.id === suggestionId);
    if (!suggestion) return;
    const doc = get().canvasDocs.find((d) => d.id === suggestion.docId);
    if (!doc) return;
    const now = new Date().toISOString().slice(0, 10);
    set({
      canvasDocs: get().canvasDocs.map((d) =>
        d.id === suggestion.docId ? { ...d, content: suggestion.suggestedContent, updatedAt: now } : d,
      ),
      canvasVersions: {
        ...get().canvasVersions,
        [suggestion.docId]: [
          ...(get().canvasVersions[suggestion.docId] ?? []),
          {
            id: `ver-${Date.now()}-${suggestion.docId}`,
            docId: suggestion.docId,
            content: suggestion.suggestedContent,
            updatedAt: now,
            reason: `AI 제안 적용: ${suggestion.title}`,
          },
        ],
      },
      canvasEditSuggestions: get().canvasEditSuggestions.filter((s) => s.id !== suggestionId),
      lastCanvasAppliedSuggestion: {
        suggestionId,
        docId: suggestion.docId,
        previousContent: doc.content,
      },
      toast: 'AI 수정 제안을 적용했습니다.',
    });
    setTimeout(() => set({ toast: null }), 2500);
  },

  ignoreCanvasEditSuggestion: (suggestionId) => {
    set({
      canvasEditSuggestions: get().canvasEditSuggestions.filter((s) => s.id !== suggestionId),
      toast: 'AI 수정 제안을 무시했습니다.',
    });
    setTimeout(() => set({ toast: null }), 2000);
  },

  undoLastCanvasSuggestionApply: () => {
    const last = get().lastCanvasAppliedSuggestion;
    if (!last) return;
    const doc = get().canvasDocs.find((d) => d.id === last.docId);
    if (!doc) return;
    const now = new Date().toISOString().slice(0, 10);
    set({
      canvasDocs: get().canvasDocs.map((d) =>
        d.id === last.docId ? { ...d, content: last.previousContent, updatedAt: now } : d,
      ),
      canvasVersions: {
        ...get().canvasVersions,
        [last.docId]: [
          ...(get().canvasVersions[last.docId] ?? []),
          {
            id: `ver-${Date.now()}-${last.docId}`,
            docId: last.docId,
            content: last.previousContent,
            updatedAt: now,
            reason: 'AI 적용 취소(Undo)',
          },
        ],
      },
      lastCanvasAppliedSuggestion: null,
      toast: 'AI 적용 내용을 되돌렸습니다.',
    });
    setTimeout(() => set({ toast: null }), 2500);
  },
}));

export { workspaces, dms } from '@/lib/mock-data';
