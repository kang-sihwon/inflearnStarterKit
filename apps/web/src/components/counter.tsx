"use client";

import { Button } from "@/components/ui/button";
import { useCounter } from "@/stores/counter";

export function Counter() {
  const { count, increment, reset } = useCounter();
  return (
    <div className="flex items-center gap-2">
      <Button onClick={increment}>클릭 {count}</Button>
      <Button variant="outline" onClick={reset}>
        초기화
      </Button>
    </div>
  );
}
