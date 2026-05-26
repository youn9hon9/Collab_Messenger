export const WORKSPACE_PERMISSIONS = [
  { key: 'message:send', label: '메시지 전송' },
  { key: 'message:delete', label: '메시지 삭제' },
  { key: 'member:invite', label: '멤버 초대' },
  { key: 'analytics:view', label: '분석 보기' },
  { key: 'settings:manage', label: '설정 관리' },
] as const;

export function permissionsFromKeys(keys: string[]) {
  return keys.map((key) => ({
    key,
    label: WORKSPACE_PERMISSIONS.find((p) => p.key === key)?.label ?? key,
  }));
}
