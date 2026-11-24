// PreToolUse(Bash): 위험한 명령을 실행 전에 차단한다 (exit 2 → 사유가 Claude에게 전달됨)
import { readFileSync } from 'node:fs'

const { tool_input } = JSON.parse(readFileSync(0, 'utf8') || '{}')
const cmd = String(tool_input?.command ?? '')

const rules = [
  [/taskkill[^\n]*node(\.exe)?/i, 'node 프로세스 전체 종료 금지 (CLAUDE.md). 포트를 점유한 PID만 확인해 종료하세요.'],
  [/\b(killall|pkill)\b[^\n]*\bnode\b/i, 'node 프로세스 전체 종료 금지 (CLAUDE.md). 해당 PID만 종료하세요.'],
  [/Stop-Process[^\n]*-Name[^\n]*node/i, 'node 프로세스 전체 종료 금지 (CLAUDE.md). 해당 PID만 종료하세요.'],
  [/\bsudo\b/, 'sudo 사용 금지'],
  [/\bgit\s+push\b[^\n]*(--force(?!-with-lease)|\s-f\b)/, 'git push --force 금지. 필요하면 --force-with-lease를 사용하세요.'],
  [
    /\brm\s+(-[a-zA-Z]*r[a-zA-Z]*f|-[a-zA-Z]*f[a-zA-Z]*r|-r\s+-f|-f\s+-r)[a-zA-Z]*\s+(\/|~\/?|\*|\.|\.\.|\$HOME|[A-Za-z]:[\/]?)(\s|$|;|&|\|)/,
    '루트/홈/현재 디렉터리 전체에 대한 rm -rf 금지',
  ],
]

for (const [pattern, message] of rules) {
  if (pattern.test(cmd)) {
    console.error(`[차단됨] ${message}`)
    process.exit(2)
  }
}
