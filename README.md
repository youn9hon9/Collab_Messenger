# Collab Messenger (웹 데모)

시안 기반 **인터랙티브 웹 데모**입니다. 서버·DB·Docker 없이 Next.js만으로 동작합니다.

## 실행 방법

```powershell
cd apps\web
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속 → **데모 시작하기** 클릭

캐시 클리어
```
Remove-Item -Recurse -Force .next
npm run dev
```

## 데모에서 체험할 수 있는 기능

- 워크스페이스 전환, 채널/DM, 다중 탭 (hover 시 닫기)
- 실시간처럼 보이는 채팅 (메시지 전송·예약 발송)
- 우측 패널: 멤버, 고정 메시지, 배포 토픽, 연관 일정
- Schedule 월별/일별, Canvas + AI 제안 생성
- 투표, 프레즌스(회의 중 토스트), 멤버 초대 모달
- 워크스페이스/채널 설정, 마이페이지, 구독 데모

## 기술 스택

- Next.js 15, React 19, Tailwind CSS 4, Zustand
- 모든 데이터: `apps/web/src/lib/mock-data.ts` + `demo-store.ts`