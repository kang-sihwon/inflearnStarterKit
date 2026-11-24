---
description: Next.js 페이지 추가와 헤더 메뉴 등록 (예: /add-page posts)
argument-hint: <경로>
---

`apps/web`에 `/$ARGUMENTS` 페이지를 추가하세요.

1. `apps/web/src/app/about/page.tsx`와 `apps/web/src/app/todos/page.tsx`를 참고 패턴으로 읽습니다.
2. `apps/web/src/app/$ARGUMENTS/page.tsx`를 만듭니다.
   - `metadata`로 한국어 제목 지정
   - `@/components/ui/*`의 shadcn 컴포넌트 사용
   - `asChild` 금지, 링크 버튼은 `buttonVariants` 사용
   - 서버 데이터가 필요하면 클라이언트 컴포넌트를 분리하고 TanStack Query와 `@/lib/api`의 `api()`를 사용
3. `apps/web/src/components/layout/header.tsx`의 `links`에 메뉴를 추가합니다.
4. `npm run typecheck -w web`과 `npm run lint -w web`으로 검증하고 결과를 보고합니다.
