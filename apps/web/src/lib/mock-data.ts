import type {
  UserDto,
  MessageDto,
  EventDto,
  CanvasDocDto,
  PollDto,
  RoleDto,
} from '@/types';

export const CURRENT_USER_ID = 'user-me';

export const DEFAULT_MEMBER_ROLE_ID = 'role-2';

export const users: UserDto[] = [
  { id: 'user-me', email: 'me@uxd.team', name: '나', team: '운영팀', presence: 'ONLINE', role: 'role-1' },
  { id: 'user-kim', email: 'kim@uxd.team', name: '김도현', team: '서버팀', presence: 'IN_MEETING', role: 'role-1' },
  { id: 'user-lee', email: 'lee@uxd.team', name: '이나영', team: '서버팀', presence: 'ONLINE', role: DEFAULT_MEMBER_ROLE_ID },
  { id: 'user-hwang', email: 'hwang@uxd.team', name: '황성민', team: '디자인팀', presence: 'AWAY', role: DEFAULT_MEMBER_ROLE_ID },
  { id: 'user-park', email: 'park@uxd.team', name: '박정한', team: '개발팀', presence: 'ONLINE', role: 'role-3' },
];

export const workspaces = [
  { id: 'ws-uxd', name: 'UXD Team 2', slug: 'uxd-team-2' },
  { id: 'ws-design', name: 'Design Lab', slug: 'design-lab' },
];

export const channelsByWorkspace: Record<string, { id: string; name: string }[]> = {
  'ws-uxd': [
    { id: 'ch-1', name: '공지' },
    { id: 'ch-2', name: '엔지니어링' },
    { id: 'ch-3', name: '백엔드' },
    { id: 'ch-4', name: '디자인-핸드오프' },
    { id: 'ch-5', name: '릴리즈' },
  ],
  'ws-design': [
    { id: 'ch-d1', name: '디자인 리뷰' },
    { id: 'ch-d2', name: 'UI 피드백' },
  ],
};

export const initialChannelMembers: Record<string, string[]> = {
  'ch-1': ['user-me', 'user-kim', 'user-lee'],
  'ch-2': ['user-me', 'user-kim', 'user-lee', 'user-park'],
  'ch-3': ['user-me', 'user-kim', 'user-lee', 'user-hwang'],
  'ch-4': ['user-me', 'user-hwang', 'user-park'],
  'ch-5': ['user-me', 'user-kim', 'user-lee', 'user-park'],
  'ch-d1': ['user-me', 'user-hwang'],
  'ch-d2': ['user-me', 'user-hwang', 'user-park'],
};

export const initialChannelMeta: Record<
  string,
  { description?: string; topic?: string }
> = {
  'ch-1': { description: '팀 전체 공지사항', topic: 'announcements' },
  'ch-2': { description: '엔지니어링 논의', topic: 'engineering' },
  'ch-3': {
    description: '백엔드 인프라·API 논의',
    topic: 'backend',
  },
  'ch-4': { description: '디자인 핸드오프 및 리뷰', topic: 'design' },
  'ch-5': { description: '릴리즈 일정 및 배포', topic: 'releases' },
};

export const dms = [
  {
    id: 'dm-hwang',
    otherUser: users.find((u) => u.id === 'user-hwang')!,
  },
  {
    id: 'dm-kim',
    otherUser: users.find((u) => u.id === 'user-kim')!,
  },
  {
    id: 'dm-lee',
    otherUser: users.find((u) => u.id === 'user-lee')!,
  },
  {
    id: 'dm-park',
    otherUser: users.find((u) => u.id === 'user-park')!,
  },
];

export const demoLocaleSettings = {
  language: 'ko',
  languageLabel: '한국어',
  region: 'KR',
  regionLabel: '대한민국',
  timezone: 'Asia/Seoul',
  timezoneLabel: '(UTC+09:00) 서울',
  dateFormat: 'YYYY-MM-DD',
  timeFormat: '24h',
};

export const dangerZoneActions = [
  {
    id: 'export',
    label: '워크스페이스 데이터보내기',
    description: '채널, 메시지, 파일 메타데이터를 JSON으로 다운로드합니다.',
    variant: 'default' as const,
  },
  {
    id: 'leave',
    label: '워크스페이스 나가기',
    description: '이 워크스페이스에서 본인을 제거합니다. 소유주는 나갈 수 없습니다.',
    variant: 'default' as const,
  },
  {
    id: 'delete',
    label: '워크스페이스 삭제',
    description: '모든 채널과 데이터가 영구 삭제됩니다. 되돌릴 수 없습니다.',
    variant: 'danger' as const,
  },
];

