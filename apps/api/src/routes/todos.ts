import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../utils/async-handler.js";
import { HttpError } from "../utils/http-error.js";

interface Todo {
  id: number;
  title: string;
  done: boolean;
}

// 예제용 인메모리 저장소 (DB 연결 시 교체하세요)
const todos: Todo[] = [
  { id: 1, title: "스타터킷 둘러보기", done: true },
  { id: 2, title: "나만의 API 만들기", done: false },
];
let nextId = 3;

const createSchema = z.object({ title: z.string().trim().min(1).max(100) });
const updateSchema = z.object({ title: z.string().trim().min(1).max(100).optional(), done: z.boolean().optional() });

export const todosRouter = Router();

todosRouter.get("/", (_req, res) => {
  res.json({ data: todos });
});

todosRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const { title } = createSchema.parse(req.body);
    const todo: Todo = { id: nextId++, title, done: false };
    todos.push(todo);
    res.status(201).json({ data: todo });
  }),
);

todosRouter.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const todo = todos.find((t) => t.id === Number(req.params.id));
    if (!todo) throw new HttpError(404, "할 일을 찾을 수 없습니다.");
    Object.assign(todo, updateSchema.parse(req.body));
    res.json({ data: todo });
  }),
);

todosRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const index = todos.findIndex((t) => t.id === Number(req.params.id));
    if (index === -1) throw new HttpError(404, "할 일을 찾을 수 없습니다.");
    todos.splice(index, 1);
    res.status(204).end();
  }),
);
