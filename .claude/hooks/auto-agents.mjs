// Stop 훅: 작업이 끝났을 때 변경 내용에 맞는 서브에이전트를 자동 실행하도록 Claude에게 지시한다.
// - 변경이 없거나, 이미 같은 변경을 검토했거나, 훅으로 인해 이어진 턴이면 아무것도 하지 않는다.
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const input = JSON.parse(readFileSync(0, 'utf8') || '{}')
if (input.stop_hook_active) process.exit(0) // 무한 루프 방지

const cwd = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd()
const git = (...args) =>
  execFileSync('git', ['-c', 'core.quotepath=false', ...args], { cwd, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })

let status
try {
  status = git('status', '--porcelain', '-uall')
} catch {
  process.exit(0) // git 저장소가 아님
}

// 상태 표시(XY)를 떼고 경로만 추출. .claude/ 자체의 변경은 검토 대상에서 제외
const files = status
  .split('\n')
  .filter(Boolean)
  .map((line) => ({ code: line.slice(0, 2), path: line.slice(3).replace(/^.* -> /, '') }))
  .filter((f) => !f.path.startsWith('.claude/'))

if (files.length === 0) process.exit(0)

// 같은 변경 내용이면 다시 실행하지 않는다 (diff + untracked 파일 크기/수정시각으로 지문 생성)
const fingerprint = createHash('sha1')
fingerprint.update(git('diff', 'HEAD', '--', '.', ':!.claude'))
for (const f of files.filter((f) => f.code === '??')) {
  try {
    const s = statSync(join(cwd, f.path))
    fingerprint.update(`${f.path}:${s.size}:${s.mtimeMs}`)
  } catch {}
}
const hash = fingerprint.digest('hex')
const stateFile = join(tmpdir(), `claude-auto-agents-${createHash('sha1').update(cwd).digest('hex').slice(0, 12)}.json`)
if (existsSync(stateFile)) {
  try {
    if (JSON.parse(readFileSync(stateFile, 'utf8')).hash === hash) process.exit(0)
  } catch {}
}
writeFileSync(stateFile, JSON.stringify({ hash }))

const paths = files.map((f) => f.path)
const isCode = (p) => /\.(tsx?|jsx?|mjs|cjs|css)$/.test(p)
const codeChanged = paths.some(isCode)
const apiChanged = paths.some((p) => p.startsWith('apps/api/'))
const depsChanged = paths.some((p) => /(^|\/)package(-lock)?\.json$/.test(p))
const envChanged = paths.some((p) => /\.env/.test(p) || p.endsWith('config/env.ts'))
const addedFeature = files.some(
  (f) => f.code === '??' && /apps\/(api\/src\/routes|web\/src\/(app|components))\//.test(f.path),
)

const agents = []
if (codeChanged) {
  agents.push(['code-reviewer', '변경된 코드의 품질·보안·성능 리뷰'])
  agents.push(['convention-checker', 'CLAUDE.md 규칙 위반 검사'])
}
if (apiChanged || depsChanged || envChanged) {
  agents.push(['security-checker', 'API/의존성/환경 변수 변경에 대한 보안 점검'])
}
if (addedFeature) {
  agents.push(['doc-writer', '새 라우트·페이지·컴포넌트에 맞춰 문서 갱신'])
}
if (agents.length === 0) process.exit(0) // 문서 등만 바뀐 경우

const list = agents.map(([name, why]) => `- ${name}: ${why}`).join('\n')
const reason = [
  '[자동 후처리] 변경된 파일에 맞는 서브에이전트를 실행하세요.',
  `변경 파일: ${paths.slice(0, 15).join(', ')}${paths.length > 15 ? ` 외 ${paths.length - 15}개` : ''}`,
  list,
  '독립적인 에이전트는 한 번에 병렬로 실행하고, 각 에이전트에는 위 변경 파일 목록을 전달하세요.',
  '결과 중 실제 문제(치명/중요, 규칙 위반, 취약점)만 수정하고, 수정이 필요 없으면 한두 줄로 요약만 하세요. 사소한 지적은 사용자에게 보고만 합니다.',
].join('\n')

process.stdout.write(JSON.stringify({ decision: 'block', reason }))
