import { NextResponse } from 'next/server'
import { execSync } from 'child_process'
import path from 'path'

export const dynamic = 'force-dynamic'

export async function GET() {
  const projectDir = path.resolve(process.cwd())

  try {
    const output = execSync('./node_modules/.bin/vitest run --reporter=verbose 2>&1', {
      cwd: projectDir,
      encoding: 'utf-8',
      timeout: 60000,
      maxBuffer: 10 * 1024 * 1024,
    })

    return NextResponse.json({
      success: true,
      output,
    })
  } catch (err: unknown) {
    const error = err as { stdout?: string; stderr?: string; message?: string }
    const output = (error.stdout || '') + (error.stderr || '') || error.message || 'Unknown error'

    return NextResponse.json({
      success: false,
      output,
    })
  }
}
