// PostToolUse(Edit|Write): 수정한 파일만 빠르게 검사하고, 오류가 있으면 Claude에게 피드백한다
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join, relative } from 'node:path'

const input = JSON.parse(readFileSync(0, 'utf8') || '{}')
const root = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd()
const filePath = String(input.tool_input?.file_path ?? '')
if (!/\.(tsx?|jsx?|mjs)$/.test(filePath)) process.exit(0)

const rel = relative(root, filePath).split(String.fromCharCode(92)).join('/')
let result
if (rel.startsWith('apps/web/')) {
  // 웹: 수정한 파일만 ESLint
  result = spawnSync(`npx eslint "${relative(join(root, 'apps/web'), filePath)}"`, {
    cwd: join(root, 'apps/web'), encoding: 'utf8', shell: true, timeout: 60_000,
  })
} else if (rel.startsWith('apps/api/')) {
  // API: lint 스크립트가 tsc이므로 타입 체크 (프로젝트가 작아 빠름)
  result = spawnSync('npx tsc --noEmit', {
    cwd: join(root, 'apps/api'), encoding: 'utf8', shell: true, timeout: 60_000,
  })
} else {
  process.exit(0)
}

if (result.status !== 0) {
  const out = `${result.stdout ?? ''}${result.stderr ?? ''}`.trim().split('\n').slice(0, 30).join('\n')
  console.error(`[검사 실패] ${rel}\n${out}\n위 오류를 수정하세요.`)
  process.exit(2)
}
