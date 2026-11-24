// PreToolUse(Edit|Write): 민감하거나 자동 생성되는 파일의 수정을 차단한다
import { readFileSync } from 'node:fs'
import { basename } from 'node:path'

const { tool_input } = JSON.parse(readFileSync(0, 'utf8') || '{}')
const filePath = String(tool_input?.file_path ?? '')
const name = basename(filePath.split(String.fromCharCode(92)).join('/'))

if (/^\.env(\..+)?$/.test(name) && !/\.(example|sample|template)$/.test(name)) {
  console.error(`[차단됨] ${name}: 환경 변수 파일은 수정하지 않습니다. 변수 목록은 .env.example에 추가하고, 실제 값은 사용자가 직접 설정하세요.`)
  process.exit(2)
}
if (name === 'package-lock.json') {
  console.error('[차단됨] package-lock.json은 직접 수정하지 않습니다. `npm install`로 갱신하세요.')
  process.exit(2)
}
