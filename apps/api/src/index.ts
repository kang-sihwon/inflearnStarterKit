import { createApp } from "./app.js";
import { env } from "./config/env.js";

createApp().listen(env.PORT, () => {
  console.log(`🚀 API 서버 실행 중: http://localhost:${env.PORT}/api/health`);
});
