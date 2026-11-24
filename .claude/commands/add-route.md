---
description: Express API 라우터 추가 (예: /add-route posts)
argument-hint: <리소스 이름>
---

`apps/api`에 `$ARGUMENTS` 리소스의 라우터를 추가하세요.

1. `apps/api/src/routes/todos.ts`를 참고 패턴으로 읽습니다.
2. `apps/api/src/routes/$ARGUMENTS.ts`를 만듭니다.
   - zod 스키마로 입력 검증
   - 비동기 핸들러는 `asyncHandler`로 감싸기
   - 오류는 `HttpError` 사용, 응답은 `{ data }` 형식
   - 상대 import에 `.js` 확장자 붙이기
3. `apps/api/src/routes/index.ts`에 `apiRouter.use("/$ARGUMENTS", ...)`로 등록합니다.
4. `npm run typecheck -w api`로 검증하고 결과를 보고합니다.

저장소는 예제용 인메모리 방식으로 두고, DB 연결은 하지 마세요.
