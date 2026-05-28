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
      content:
        '안녕하세요, 운영팀입니다. 이번 주 전체 회의는 목요일 15:00~16:00, 3층 대회의실로 확정했습니다. 불참 시 사전에 스레드로 알려주세요.',
      authorId: 'user-kim',
      author: u('user-kim'),
      channelId: 'ch-1',
      createdAt: '2026-05-25T09:00:00',
    },
    {
      id: 'ch1-msg-2',
      content: '회의 안건 초안은 노션 「UXD Weekly」 페이지에 올려두었습니다. 추가 안건 있으면 화요일 18시까지 댓글 부탁드립니다.',
      authorId: 'user-kim',
      author: u('user-kim'),
      channelId: 'ch-1',
      createdAt: '2026-05-25T09:08:00',
    },
    {
      id: 'ch1-msg-3',
      content: '캘린더 초대 보냈고, 원격 참여 링크도 안건 문서 상단에 넣어뒀어요.',
      authorId: 'user-me',
      author: u('user-me'),
      channelId: 'ch-1',
      createdAt: '2026-05-25T09:15:00',
    },
    {
      id: 'ch1-msg-4',
      content: '다음 주 월요일은 공휴일 대체 휴무입니다. 긴급 장애 채널(#엔지니어링)만 모니터링 돌아갈 예정이에요.',
      authorId: 'user-lee',
      author: u('user-lee'),
      channelId: 'ch-1',
      createdAt: '2026-05-26T08:30:00',
    },
    {
      id: 'ch1-msg-5',
      content: '확인했습니다. 휴무일 당직표도 공지 문서에 링크해 두었어요.',
      authorId: 'user-me',
      author: u('user-me'),
      channelId: 'ch-1',
      createdAt: '2026-05-26T08:42:00',
    },
  ],
  'ch-2': [
    {
      id: 'ch2-msg-1',
      content:
        '이번 주 엔지니어링 위클리 아젠다 올려뒀습니다. 1) 스프린트 회고 2) CI 파이프라인 개선 3) 온콜 로테이션 변경 안내 순서로 진행할게요.',
      authorId: 'user-lee',
      author: u('user-lee'),
      channelId: 'ch-2',
      createdAt: '2026-05-26T08:00:00',
    },
    {
      id: 'ch2-msg-2',
      content:
        'CI 쪽은 E2E가 PR마다 40분 넘게 걸려서 병목이에요. 캐시 키 분리랑 병렬 샤드 적용안 문서 링크 남깁니다.',
      authorId: 'user-park',
      author: u('user-park'),
      channelId: 'ch-2',
      createdAt: '2026-05-26T08:12:00',
    },
    {
      id: 'ch2-msg-3',
      content: '문서 봤어요. 테스트 분할은 동의하는데, 스테이징 DB 스냅샷 비용도 같이 견적 내주실 수 있을까요?',
      authorId: 'user-kim',
      author: u('user-kim'),
      channelId: 'ch-2',
      createdAt: '2026-05-26T08:18:00',
    },
    {
      id: 'ch2-msg-4',
      content: '네, 오늘 오후에 인프라 팀이랑 맞춰보고 수치 공유할게요.',
      authorId: 'user-park',
      author: u('user-park'),
      channelId: 'ch-2',
      createdAt: '2026-05-26T08:25:00',
    },
    {
      id: 'ch2-msg-5',
      content: '위클리 전에 아젠다 코멘트 달아주시면 반영하겠습니다. 회의는 수요일 11시 그대로입니다.',
      authorId: 'user-me',
      author: u('user-me'),
      channelId: 'ch-2',
      createdAt: '2026-05-26T08:35:00',
    },
    {
      id: 'ch2-msg-6',
      content: '온콜 변경 건은 제가 이번 주부터 첫 주 담당이에요. 에스컬레이션 경로는 runbook 3.2절 기준으로 볼게요.',
      authorId: 'user-lee',
      author: u('user-lee'),
      channelId: 'ch-2',
      createdAt: '2026-05-26T09:10:00',
    },
  ],
  'ch-3': [
    {
      id: 'msg-1',
      content:
        '인증 v2 스테이징 배포 완료했습니다. 변경점: 소셜 로그인 콜백 URL 정리, refresh 토큰 rotation, 세션 쿠키 SameSite=Lax 적용.',
      authorId: 'user-lee',
      author: u('user-lee'),
      channelId: 'ch-3',
      createdAt: '2026-05-26T10:05:00',
    },
    {
      id: 'msg-2',
      content:
        'QA 시나리오는 스프레드시트 「Auth v2 QA」 탭에 정리해뒀어요. OAuth 리다이렉트, 만료 세션, 동시 로그인 케이스부터 보면 될 것 같습니다.',
      authorId: 'user-lee',
      author: u('user-lee'),
      channelId: 'ch-3',
      createdAt: '2026-05-26T10:12:00',
    },
    {
      id: 'msg-3',
      content: '확인했습니다. 오늘 오후에 스테이징 붙어서 1차 돌리고, 이슈는 GitHub 라벨 auth-v2로 달게요.',
      authorId: 'user-me',
      author: u('user-me'),
      channelId: 'ch-3',
      createdAt: '2026-05-26T10:20:00',
    },
    {
      id: 'msg-4',
      content:
        'rate limit은 기존 100rpm에서 tier별로 나누자는 안이 있는데, v2 릴리스 전에 최소한 로그인 API만 20rpm으로 낮추는 건 어떨까요?',
      authorId: 'user-lee',
      author: u('user-lee'),
      channelId: 'ch-3',
      createdAt: '2026-05-26T10:28:00',
    },
    {
      id: 'msg-5',
      content:
        '동의합니다. 세션 저장소는 Redis 클러스터로 옮기는 작업이 이번 스프린트에 들어가 있어요. cutover는 6/2 새벽 창 잡으려고 합니다.',
      authorId: 'user-kim',
      author: u('user-kim'),
      channelId: 'ch-3',
      createdAt: '2026-05-26T10:35:00',
    },
    {
      id: 'msg-6',
      content: '그럼 cutover 전에 connection pool 사이즈랑 failover 테스트 체크리스트 공유 부탁드려요.',
      authorId: 'user-me',
      author: u('user-me'),
      channelId: 'ch-3',
      createdAt: '2026-05-26T10:42:00',
    },
    {
      id: 'msg-7',
      content: '인프라 다이어그램 v3.1에 Redis 반영해서 PR 올릴게요. 리뷰는 김도현님 태그할게요.',
      authorId: 'user-me',
      author: u('user-me'),
      channelId: 'ch-3',
      createdAt: '2026-05-26T10:48:00',
    },
    {
      id: 'msg-8',
      content: '스테이징에서 redirect loop 하나 잡았어요. state 파라미터 인코딩 이슈였고 핫픽스 브랜치 push 했습니다.',
      authorId: 'user-lee',
      author: u('user-lee'),
      channelId: 'ch-3',
      createdAt: '2026-05-26T11:15:00',
    },
  ],
  'ch-4': [
    {
      id: 'ch4-msg-1',
      content:
        '모바일 핸드오프 시안 v2 Figma 링크 공유합니다. 변경: 하단 탭 구조, 알림 센터 진입, 채널 목록 접기 동작.',
      authorId: 'user-hwang',
      author: u('user-hwang'),
      channelId: 'ch-4',
      createdAt: '2026-05-26T10:30:00',
    },
    {
      id: 'ch4-msg-2',
      content:
        '개발 쪽에서 탭 전환 시 레이아웃 시프트가 있을 수 있어서, safe-area 패딩 값을 토큰으로 빼두면 좋겠어요.',
      authorId: 'user-park',
      author: u('user-park'),
      channelId: 'ch-4',
      createdAt: '2026-05-26T10:45:00',
    },
    {
      id: 'ch4-msg-3',
      content: '네, spacing 토큰 시트에 mobile-safe-top/bottom 추가해둘게요.',
      authorId: 'user-hwang',
      author: u('user-hwang'),
      channelId: 'ch-4',
      createdAt: '2026-05-26T10:52:00',
    },
    {
      id: 'ch4-msg-4',
      content: '오늘 오후에 코멘트 남길게요. iOS 실기기에서 스크롤 끝 bounce도 같이 볼 예정입니다.',
      authorId: 'user-me',
      author: u('user-me'),
      channelId: 'ch-4',
      createdAt: '2026-05-26T11:00:00',
    },
    {
      id: 'ch4-msg-5',
      content: '목요일 핸드오프 미팅 전에 dev-ready 프레임만 따로 페이지 파주시면 구현 착수하기 편할 것 같아요.',
      authorId: 'user-lee',
      author: u('user-lee'),
      channelId: 'ch-4',
      createdAt: '2026-05-26T11:20:00',
    },
    {
      id: 'ch4-msg-6',
      content: '알겠습니다. 내일 오전까지 「Handoff / Dev」 페이지 분리해서 링크 다시 올릴게요.',
      authorId: 'user-hwang',
      author: u('user-hwang'),
      channelId: 'ch-4',
      createdAt: '2026-05-26T11:35:00',
    },
  ],
  'ch-5': [
    {
      id: 'ch5-msg-1',
      content:
        'v2.4.0 릴리스 노트 초안 올렸습니다. 사용자 영향 큰 항목: 인증 v2, DM 읽음 표시, 캔버스 AI 제안 베타.',
      authorId: 'user-park',
      author: u('user-park'),
      channelId: 'ch-5',
      createdAt: '2026-05-26T07:30:00',
    },
    {
      id: 'ch5-msg-2',
      content: '배포 창은 금요일 02:00~04:00 KST로 잡았어요. 트래픽 적은 시간대 기준입니다.',
      authorId: 'user-lee',
      author: u('user-lee'),
      channelId: 'ch-5',
      createdAt: '2026-05-26T07:45:00',
    },
    {
      id: 'ch5-msg-3',
      content:
        '롤백은 이전 이미지 태그 v2.3.2로 되돌리는 절차입니다. runbook 링크와 담당자 연락처 표 넣어뒀어요.',
      authorId: 'user-me',
      author: u('user-me'),
      channelId: 'ch-5',
      createdAt: '2026-05-26T08:00:00',
    },
    {
      id: 'ch5-msg-4',
      content: '릴리스 노트에 breaking change 섹션을 맨 위로 올리는 게 좋겠어요. API 클라이언트 팀도 봐야 해서요.',
      authorId: 'user-kim',
      author: u('user-kim'),
      channelId: 'ch-5',
      createdAt: '2026-05-26T08:20:00',
    },
    {
      id: 'ch5-msg-5',
      content: '반영했습니다. 배포 당일 #공지 채널에도 요약 포스트 올릴 예정이에요.',
      authorId: 'user-park',
      author: u('user-park'),
      channelId: 'ch-5',
      createdAt: '2026-05-26T08:35:00',
    },
    {
      id: 'ch5-msg-6',
      content: '스모크 테스트 체크리스트 12항목도 runbook에 붙여뒀습니다. 배포 후 30분 안에 완료 목표입니다.',
      authorId: 'user-lee',
      author: u('user-lee'),
      channelId: 'ch-5',
      createdAt: '2026-05-26T09:00:00',
    },
  ],
  'ch-d1': [
    {
      id: 'chd1-msg-1',
      content: '디자인 리뷰 보드에 이번 스프린트 항목 6개 추가했습니다. 우선순위는 P0 두 건부터 봐주세요.',
      authorId: 'user-hwang',
      author: u('user-hwang'),
      channelId: 'ch-d1',
      createdAt: '2026-05-25T14:00:00',
    },
    {
      id: 'chd1-msg-2',
      content: 'P0 중 설정 화면 정보 밀도 건은 내일 라이브 리뷰로 잡을까요?',
      authorId: 'user-park',
      author: u('user-park'),
      channelId: 'ch-d1',
      createdAt: '2026-05-25T14:15:00',
    },
    {
      id: 'chd1-msg-3',
      content: '좋아요. 수요일 14시 30분, 30분 슬롯 캘린더 보낼게요.',
      authorId: 'user-hwang',
      author: u('user-hwang'),
      channelId: 'ch-d1',
      createdAt: '2026-05-25T14:22:00',
    },
    {
      id: 'chd1-msg-4',
      content: '확인했습니다. 리뷰 전에 피그마 코멘트는 최대한 프레임 단위로 달아주시면 추적이 쉬워요.',
      authorId: 'user-me',
      author: u('user-me'),
      channelId: 'ch-d1',
      createdAt: '2026-05-25T14:30:00',
    },
    {
      id: 'chd1-msg-5',
      content: '지난 스프린트 미해결 코멘트 3건도 보드 하단에 archived로 옮겨뒀습니다.',
      authorId: 'user-hwang',
      author: u('user-hwang'),
      channelId: 'ch-d1',
      createdAt: '2026-05-26T09:00:00',
    },
  ],
  'ch-d2': [
    {
      id: 'chd2-msg-1',
      content:
        'UI 피드백 공유합니다. 1) 주요 버튼 터치 영역 44px 미만인 곳 2) 다크 모드 대비 WCAG AA 미달 텍스트 3) 토스트 z-index 겹침.',
      authorId: 'user-park',
      author: u('user-park'),
      channelId: 'ch-d2',
      createdAt: '2026-05-26T09:30:00',
    },
    {
      id: 'chd2-msg-2',
      content: '1번은 컴포넌트 라이브러리 Button/Large 스펙으로 통일할게요. PR 오늘 중 올립니다.',
      authorId: 'user-hwang',
      author: u('user-hwang'),
      channelId: 'ch-d2',
      createdAt: '2026-05-26T09:45:00',
    },
    {
      id: 'chd2-msg-3',
      content: '2번은 gray-500을 gray-600으로 올리는 안 검토 중이에요. 스크린샷 비교 붙일게요.',
      authorId: 'user-hwang',
      author: u('user-hwang'),
      channelId: 'ch-d2',
      createdAt: '2026-05-26T10:00:00',
    },
    {
      id: 'chd2-msg-4',
      content: '3번은 모달이 열릴 때 토스트 큐를 일시 정지하는 쪽이 구현 난이도 낮을 것 같아요. 백엔드 필요 없음.',
      authorId: 'user-me',
      author: u('user-me'),
      channelId: 'ch-d2',
      createdAt: '2026-05-26T10:15:00',
    },
    {
      id: 'chd2-msg-5',
      content: '네, 프론트에서 z-index 레이어 표만 맞추면 될 듯해요. 표 공유 부탁드립니다.',
      authorId: 'user-park',
      author: u('user-park'),
      channelId: 'ch-d2',
      createdAt: '2026-05-26T10:28:00',
    },
    {
      id: 'chd2-msg-6',
      content: '레이어 표 디자인 시스템 문서에 추가했습니다. 링크는 #디자인-핸드오프 채널 핀 메시지 참고해주세요.',
      authorId: 'user-hwang',
      author: u('user-hwang'),
      channelId: 'ch-d2',
      createdAt: '2026-05-26T10:40:00',
    },
  ],
};

