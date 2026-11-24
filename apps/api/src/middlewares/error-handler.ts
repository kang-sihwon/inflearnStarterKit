import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";
import { env } from "../config/env.js";
import { HttpError } from "../utils/http-error.js";

export const notFound: RequestHandler = (req, _res, next) => {
  next(new HttpError(404, `경로를 찾을 수 없습니다: ${req.method} ${req.originalUrl}`));
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    res.status(400).json({ error: { message: "잘못된 요청입니다.", details: err.flatten() } });
    return;
  }
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: { message: err.message, details: err.details } });
    return;
  }
  console.error(err);
  res.status(500).json({
    error: { message: env.NODE_ENV === "production" ? "서버 오류가 발생했습니다." : String(err?.message ?? err) },
  });
};
