// PreToolUse(Bash): git commit 직전에 typecheck + lint를 실행하고, 실패하면 커밋을 차단한다
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const input = JSON.parse(readFileSync(0, 'utf8') || '{}')
const cmd = String(input.tool_input?.command ?? '')
if (!/\bgit\s+(-\S+\s+)*commit\b/.test(cmd)) process.exit(0)

const cwd = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd()
for (const script of ['typecheck', 'lint']) {
  const r = spawnSync(`npm run ${script}`, { cwd, encoding: 'utf8', shell: true, timeout: 150_000 })
  if (r.status !== 0) {
    const out = `${r.stdout ?? ''}${r.stderr ?? ''}`.trim().split('\n').slice(-30).join('\n')
    console.error(`[커밋 차단] npm run ${script} 실패. 수정 후 다시 커밋하세요.\n${out}`)
    process.exit(2)
  }
}
