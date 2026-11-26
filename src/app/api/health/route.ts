import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: 'prism-interview',
    timestamp: new Date().toISOString(),
  });
}
