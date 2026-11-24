# 프로젝트 규칙

Next.js 15 + Express 모노레포 스타터킷 (npm workspaces).

## 구조
- `apps/web`: Next.js 15 App Router, TypeScript, Tailwind v4, shadcn/ui, TanStack Query, Zustand
- `apps/api`: Express + TypeScript(ESM), zod, helmet, cors, morgan

## 명령어
- `npm run dev`: web(:3000) + api(:4000) 동시 실행
- `npm run typecheck` / `npm run lint` / `npm run build`: 커밋 전 검사

## 웹 규칙
- UI 문구는 한국어로 작성한다.
- shadcn/ui는 Base UI 기반이다. `asChild`를 쓰지 말고 트리거는 `render` prop, 링크 버튼은 `buttonVariants`를 사용한다.
- 컴포넌트 추가: `cd apps/web && npx shadcn@latest add <이름>`
- 서버 데이터는 TanStack Query, 클라이언트 상태는 `src/stores/`의 Zustand를 사용한다.
- API 호출은 `src/lib/api.ts`의 `api()` 래퍼를 사용한다.
- 메뉴는 `src/components/layout/header.tsx`의 `links` 배열에서 관리한다.

## API 규칙
- ESM이므로 상대 import에 `.js` 확장자를 붙인다.
- 성공 응답은 `{ data }`, 실패 응답은 `{ error: { message, details? } }` 형식이다.
- 비동기 핸들러는 `asyncHandler`로 감싸고, 오류는 `HttpError`를 던진다.
- 입력은 zod로 검증한다. 환경 변수는 `src/config/env.ts`에만 추가한다.
- 새 라우터는 `src/routes/index.ts`에 등록한다.

## 주의
- `node.exe` 전체를 종료하는 명령은 쓰지 않는다.
- `.env`, 토큰, 개인 정보는 커밋하지 않는다.
