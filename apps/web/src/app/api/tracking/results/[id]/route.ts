import { NextResponse } from 'next/server';

import { getTrackingResults } from '@/server/services/tracking';

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const data = await getTrackingResults({ alumniId: params.id });
  return NextResponse.json({ data });
}