const u = (id: string) => users.find((x) => x.id === id)!;

export const initialChannelMessages: Record<string, MessageDto[]> = {
  'ch-1': [
    {
      id: 'ch1-msg-1',
      content: '이번 주 **전체 회의**는 목요일 15시입니다. 필수 참석 부탁드려요.',
      authorId: 'user-kim',
      author: u('user-kim'),
      channelId: 'ch-1',
      createdAt: '2026-05-25T09:00:00',
    },
    {
      id: 'ch1-msg-2',
      content: '캘린더에 일정 반영했습니다.',
      authorId: 'user-me',
      author: u('user-me'),
      channelId: 'ch-1',
      createdAt: '2026-05-25T09:05:00',
    },
  ],
  'ch-2': [
    {
      id: 'ch2-msg-1',
      content: '엔지니어링 위클리 아젠다 올려뒀어요. 코멘트 부탁해요.',
      authorId: 'user-lee',
      author: u('user-lee'),
      channelId: 'ch-2',
      createdAt: '2026-05-26T08:00:00',
    },
    {
      id: 'ch2-msg-2',
      content: 'CI 파이프라인 개선 항목도 추가할게요.',
      authorId: 'user-park',
      author: u('user-park'),
      channelId: 'ch-2',
      createdAt: '2026-05-26T08:12:00',
    },
    {
      id: 'ch2-msg-3',
      content: '네, 오전 중에 리뷰하겠습니다.',
      authorId: 'user-me',
      author: u('user-me'),
      channelId: 'ch-2',
      createdAt: '2026-05-26T08:20:00',
    },
  ],
  'ch-3': [
    {
      id: 'msg-1',
      content: '새로운 인증 플로우가 스테이징에 **배포**되었어요. 우리가 논의했던 엣지 케이스들을 QA 해주실 수 있나요?',
      authorId: 'user-lee',
      author: u('user-lee'),
      channelId: 'ch-3',
      createdAt: '2026-05-26T10:20:00',
    },
    {
      id: 'msg-2',
      content: '네, 오늘 오후에 OAuth 리다이렉트 플로우랑 세션 타임아웃 케이스부터 확인할게요.',
      authorId: 'user-me',
      author: u('user-me'),
      channelId: 'ch-3',
      createdAt: '2026-05-26T10:22:00',
    },
    {
      id: 'msg-3',
      content: 'v2 릴리스 전에 API rate limit 설정도 같이 업데이트해야 할 것 같아요.',
      authorId: 'user-lee',
      author: u('user-lee'),
      channelId: 'ch-3',
      createdAt: '2026-05-26T10:25:00',
    },
    {
      id: 'msg-4',
      content: '세션 저장소는 Redis로 가기로 했어요. 메모리 이슈 해결될 거예요.',
      authorId: 'user-kim',
      author: u('user-kim'),
      channelId: 'ch-3',
      createdAt: '2026-05-26T10:28:00',
    },
    {
      id: 'msg-5',
      content: '인프라 다이어그램도 Redis 반영해서 업데이트할게요.',
      authorId: 'user-me',
      author: u('user-me'),
      channelId: 'ch-3',
      createdAt: '2026-05-26T10:30:00',
    },
  ],
  'ch-4': [
    {
      id: 'ch4-msg-1',
      content: '핸드오프 시안 Figma 링크 공유드립니다. **모바일 네비** 피드백 부탁해요.',
      authorId: 'user-hwang',
      author: u('user-hwang'),
      channelId: 'ch-4',
      createdAt: '2026-05-26T11:00:00',
    },
    {
      id: 'ch4-msg-2',
      content: '오후에 코멘트 남길게요.',
      authorId: 'user-me',
      author: u('user-me'),
      channelId: 'ch-4',
      createdAt: '2026-05-26T11:15:00',
    },
  ],
  'ch-5': [
    {
      id: 'ch5-msg-1',
      content: 'v2.4.0 **릴리스 노트** 초안 올렸습니다. 검토 부탁드려요.',
      authorId: 'user-park',
      author: u('user-park'),
      channelId: 'ch-5',
      createdAt: '2026-05-26T07:30:00',
    },
    {
      id: 'ch5-msg-2',
      content: '배포 창은 금요일 새벽 2시로 잡았어요.',
      authorId: 'user-lee',
      author: u('user-lee'),
      channelId: 'ch-5',
      createdAt: '2026-05-26T07:45:00',
    },
    {
      id: 'ch5-msg-3',
      content: '롤백 플랜도 문서에 링크해뒀습니다.',
      authorId: 'user-me',
      author: u('user-me'),
      channelId: 'ch-5',
      createdAt: '2026-05-26T08:00:00',
    },
  ],
  'ch-d1': [
    {
      id: 'chd1-msg-1',
      content: '디자인 리뷰 보드에 이번 스프린트 항목 추가했어요.',
      authorId: 'user-hwang',
      author: u('user-hwang'),
      channelId: 'ch-d1',
      createdAt: '2026-05-25T14:00:00',
    },
    {
      id: 'chd1-msg-2',
      content: '확인했습니다. 내일 오전에 코멘트 달게요.',
      authorId: 'user-me',
      author: u('user-me'),
      channelId: 'ch-d1',
      createdAt: '2026-05-25T14:20:00',
    },
  ],
  'ch-d2': [
    {
      id: 'chd2-msg-1',
      content: 'UI 피드백: 버튼 터치 영역을 44px 이상으로 맞춰주실 수 있을까요?',
      authorId: 'user-park',
      author: u('user-park'),
      channelId: 'ch-d2',
      createdAt: '2026-05-26T09:30:00',
    },
    {
      id: 'chd2-msg-2',
      content: '네, 컴포넌트 토큰에 반영하겠습니다.',
      authorId: 'user-hwang',
      author: u('user-hwang'),
      channelId: 'ch-d2',
      createdAt: '2026-05-26T09:45:00',
    },
  ],
};

