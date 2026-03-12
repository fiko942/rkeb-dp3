import { NextResponse } from 'next/server';
import { z } from 'zod';

import { verifyResult } from '@/server/services/tracking';

const schema = z.object({
  notes: z.string().max(500).optional()
});

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const body = await request.json().catch(() => ({}));
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: 'Invalid payload', issues: parsed.error.issues }, { status: 400 });
  }

  const params = await context.params;
  const data = await verifyResult(params.id, parsed.data.notes);
  return NextResponse.json({ data });
}
