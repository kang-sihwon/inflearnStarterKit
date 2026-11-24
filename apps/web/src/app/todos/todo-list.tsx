"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";

interface Todo {
  id: number;
  title: string;
  done: boolean;
}

export function TodoList() {
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const invalidate = () => qc.invalidateQueries({ queryKey: ["todos"] });

  const { data, isLoading, error } = useQuery({
    queryKey: ["todos"],
    queryFn: () => api<{ data: Todo[] }>("/todos").then((r) => r.data),
  });
  const add = useMutation({
    mutationFn: (title: string) => api("/todos", { method: "POST", body: JSON.stringify({ title }) }),
    onSuccess: () => {
      setTitle("");
      invalidate();
    },
  });
  const toggle = useMutation({
    mutationFn: (t: Todo) => api(`/todos/${t.id}`, { method: "PATCH", body: JSON.stringify({ done: !t.done }) }),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: (id: number) => api(`/todos/${id}`, { method: "DELETE" }),
    onSuccess: invalidate,
  });

  return (
    <div className="space-y-4">
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (title.trim()) add.mutate(title);
        }}
      >
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="새 할 일" />
        <Button type="submit" disabled={add.isPending}>
          추가
        </Button>
      </form>

      {isLoading && <p className="text-sm text-muted-foreground">불러오는 중...</p>}
      {error && <p className="text-sm text-destructive">{error.message} (API 서버가 켜져 있는지 확인하세요)</p>}

      <div className="space-y-2">
        {data?.map((t) => (
          <Card key={t.id}>
            <CardContent className="flex items-center justify-between py-3">
              <button onClick={() => toggle.mutate(t)} className={t.done ? "text-muted-foreground line-through" : ""}>
                {t.title}
              </button>
              <Button variant="ghost" size="icon" onClick={() => remove.mutate(t.id)} aria-label="삭제">
                <Trash2 className="size-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
