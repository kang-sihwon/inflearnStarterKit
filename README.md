# Next.js + Express Starter Kit

Next.js 15 프론트엔드와 Express API 백엔드를 한 저장소(npm workspaces)에서 시작하는 스타터킷입니다.

```
apps/
├─ web/   Next.js 15 (App Router) · Tailwind CSS v4 · shadcn/ui · TanStack Query · Zustand · next-themes
└─ api/   Express · TypeScript · zod(환경 변수/입력 검증) · helmet · cors · morgan
```

## 시작하기

```bash
npm install
cp apps/api/.env.example apps/api/.env        # Windows PowerShell: Copy-Item
cp apps/web/.env.example apps/web/.env.local
npm run dev                                   # web: http://localhost:3000, api: http://localhost:4000
```

## 스크립트

| 명령 | 설명 |
| --- | --- |
| `npm run dev` | web + api 동시 실행 |
| `npm run dev:web` / `npm run dev:api` | 개별 실행 |
| `npm run build` | api, web 순서로 빌드 |
| `npm run lint` / `npm run typecheck` | 전체 검사 |

## 포함된 기능

**web**
- 헤더(모바일 시트 메뉴)·푸터 레이아웃, 다크 모드 토글
- 예제 페이지: `/`(Zustand 카운터), `/todos`(Express API 연동 CRUD), `/about`
- `src/lib/api.ts` fetch 래퍼, `src/stores/` Zustand 스토어
- UI 컴포넌트 추가: `cd apps/web && npx shadcn@latest add <component>`
  (이 템플릿은 Base UI 기반이라 `asChild` 대신 `render` prop을 사용합니다)

**api**
- `src/config/env.ts` zod로 환경 변수 검증
- `src/middlewares/error-handler.ts` 404 및 전역 에러 핸들러(`HttpError`, `ZodError` 처리)
- `src/routes/` 라우터 (`/api/health`, `/api/todos`), `asyncHandler`로 비동기 에러 전달
- 예제 todos는 인메모리 저장소이므로 DB 연결 시 교체하세요.

## 환경 변수

| 파일 | 변수 | 기본값 |
| --- | --- | --- |
| `apps/api/.env` | `PORT`, `CORS_ORIGIN`, `NODE_ENV` | 4000, `http://localhost:3000`, development |
| `apps/web/.env.local` | `NEXT_PUBLIC_API_URL` | `http://localhost:4000/api` |
