import type { Metadata } from "next";
import { TodoList } from "./todo-list";

export const metadata: Metadata = { title: "할 일 예제" };

export default function TodosPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">할 일 (Express API 연동)</h1>
      <p className="text-sm text-muted-foreground">
        API 서버가 실행 중이어야 합니다. 루트에서 <code>npm run dev</code>를 실행하세요.
      </p>
      <TodoList />
    </div>
  );
}
