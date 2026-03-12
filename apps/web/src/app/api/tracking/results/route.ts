import { NextResponse } from 'next/server';

import { getTrackingResults } from '@/server/services/tracking';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') ?? undefined;
  const take = Number(searchParams.get('take') ?? '100');

  const data = await getTrackingResults({ status, take });
  return NextResponse.json({ data });
}
