import { NextResponse } from 'next/server';
import { z } from 'zod';

import { runTrackingSimulation } from '@/server/services/tracking';

const schema = z.object({
  limit: z.number().int().positive().max(500).optional(),
  statuses: z.array(z.string()).optional()
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: 'Invalid payload', issues: parsed.error.issues }, { status: 400 });
  }

  const result = await runTrackingSimulation(parsed.data);
  return NextResponse.json({ data: result });
}
