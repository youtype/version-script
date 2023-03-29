import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import { expect, test } from '@jest/globals'

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
  process.env['INPUT_SCRIPT'] = 'console.log(1)'
  process.env['INPUT_GITHUB-TOKEN'] = 'test'
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'dist', 'index.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }
  console.log(cp.execFileSync(np, [ip], options).toString())
})