export const initialDmMessages: Record<string, MessageDto[]> = {
  'dm-hwang': [
    {
      id: 'dm-1',
      content: '안녕하세요, 모바일 네비 시안 v2 코멘트 가능하실까요? 오늘 중에 한 번만 봐주시면 핸드오프 일정 맞출 수 있을 것 같아요.',
      authorId: 'user-hwang',
      author: u('user-hwang'),
      conversationId: 'dm-hwang',
      createdAt: '2026-05-26T09:00:00',
    },
    {
      id: 'dm-2',
      content: '네, 오후 3시 이후에 Figma 열어볼게요. safe-area 토큰 분리 건은 이미 반영해주셔서 그 부분은 빠르게 넘어갈 수 있을 듯합니다.',
      authorId: 'user-me',
      author: u('user-me'),
      conversationId: 'dm-hwang',
      createdAt: '2026-05-26T09:12:00',
    },
    {
      id: 'dm-3',
      content: '감사합니다. 코멘트 달 때 「blocking / nice-to-have」 라벨만 달아주시면 우선순위 정리하기 편해요.',
      authorId: 'user-hwang',
      author: u('user-hwang'),
      conversationId: 'dm-hwang',
      createdAt: '2026-05-26T09:18:00',
    },
    {
      id: 'dm-4',
      content: '알겠어요. blocking은 탭 전환 애니메이션 길이 쪽 하나만 달아둘 것 같아요.',
      authorId: 'user-me',
      author: u('user-me'),
      conversationId: 'dm-hwang',
      createdAt: '2026-05-26T09:25:00',
    },
  ],
  'dm-kim': [
    {
      id: 'dm-kim-1',
      content:
        'Redis 세션 마이그레이션 일정 공유드립니다. 6/2 02:00 cutover, 6/1 18:00부터 읽기 전용 모드 30분 예정이에요.',
      authorId: 'user-kim',
      author: u('user-kim'),
      conversationId: 'dm-kim',
      createdAt: '2026-05-26T08:30:00',
    },
    {
      id: 'dm-kim-2',
      content: '확인했습니다. 스테이징에서 failover 테스트 먼저 돌리고, 이상 없으면 체크리스트에 사인할게요.',
      authorId: 'user-me',
      author: u('user-me'),
      conversationId: 'dm-kim',
      createdAt: '2026-05-26T08:42:00',
    },
    {
      id: 'dm-kim-3',
      content: 'cutover 당일에는 제가 온콜이에요. 이슈 나면 이 DM이나 #백엔드로 바로 펑 주세요.',
      authorId: 'user-kim',
      author: u('user-kim'),
      conversationId: 'dm-kim',
      createdAt: '2026-05-26T08:50:00',
    },
    {
      id: 'dm-kim-4',
      content: '네, 감사합니다. 체크리스트 완료되면 스레드에 스크린샷도 남겨둘게요.',
      authorId: 'user-me',
      author: u('user-me'),
      conversationId: 'dm-kim',
      createdAt: '2026-05-26T09:00:00',
    },
  ],
  'dm-lee': [
    {
      id: 'dm-lee-1',
      content:
        'OAuth 리다이렉트 테스트 케이스 18개 정리해뒀어요. 스프레드시트 링크 DM으로 보낼게요—이상 케이스는 노란 행만 보면 됩니다.',
      authorId: 'user-lee',
      author: u('user-lee'),
      conversationId: 'dm-lee',
      createdAt: '2026-05-26T08:00:00',
    },
    {
      id: 'dm-lee-2',
      content: '링크 받았어요. 오후에 같이 30분 잡아서 스테이징 화면 공유하면서 돌릴까요?',
      authorId: 'user-me',
      author: u('user-me'),
      conversationId: 'dm-lee',
      createdAt: '2026-05-26T08:15:00',
    },
    {
      id: 'dm-lee-3',
      content: '좋아요. 2시 30분 어때요? redirect loop 핫픽스 반영된 빌드로 보면 됩니다.',
      authorId: 'user-lee',
      author: u('user-lee'),
      conversationId: 'dm-lee',
      createdAt: '2026-05-26T08:22:00',
    },
    {
      id: 'dm-lee-4',
      content: '2시 30분 가능합니다. 캘린더 초대 보내주세요.',
      authorId: 'user-me',
      author: u('user-me'),
      conversationId: 'dm-lee',
      createdAt: '2026-05-26T08:28:00',
    },
    {
      id: 'dm-lee-5',
      content: '보냈어요. 미팅 전에 rate limit 변경도 스테이징에 올라가 있을 거예요.',
      authorId: 'user-lee',
      author: u('user-lee'),
      conversationId: 'dm-lee',
      createdAt: '2026-05-26T08:35:00',
    },
  ],
  'dm-park': [
    {
      id: 'dm-park-1',
      content:
        '게스트 권한으로 #엔지니어링 채널 읽기/쓰기 테스트 중이에요. 쓰기는 되는데 파일 업로드만 403 나네요.',
      authorId: 'user-park',
      author: u('user-park'),
      conversationId: 'dm-park',
      createdAt: '2026-05-25T17:00:00',
    },
    {
      id: 'dm-park-2',
      content: '확인해볼게요. 게스트 역할에 attachment:upload 권한이 빠져 있는 것 같아요. 역할 설정에서 켤 수 있습니다.',
      authorId: 'user-me',
      author: u('user-me'),
      conversationId: 'dm-park',
      createdAt: '2026-05-25T17:15:00',
    },
    {
      id: 'dm-park-3',
      content: '권한 켠 뒤에 다시 시도했는데 정상 업로드됩니다. 감사합니다.',
      authorId: 'user-park',
      author: u('user-park'),
      conversationId: 'dm-park',
      createdAt: '2026-05-25T17:28:00',
    },
    {
      id: 'dm-park-4',
      content: '도움이 되었다니 다행이에요. 게스트 플로우 문서화할 때 이 케이스도 FAQ에 넣어둘게요.',
      authorId: 'user-me',
      author: u('user-me'),
      conversationId: 'dm-park',
      createdAt: '2026-05-25T17:35:00',
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
    content: `# Redis 세션 저장소 마이그레이션

## 배경
인증 v2 배포에 맞춰 세션 저장소를 인메모리에서 Redis 클러스터로 이전합니다. 현재 스테이징에서 connection pool 설정과 failover 시나리오를 검증 중입니다.

## 일정
- 5/28: 스테이징 부하 테스트
- 6/1 18:00: 읽기 전용 모드 (30분)
- 6/2 02:00: cutover

## 체크리스트
- ElastiCache 파라미터 그룹 적용
- 앱 서버 \`SESSION_STORE=redis\` 환경 변수 반영
- cutover 후 24시간 모니터링 담당: 서버팀

## 참고
인프라 다이어그램 v3.1 PR과 #백엔드 채널 스레드에 최신 타임라인이 정리되어 있습니다.`,
    status: 'BEFORE_START',
    tags: ['Backend', '인프라'],
    isAiGenerated: false,
    updatedAt: '2026-05-25',
  },
  {
    id: 'doc-2',
    title: 'API Rate Limiting 전략',
    content: `# API Rate Limiting 전략

## 목표
v2.4.0 릴리스 전에 티어별 요청 한도를 정의하고, 로그인·쓰기 API에 우선 적용합니다.

## 제안 한도
1. 익명: 20 rpm (IP 기준)
2. 인증 사용자: 120 rpm
3. 내부 서비스 계정: 별도 화이트리스트

## 구현 메모
- Gateway에서 \`X-RateLimit-*\` 헤더 노출
- 429 응답 시 클라이언트 재시도 백오프 가이드 문서화

## 오픈 이슈
대시보드 알림 임계치는 SRE와 5/27 미팅에서 확정 예정입니다.`,
    status: 'BEFORE_START',
    tags: ['Backend', 'API'],
    isAiGenerated: false,
    updatedAt: '2026-05-25',
  },
  {
    id: 'doc-3',
    title: '프로덕션 DB 알림 대응 기록',
    content: `# 프로덕션 DB 알림 대응 기록

## 사건 요약
5/21 14:02 KST connection pool 고갈 알림. API p95 지연 2.4s까지 상승 후 14:38 서비스 정상화.

## 근본 원인
배치 잡이 장시간 커넥션을 점유했고, 쿼리 타임아웃이 없어 pool이 회수되지 않았습니다.

## 조치 내역
- 쿼리 타임아웃 30초 적용
- pool max 50 → 80 상향 (임시)
- 문제 배치 잡 스케줄 분리

## 재발 방지
- pool 사용률 80% 초과 시 PagerDuty 알림
- 주간 DB 메트릭 리뷰를 릴리즈 체크리스트에 포함`,
    status: 'IN_PROGRESS',
    tags: ['Database', '인시던트'],
    isAiGenerated: false,
    updatedAt: '2026-05-21',
  },
  {
    id: 'doc-4',
    title: '타운홀 미팅 준비',
    content: `# 타운홀 미팅 준비

## 일시·참석
- 5/29(목) 15:00–16:00, 3층 대회의실 + 원격
- 필수: 전체 UXD, Q&A는 슬랙 #공지로 수집

## 안건 초안
1. Q2 목표 진행률 (5분)
2. 인증 v2·캔버스 AI 베타 데모 (15분)
3. 조직 공지: 휴무일·온콜 (5분)

## 발표 자료
노션 「Town Hall / May」 페이지에 슬라이드 링크 예정. 발표자: 김도현, 이나영

## AI 초안 메모
이 문서는 5/26 점심 메뉴 논의 채널 활동을 바탕으로 자동 생성된 초안입니다. 안건은 수동으로 다듬어 주세요.`,
    status: 'BEFORE_START',
    tags: ['Meeting Minutes', 'AI'],
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