export const initialDmMessages: Record<string, MessageDto[]> = {
  'dm-hwang': [
    {
      id: 'dm-1',
      content: '디자인 시안 리뷰 가능하세요?',
      authorId: 'user-hwang',
      author: u('user-hwang'),
      conversationId: 'dm-hwang',
      createdAt: '2026-05-26T09:00:00',
    },
    {
      id: 'dm-2',
      content: '네, 오후 3시 이후에 볼게요.',
      authorId: 'user-me',
      author: u('user-me'),
      conversationId: 'dm-hwang',
      createdAt: '2026-05-26T09:05:00',
    },
  ],
  'dm-kim': [
    {
      id: 'dm-kim-1',
      content: 'Redis 마이그레이션 일정 공유드릴게요.',
      authorId: 'user-kim',
      author: u('user-kim'),
      conversationId: 'dm-kim',
      createdAt: '2026-05-26T08:30:00',
    },
    {
      id: 'dm-kim-2',
      content: '감사합니다. 스테이징 검증 후 알려드릴게요.',
      authorId: 'user-me',
      author: u('user-me'),
      conversationId: 'dm-kim',
      createdAt: '2026-05-26T08:35:00',
    },
  ],
  'dm-lee': [
    {
      id: 'dm-lee-1',
      content: 'OAuth 리다이렉트 테스트 케이스 정리해뒀어요.',
      authorId: 'user-lee',
      author: u('user-lee'),
      conversationId: 'dm-lee',
      createdAt: '2026-05-26T08:00:00',
    },
    {
      id: 'dm-lee-2',
      content: '확인했어요. 오후에 같이 볼게요.',
      authorId: 'user-me',
      author: u('user-me'),
      conversationId: 'dm-lee',
      createdAt: '2026-05-26T08:10:00',
    },
  ],
  'dm-park': [
    {
      id: 'dm-park-1',
      content: '게스트 권한으로 채널 접근 테스트 중이에요.',
      authorId: 'user-park',
      author: u('user-park'),
      conversationId: 'dm-park',
      createdAt: '2026-05-25T17:00:00',
    },
  ],
};

export const pinnedByChannel: Record<string, string[]> = {
  'ch-3': ['msg-1'],
};

export const events: EventDto[] = [
  {
    id: 'ev-1',
    title: 'Sprint Plan',
    startAt: '2026-05-04T09:00:00',
    endAt: '2026-05-04T10:00:00',
    color: '#7B68EE',
    participants: [u('user-me')],
    channelIds: ['ch-3'],
  },
  {
    id: 'ev-2',
    title: 'Architecture Review',
    startAt: '2026-05-04T14:00:00',
    endAt: '2026-05-04T15:30:00',
    color: '#20B2AA',
    participants: [u('user-kim'), u('user-lee')],
    channelIds: [],
  },
  {
    id: 'ev-3',
    title: 'Design System Workshop',
    startAt: '2026-05-06T13:00:00',
    endAt: '2026-05-06T16:00:00',
    color: '#FF6B6B',
    participants: [u('user-hwang')],
    channelIds: [],
  },
  {
    id: 'ev-4',
    title: 'Conference: DevOps Summit',
    startAt: '2026-05-16T00:00:00',
    endAt: '2026-05-18T23:59:00',
    color: '#FFA500',
    participants: [],
    channelIds: [],
  },
  {
    id: 'ev-5',
    title: '모바일 앱 킥오프',
    description: '모바일 앱 프로젝트 킥오프 미팅',
    startAt: '2026-05-20T10:00:00',
    endAt: '2026-05-20T11:30:00',
    color: '#4A90E2',
    participants: [u('user-kim'), u('user-lee')],
    channelIds: ['ch-3'],
  },
];

export const canvasDocs: CanvasDocDto[] = [
  {
    id: 'doc-1',
    title: 'Redis 세션 저장소 마이그레이션',
    content: '# Redis Session Storage Migration\n\n## Summary\nMigrate session store from in-memory to Redis.\n\n## Next Steps\n- Update connection config\n- Deploy to staging',
    status: 'BEFORE_START',
    tags: ['Backend'],
    isAiGenerated: false,
    updatedAt: '2026-05-25',
  },
  {
    id: 'doc-2',
    title: 'API Rate Limiting Strategy',
    content: '# API Rate Limiting\n\nDefine rate limits before v2 release.',
    status: 'BEFORE_START',
    tags: ['Backend'],
    isAiGenerated: false,
    updatedAt: '2026-05-25',
  },
  {
    id: 'doc-3',
    title: 'Production Database Alert - RESOLVED',
    content: '# Production Database Alert - RESOLVED\n\n## Incident Summary\nConnection pool exhaustion.\n\n## Root Cause\nMissing query timeout.\n\n## Resolution\nAdded 30s timeout, increased pool size.\n\n## Prevention\nAdd monitoring alerts.',
    status: 'IN_PROGRESS',
    tags: ['Database'],
    isAiGenerated: false,
    updatedAt: '2026-05-21',
  },
  {
    id: 'doc-4',
    title: 'Town Hall Meeting Prep',
    content: '# Town Hall Prep\n\nAI-generated meeting minutes draft.',
    status: 'BEFORE_START',
    tags: ['Meeting Minutes'],
    isAiGenerated: true,
    updatedAt: '2026-05-24',
  },
];

export const aiSuggestion = {
  id: 'sug-1',
  title: '점심 메뉴 논의',
  prompt: '5월 26일 오후 3-4시 점심 메뉴 논의가 감지되었습니다.',
};

export const initialPolls: Record<string, PollDto[]> = {
  'ch-3': [
    {
      id: 'poll-1',
      question: 'Redis 마이그레이션 일정을 언제 진행할까요?',
      isClosed: false,
      options: [
        { id: 'opt-1', text: '이번 주', voteCount: 2 },
        { id: 'opt-2', text: '다음 스프린트', voteCount: 1 },
        { id: 'opt-3', text: '보류', voteCount: 0 },
      ],
    },
  ],
};

export const roles: RoleDto[] = [
  {
    id: 'role-1',
    name: '관리자',
    description: '모든 기능에 대한 전체 접근 권한',
    permissions: [
      { key: 'message:send', label: '메시지 전송' },
      { key: 'message:delete', label: '메시지 삭제' },
      { key: 'member:invite', label: '멤버 초대' },
      { key: 'analytics:view', label: '분석 보기' },
      { key: 'settings:manage', label: '설정 관리' },
    ],
  },
  {
    id: 'role-2',
    name: '멤버',
    description: '표준 팀 멤버 접근 권한 (기본 역할)',
    isSystem: true,
    permissions: [
      { key: 'message:send', label: '메시지 전송' },
      { key: 'member:invite', label: '멤버 초대' },
      { key: 'analytics:view', label: '분석 보기' },
    ],
  },
  {
    id: 'role-3',
    name: '게스트',
    description: '제한된 게스트 접근 권한',
    permissions: [{ key: 'message:send', label: '메시지 전송' }],
  },
];

export function getUser(id: string): UserDto {
  return users.find((u) => u.id === id) ?? users[0];
}
